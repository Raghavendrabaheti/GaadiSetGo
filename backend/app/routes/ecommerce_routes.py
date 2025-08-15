"""
E-commerce routes - Products, shopping cart, orders, and reviews
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
import math
import uuid

from app.models.schemas import (
    Product, CartItem, Order, PaymentStatus, APIResponse, User
)
from app.core.auth import get_current_user
from app.database.connection import (
    get_products_collection,
    get_orders_collection,
    get_users_collection
)

router = APIRouter()


# ===== PRODUCT ROUTES =====

@router.get("/products", response_model=APIResponse)
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: str = Query("name", regex="^(name|price|rating|created_at)$"),
    sort_order: str = Query("asc", regex="^(asc|desc)$"),
    in_stock_only: bool = True
):
    """
    ## 🛍️ Get Products

    Retrieve a paginated list of products with filtering and sorting options.
    """
    products_collection = get_products_collection()

    # Build query filter
    query = {"is_active": True}

    if in_stock_only:
        query["stock_quantity"] = {"$gt": 0}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]

    if category:
        query["category"] = category

    if brand:
        query["brand"] = brand

    if min_price is not None:
        query["price"] = {"$gte": min_price}

    if max_price is not None:
        if "price" in query:
            query["price"]["$lte"] = max_price
        else:
            query["price"] = {"$lte": max_price}

    # Calculate skip for pagination
    skip = (page - 1) * limit

    # Get total count
    total = await products_collection.count_documents(query)

    # Prepare sort
    sort_direction = 1 if sort_order == "asc" else -1
    sort_criteria = [(sort_by, sort_direction)]

    # Get products
    cursor = products_collection.find(query).sort(
        sort_criteria).skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)

    # Convert ObjectId to string and add discount info
    for product in products:
        product["id"] = str(product["_id"])
        product.pop("_id", None)

        # Calculate discount percentage if original price exists
        if product.get("original_price") and product["original_price"] > product["price"]:
            discount = (
                (product["original_price"] - product["price"]) / product["original_price"]) * 100
            product["discount_percentage"] = round(discount, 2)
        else:
            product["discount_percentage"] = 0

    return APIResponse(
        success=True,
        message="Products retrieved successfully",
        data={
            "products": products,
            "pagination": {
                "current_page": page,
                "total_pages": math.ceil(total / limit),
                "total_items": total,
                "items_per_page": limit
            },
            "filters_applied": {
                "search": search,
                "category": category,
                "brand": brand,
                "min_price": min_price,
                "max_price": max_price,
                "in_stock_only": in_stock_only
            }
        }
    )


@router.get("/products/categories", response_model=APIResponse)
async def get_product_categories():
    """
    ## 📂 Get Product Categories

    Retrieve all available product categories.
    """
    products_collection = get_products_collection()

    # Get distinct categories for active products
    categories = await products_collection.distinct("category", {"is_active": True})

    # Get category counts
    category_counts = []
    for category in categories:
        count = await products_collection.count_documents({
            "category": category,
            "is_active": True,
            "stock_quantity": {"$gt": 0}
        })
        category_counts.append({
            "name": category,
            "count": count
        })

    # Sort by count (most products first)
    category_counts.sort(key=lambda x: x["count"], reverse=True)

    return APIResponse(
        success=True,
        message="Product categories retrieved successfully",
        data={"categories": category_counts}
    )


@router.get("/products/brands", response_model=APIResponse)
async def get_product_brands(category: Optional[str] = None):
    """
    ## 🏷️ Get Product Brands

    Retrieve all available product brands, optionally filtered by category.
    """
    products_collection = get_products_collection()

    # Build query
    query = {"is_active": True}
    if category:
        query["category"] = category

    # Get distinct brands
    brands = await products_collection.distinct("brand", query)

    # Get brand counts
    brand_counts = []
    for brand in brands:
        brand_query = query.copy()
        brand_query["brand"] = brand
        brand_query["stock_quantity"] = {"$gt": 0}

        count = await products_collection.count_documents(brand_query)
        brand_counts.append({
            "name": brand,
            "count": count
        })

    # Sort alphabetically
    brand_counts.sort(key=lambda x: x["name"])

    return APIResponse(
        success=True,
        message="Product brands retrieved successfully",
        data={
            "brands": brand_counts,
            "filtered_by_category": category
        }
    )


@router.get("/products/{product_id}", response_model=APIResponse)
async def get_product_details(product_id: str):
    """
    ## 🔍 Get Product Details

    Retrieve detailed information about a specific product.
    """
    if not ObjectId.is_valid(product_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID"
        )

    products_collection = get_products_collection()

    product = await products_collection.find_one({
        "_id": ObjectId(product_id),
        "is_active": True
    })

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    # Convert ObjectId to string and add computed fields
    product["id"] = str(product["_id"])
    product.pop("_id", None)

    # Calculate discount percentage
    if product.get("original_price") and product["original_price"] > product["price"]:
        discount = ((product["original_price"] -
                    product["price"]) / product["original_price"]) * 100
        product["discount_percentage"] = round(discount, 2)
    else:
        product["discount_percentage"] = 0

    # Add stock status
    if product["stock_quantity"] == 0:
        product["stock_status"] = "out_of_stock"
    elif product["stock_quantity"] <= 5:
        product["stock_status"] = "low_stock"
    else:
        product["stock_status"] = "in_stock"

    # Get related products (same category, different product)
    related_products = await products_collection.find({
        "category": product["category"],
        "_id": {"$ne": ObjectId(product_id)},
        "is_active": True,
        "stock_quantity": {"$gt": 0}
    }).limit(4).to_list(length=4)

    # Convert related products ObjectIds
    for related in related_products:
        related["id"] = str(related["_id"])
        related.pop("_id", None)

    return APIResponse(
        success=True,
        message="Product details retrieved successfully",
        data={
            "product": product,
            "related_products": related_products
        }
    )


# ===== SHOPPING CART ROUTES =====

@router.post("/cart/add", response_model=APIResponse)
async def add_to_cart(
    product_id: str,
    quantity: int = Query(1, ge=1),
    current_user: User = Depends(get_current_user)
):
    """
    ## 🛒 Add to Cart

    Add a product to the user's shopping cart.
    """
    if not ObjectId.is_valid(product_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID"
        )

    products_collection = get_products_collection()
    users_collection = get_users_collection()

    # Validate product exists and is available
    product = await products_collection.find_one({
        "_id": ObjectId(product_id),
        "is_active": True
    })

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    if product["stock_quantity"] < quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {product['stock_quantity']} items available in stock"
        )

    # Get user's current cart
    user = await users_collection.find_one({"_id": ObjectId(current_user.id)})
    cart = user.get("cart", [])

    # Check if product already in cart
    existing_item = None
    for item in cart:
        if str(item["product_id"]) == product_id:
            existing_item = item
            break

    if existing_item:
        # Update quantity
        new_quantity = existing_item["quantity"] + quantity
        if new_quantity > product["stock_quantity"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot add {quantity} more items. Only {product['stock_quantity']} total available"
            )
        existing_item["quantity"] = new_quantity
    else:
        # Add new item to cart
        cart_item = {
            "product_id": ObjectId(product_id),
            "quantity": quantity,
            "price": product["price"],
            "added_at": datetime.now()
        }
        cart.append(cart_item)

    # Update user's cart
    await users_collection.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"cart": cart, "updated_at": datetime.now()}}
    )

    return APIResponse(
        success=True,
        message="Product added to cart successfully",
        data={
            "product_id": product_id,
            "quantity_added": quantity,
            "cart_items_count": len(cart)
        }
    )


@router.get("/cart", response_model=APIResponse)
async def get_cart(current_user: User = Depends(get_current_user)):
    """
    ## 🛒 Get Shopping Cart

    Retrieve the user's current shopping cart with product details.
    """
    users_collection = get_users_collection()
    products_collection = get_products_collection()

    # Get user's cart
    user = await users_collection.find_one({"_id": ObjectId(current_user.id)})
    cart = user.get("cart", [])

    if not cart:
        return APIResponse(
            success=True,
            message="Cart is empty",
            data={
                "items": [],
                "total_amount": 0,
                "total_items": 0
            }
        )

    # Enrich cart items with product details
    cart_items = []
    total_amount = 0

    for item in cart:
        product = await products_collection.find_one({"_id": item["product_id"]})

        if product and product.get("is_active", False):
            # Check stock availability
            is_available = product["stock_quantity"] >= item["quantity"]
            item_total = item["quantity"] * item["price"]

            cart_item = {
                "product_id": str(item["product_id"]),
                "product_name": product["name"],
                "product_image": product["images"][0] if product["images"] else None,
                "unit_price": item["price"],
                # Current price might be different
                "current_price": product["price"],
                "quantity": item["quantity"],
                "subtotal": item_total,
                "is_available": is_available,
                "stock_quantity": product["stock_quantity"],
                "added_at": item.get("added_at")
            }

            cart_items.append(cart_item)
            if is_available:
                total_amount += item_total

    # Remove unavailable items from cart
    available_cart = [item for item in cart if any(
        str(item["product_id"]
            ) == cart_item["product_id"] and cart_item["is_available"]
        for cart_item in cart_items
    )]

    if len(available_cart) != len(cart):
        await users_collection.update_one(
            {"_id": ObjectId(current_user.id)},
            {"$set": {"cart": available_cart, "updated_at": datetime.now()}}
        )

    return APIResponse(
        success=True,
        message="Cart retrieved successfully",
        data={
            "items": cart_items,
            "total_amount": total_amount,
            "total_items": sum(item["quantity"] for item in cart_items if item["is_available"])
        }
    )


@router.patch("/cart/update/{product_id}", response_model=APIResponse)
async def update_cart_item(
    product_id: str,
    quantity: int = Query(..., ge=0),
    current_user: User = Depends(get_current_user)
):
    """
    ## 🔄 Update Cart Item

    Update the quantity of a product in the cart (0 quantity removes the item).
    """
    if not ObjectId.is_valid(product_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid product ID"
        )

    users_collection = get_users_collection()
    products_collection = get_products_collection()

    # Get user's cart
    user = await users_collection.find_one({"_id": ObjectId(current_user.id)})
    cart = user.get("cart", [])

    # Find the item in cart
    item_found = False
    for i, item in enumerate(cart):
        if str(item["product_id"]) == product_id:
            item_found = True

            if quantity == 0:
                # Remove item from cart
                cart.pop(i)
                message = "Item removed from cart"
            else:
                # Validate stock availability
                product = await products_collection.find_one({"_id": ObjectId(product_id)})
                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Product not found"
                    )

                if product["stock_quantity"] < quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Only {product['stock_quantity']} items available in stock"
                    )

                # Update quantity
                cart[i]["quantity"] = quantity
                message = "Cart item updated successfully"
            break

    if not item_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in cart"
        )

    # Update user's cart
    await users_collection.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"cart": cart, "updated_at": datetime.now()}}
    )

    return APIResponse(
        success=True,
        message=message,
        data={
            "product_id": product_id,
            "new_quantity": quantity,
            "cart_items_count": len(cart)
        }
    )


@router.delete("/cart/clear", response_model=APIResponse)
async def clear_cart(current_user: User = Depends(get_current_user)):
    """
    ## 🗑️ Clear Cart

    Remove all items from the user's shopping cart.
    """
    users_collection = get_users_collection()

    await users_collection.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"cart": [], "updated_at": datetime.now()}}
    )

    return APIResponse(
        success=True,
        message="Cart cleared successfully",
        data={"cart_items_count": 0}
    )


# ===== ORDER ROUTES =====

@router.post("/orders", response_model=APIResponse)
async def create_order(
    shipping_address: Dict[str, str],
    current_user: User = Depends(get_current_user)
):
    """
    ## 📦 Create Order

    Create a new order from the user's cart.
    """
    users_collection = get_users_collection()
    products_collection = get_products_collection()
    orders_collection = get_orders_collection()

    # Get user's cart
    user = await users_collection.find_one({"_id": ObjectId(current_user.id)})
    cart = user.get("cart", [])

    if not cart:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty"
        )

    # Validate required shipping address fields
    required_fields = ["name", "phone", "address", "city", "state", "pincode"]
    for field in required_fields:
        if field not in shipping_address or not shipping_address[field].strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing required shipping address field: {field}"
            )

    # Validate cart items and calculate total
    order_items = []
    total_amount = 0

    for cart_item in cart:
        product = await products_collection.find_one({"_id": cart_item["product_id"]})

        if not product or not product.get("is_active", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product no longer available"
            )

        if product["stock_quantity"] < cart_item["quantity"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for {product['name']}. Only {product['stock_quantity']} available"
            )

        # Use current product price
        item_total = cart_item["quantity"] * product["price"]
        total_amount += item_total

        order_items.append({
            "product_id": cart_item["product_id"],
            "quantity": cart_item["quantity"],
            "price": product["price"],
            "product_name": product["name"],
            "product_image": product["images"][0] if product["images"] else None
        })

    # Generate order number
    order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

    # Create order
    order = {
        "user_id": ObjectId(current_user.id),
        "order_number": order_number,
        "items": order_items,
        "total_amount": total_amount,
        "shipping_address": shipping_address,
        "payment_status": PaymentStatus.PENDING,
        "order_status": "pending",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    # Insert order
    result = await orders_collection.insert_one(order)
    order["id"] = str(result.inserted_id)
    order.pop("_id", None)

    # Update product stock quantities
    for cart_item in cart:
        await products_collection.update_one(
            {"_id": cart_item["product_id"]},
            {"$inc": {"stock_quantity": -cart_item["quantity"]}}
        )

    # Clear user's cart
    await users_collection.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"cart": [], "updated_at": datetime.now()}}
    )

    # Convert ObjectIds to strings for response
    order["user_id"] = str(order["user_id"])
    for item in order["items"]:
        item["product_id"] = str(item["product_id"])

    return APIResponse(
        success=True,
        message="Order created successfully",
        data={"order": order}
    )


@router.get("/orders", response_model=APIResponse)
async def get_user_orders(
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    status: Optional[str] = None
):
    """
    ## 📋 Get User Orders

    Retrieve the user's orders with optional status filtering.
    """
    orders_collection = get_orders_collection()

    # Build query
    query = {"user_id": ObjectId(current_user.id)}
    if status:
        query["order_status"] = status

    # Calculate skip for pagination
    skip = (page - 1) * limit

    # Get total count
    total = await orders_collection.count_documents(query)

    # Get orders (most recent first)
    cursor = orders_collection.find(query).sort(
        "created_at", -1).skip(skip).limit(limit)
    orders = await cursor.to_list(length=limit)

    # Convert ObjectIds to strings
    for order in orders:
        order["id"] = str(order["_id"])
        order.pop("_id", None)
        order["user_id"] = str(order["user_id"])

        for item in order["items"]:
            item["product_id"] = str(item["product_id"])

    return APIResponse(
        success=True,
        message="Orders retrieved successfully",
        data={
            "orders": orders,
            "pagination": {
                "current_page": page,
                "total_pages": math.ceil(total / limit),
                "total_items": total,
                "items_per_page": limit
            }
        }
    )


@router.get("/orders/{order_id}", response_model=APIResponse)
async def get_order_details(
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## 📄 Get Order Details

    Retrieve detailed information about a specific order.
    """
    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID"
        )

    orders_collection = get_orders_collection()

    order = await orders_collection.find_one({
        "_id": ObjectId(order_id),
        "user_id": ObjectId(current_user.id)
    })

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    # Convert ObjectIds to strings
    order["id"] = str(order["_id"])
    order.pop("_id", None)
    order["user_id"] = str(order["user_id"])

    for item in order["items"]:
        item["product_id"] = str(item["product_id"])

    return APIResponse(
        success=True,
        message="Order details retrieved successfully",
        data={"order": order}
    )


@router.patch("/orders/{order_id}/cancel", response_model=APIResponse)
async def cancel_order(
    order_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    ## ❌ Cancel Order

    Cancel an order (only allowed for pending orders).
    """
    if not ObjectId.is_valid(order_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID"
        )

    orders_collection = get_orders_collection()
    products_collection = get_products_collection()

    order = await orders_collection.find_one({
        "_id": ObjectId(order_id),
        "user_id": ObjectId(current_user.id)
    })

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order["order_status"] != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel order with status: {order['order_status']}"
        )

    # Restore product stock quantities
    for item in order["items"]:
        await products_collection.update_one(
            {"_id": item["product_id"]},
            {"$inc": {"stock_quantity": item["quantity"]}}
        )

    # Update order status
    await orders_collection.update_one(
        {"_id": ObjectId(order_id)},
        {
            "$set": {
                "order_status": "cancelled",
                "cancelled_at": datetime.now(),
                "updated_at": datetime.now()
            }
        }
    )

    return APIResponse(
        success=True,
        message="Order cancelled successfully",
        data={"order_id": order_id}
    )


# ===== SEARCH & RECOMMENDATIONS =====

@router.get("/search", response_model=APIResponse)
async def search_products(
    q: str = Query(..., min_length=2),
    limit: int = Query(10, ge=1, le=20)
):
    """
    ## 🔍 Search Products

    Fast product search with suggestions.
    """
    products_collection = get_products_collection()

    # Build search query
    search_query = {
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"brand": {"$regex": q, "$options": "i"}},
            {"category": {"$regex": q, "$options": "i"}}
        ],
        "is_active": True,
        "stock_quantity": {"$gt": 0}
    }

    # Get products
    cursor = products_collection.find(search_query).limit(limit)
    products = await cursor.to_list(length=limit)

    # Convert ObjectIds and add basic info
    results = []
    for product in products:
        results.append({
            "id": str(product["_id"]),
            "name": product["name"],
            "brand": product["brand"],
            "category": product["category"],
            "price": product["price"],
            "image": product["images"][0] if product["images"] else None,
            "rating": product.get("rating", 0)
        })

    return APIResponse(
        success=True,
        message="Search completed successfully",
        data={
            "query": q,
            "results": results,
            "count": len(results)
        }
    )
