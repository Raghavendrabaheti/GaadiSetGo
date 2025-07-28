"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShoppingCart,
  Search,
  Filter,
  Star,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Heart,
  Eye,
  Truck,
  Shield,
  Award,
} from "lucide-react"

interface ECommerceSectionProps {
  theme: string
}

export default function ECommerceSection({ theme }: ECommerceSectionProps) {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Michelin Primacy 4 Tyres (Set of 4)",
      price: 25000,
      originalPrice: 28000,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100&text=Michelin+Tyres",
      brand: "Michelin",
    },
    {
      id: "2",
      name: "Mobil 1 Synthetic Engine Oil 5W-30",
      price: 2500,
      originalPrice: 3000,
      quantity: 2,
      image: "/placeholder.svg?height=100&width=100&text=Mobil+Oil",
      brand: "Mobil",
    },
  ])

  const products = [
    {
      id: "1",
      name: "Michelin Primacy 4 Tyres (Set of 4)",
      description:
        "Premium touring tires with excellent wet grip and long-lasting performance. Suitable for sedans and hatchbacks.",
      price: 25000,
      originalPrice: 28000,
      rating: 4.5,
      reviews: 128,
      category: "Tyres",
      brand: "Michelin",
      image: "/placeholder.svg?height=300&width=300&text=Michelin+Primacy+4",
      inStock: true,
      features: ["Wet Grip A", "Fuel Efficiency B", "Noise Level 68dB"],
      warranty: "5 Years",
    },
    {
      id: "2",
      name: "Mobil 1 Synthetic Engine Oil 5W-30",
      description:
        "Advanced full synthetic motor oil that provides exceptional cleaning power, wear protection and overall performance.",
      price: 2500,
      originalPrice: 3000,
      rating: 4.8,
      reviews: 256,
      category: "Oils",
      brand: "Mobil",
      image: "/placeholder.svg?height=300&width=300&text=Mobil+1+Oil",
      inStock: true,
      features: ["Full Synthetic", "Advanced Cleaning", "Wear Protection"],
      warranty: "1 Year",
    },
    {
      id: "3",
      name: "Bosch S4 Car Battery 12V 74Ah",
      description:
        "Reliable car battery with advanced technology for consistent performance in all weather conditions.",
      price: 8500,
      originalPrice: 9500,
      rating: 4.6,
      reviews: 89,
      category: "Accessories",
      brand: "Bosch",
      image: "/placeholder.svg?height=300&width=300&text=Bosch+Battery",
      inStock: false,
      features: ["Maintenance Free", "Vibration Resistant", "Long Life"],
      warranty: "3 Years",
    },
    {
      id: "4",
      name: "Philips LED Headlight Bulbs H4",
      description: "Ultra bright LED headlight bulbs with 6000K white light for better visibility and style.",
      price: 1200,
      originalPrice: 1500,
      rating: 4.3,
      reviews: 67,
      category: "Accessories",
      brand: "Philips",
      image: "/placeholder.svg?height=300&width=300&text=Philips+LED",
      inStock: true,
      features: ["6000K White Light", "Easy Installation", "Long Lasting"],
      warranty: "2 Years",
    },
  ]

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalSavings = () => {
    return cartItems.reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0)
  }

  const getCardBackground = () => {
    return theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
  }

  const getTextColor = () => {
    return theme === "dark" ? "text-slate-100" : "text-slate-900"
  }

  const getMutedTextColor = () => {
    return theme === "dark" ? "text-slate-400" : "text-slate-600"
  }

  const getGradientPrimary = () => {
    return theme === "dark"
      ? "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      : "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
  }

  const getInputBackground = () => {
    return theme === "dark"
      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1
            className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
              theme === "dark" ? "from-purple-400 to-pink-400" : "from-purple-600 to-pink-600"
            }`}
          >
            Automotive Store
          </h1>
          <p className={`mt-1 transition-colors duration-300 ${getMutedTextColor()}`}>
            Premium automotive products with guaranteed quality
          </p>
        </div>
        <Button className={`relative bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart ({cartItems.length})
          {cartItems.length > 0 && (
            <Badge
              className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center transition-all duration-300 ${
                theme === "dark" ? "bg-red-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList
          className={`grid w-full grid-cols-3 h-12 transition-all duration-300 ${
            theme === "dark" ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <TabsTrigger
            value="products"
            className={`font-medium transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
            }`}
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="cart"
            className={`font-medium transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
            }`}
          >
            Cart ({cartItems.length})
          </TabsTrigger>
          <TabsTrigger
            value="checkout"
            className={`font-medium transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
            }`}
          >
            Checkout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Search and Filter */}
          <Card
            className={`border-0 shadow-sm transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-slate-800 to-slate-900"
                : "bg-gradient-to-r from-purple-50 to-pink-50"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                  />
                  <Input
                    placeholder="Search products..."
                    className={`pl-10 h-12 transition-all duration-300 ${getInputBackground()}`}
                  />
                </div>
                <Select>
                  <SelectTrigger
                    className={`w-40 h-12 transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-slate-100"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  >
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent
                    className={theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}
                  >
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="tyres">Tyres</SelectItem>
                    <SelectItem value="oils">Oils</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger
                    className={`w-32 h-12 transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-slate-100"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  >
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent
                    className={theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}
                  >
                    <SelectItem value="all">All Brands</SelectItem>
                    <SelectItem value="michelin">Michelin</SelectItem>
                    <SelectItem value="mobil">Mobil</SelectItem>
                    <SelectItem value="bosch">Bosch</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className={`h-12 px-6 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${getCardBackground()}`}
              >
                <div className="relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {!product.inStock && (
                      <Badge
                        variant="destructive"
                        className={`shadow-md transition-all duration-300 ${
                          theme === "dark" ? "bg-red-600 text-white" : "bg-red-600 text-white"
                        }`}
                      >
                        Out of Stock
                      </Badge>
                    )}
                    {product.originalPrice > product.price && (
                      <Badge
                        className={`shadow-md transition-all duration-300 ${
                          theme === "dark" ? "bg-green-600 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`h-8 w-8 shadow-md transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                          : "bg-white hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className={`h-8 w-8 shadow-md transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                          : "bg-white hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className={`text-xs transition-all duration-300 ${
                          theme === "dark" ? "bg-slate-600 text-slate-200" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {product.category}
                      </Badge>
                      <span className={`text-xs font-medium transition-colors duration-300 ${getMutedTextColor()}`}>
                        {product.brand}
                      </span>
                    </div>

                    <h3
                      className={`font-bold text-lg line-clamp-2 min-h-[3.5rem] transition-colors duration-300 ${getTextColor()}`}
                    >
                      {product.name}
                    </h3>

                    <p
                      className={`text-sm line-clamp-2 min-h-[2.5rem] transition-colors duration-300 ${getMutedTextColor()}`}
                    >
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}>
                          {product.rating}
                        </span>
                        <span className={`text-sm transition-colors duration-300 ${getMutedTextColor()}`}>
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className={`h-3 w-3 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                        <span className={`text-xs ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                          {product.warranty}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 2).map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`text-xs transition-all duration-300 ${
                            theme === "dark" ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"
                          }`}
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                          >
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span
                              className={`text-sm line-through transition-colors duration-300 ${getMutedTextColor()}`}
                            >
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {product.originalPrice > product.price && (
                          <p
                            className={`text-xs font-medium ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                          >
                            Save ₹{(product.originalPrice - product.price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    className={`w-full mt-4 h-12 bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}
                    disabled={!product.inStock}
                    onClick={() => {
                      const existingItem = cartItems.find((item) => item.id === product.id)
                      if (existingItem) {
                        updateQuantity(product.id, 1)
                      } else {
                        setCartItems([
                          ...cartItems,
                          {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            quantity: 1,
                            image: product.image,
                            brand: product.brand,
                          },
                        ])
                      }
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cart" className="space-y-6">
          {cartItems.length === 0 ? (
            <Card className={`border-0 shadow-lg transition-all duration-300 ${getCardBackground()}`}>
              <CardContent className="p-12 text-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${
                    theme === "dark" ? "bg-slate-700" : "bg-gray-100"
                  }`}
                >
                  <ShoppingCart className={`h-12 w-12 transition-colors duration-300 ${getMutedTextColor()}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${getTextColor()}`}>
                  Your cart is empty
                </h3>
                <p className={`mb-6 transition-colors duration-300 ${getMutedTextColor()}`}>
                  Discover our amazing automotive products and add them to your cart
                </p>
                <Button className={`bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card
                    key={item.id}
                    className={`border-0 shadow-md transition-all duration-300 ${getCardBackground()}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-6">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className={`font-bold text-lg transition-colors duration-300 ${getTextColor()}`}>
                                {item.name}
                              </h4>
                              <p className={`text-sm transition-colors duration-300 ${getMutedTextColor()}`}>
                                {item.brand}
                              </p>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className={`transition-all duration-300 ${
                                theme === "dark"
                                  ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  : "text-red-500 hover:text-red-700 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                                >
                                  ₹{item.price.toLocaleString()}
                                </span>
                                <span
                                  className={`text-sm line-through transition-colors duration-300 ${getMutedTextColor()}`}
                                >
                                  ₹{item.originalPrice.toLocaleString()}
                                </span>
                              </div>
                              <p className={`text-xs ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                                Save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex items-center space-x-3">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                className={`h-8 w-8 transition-all duration-300 ${
                                  theme === "dark"
                                    ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                                    : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span
                                className={`w-12 text-center font-medium text-lg transition-colors duration-300 ${getTextColor()}`}
                              >
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className={`h-8 w-8 transition-all duration-300 ${
                                  theme === "dark"
                                    ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                                    : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <Card
                className={`border-0 shadow-lg transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-slate-800 to-slate-900"
                    : "bg-gradient-to-r from-purple-50 to-pink-50"
                }`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className={`flex justify-between text-lg transition-colors duration-300 ${getTextColor()}`}>
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                      <span>Total Savings:</span>
                      <span className="font-medium">₹{getTotalSavings().toLocaleString()}</span>
                    </div>
                    <div
                      className={`flex justify-between text-sm transition-colors duration-300 ${getMutedTextColor()}`}
                    >
                      <span>Shipping:</span>
                      <span>FREE</span>
                    </div>
                    <div className="border-t pt-4">
                      <div
                        className={`flex justify-between text-xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                      >
                        <span>Total:</span>
                        <span>₹{getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      className={`w-full h-12 text-lg bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="checkout" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card className={`border-0 shadow-lg transition-all duration-300 ${getCardBackground()}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center transition-colors duration-300 ${getTextColor()}`}>
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}>
                        First Name
                      </label>
                      <Input
                        placeholder="John"
                        className={`h-12 transition-all duration-300 ${getInputBackground()}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}>
                        Last Name
                      </label>
                      <Input placeholder="Doe" className={`h-12 transition-all duration-300 ${getInputBackground()}`} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}>
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      className={`h-12 transition-all duration-300 ${getInputBackground()}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}>
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={`h-12 transition-all duration-300 ${getInputBackground()}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}>
                      Address
                    </label>
                    <Input
                      placeholder="123 Main Street, Apartment 4B"
                      className={`h-12 transition-all duration-300 ${getInputBackground()}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}>
                        City
                      </label>
                      <Input
                        placeholder="New Delhi"
                        className={`h-12 transition-all duration-300 ${getInputBackground()}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}>
                        PIN Code
                      </label>
                      <Input
                        placeholder="110001"
                        className={`h-12 transition-all duration-300 ${getInputBackground()}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-0 shadow-lg transition-all duration-300 ${getCardBackground()}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center transition-colors duration-300 ${getTextColor()}`}>
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                        theme === "dark"
                          ? "border-slate-600 hover:bg-slate-700/50"
                          : "border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input type="radio" name="payment" value="card" defaultChecked className="text-primary" />
                      <CreditCard className="h-5 w-5" />
                      <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                        Credit/Debit Card
                      </span>
                    </label>
                    <label
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                        theme === "dark"
                          ? "border-slate-600 hover:bg-slate-700/50"
                          : "border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input type="radio" name="payment" value="upi" className="text-primary" />
                      <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">₹</span>
                      </div>
                      <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                        UPI Payment
                      </span>
                    </label>
                    <label
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                        theme === "dark"
                          ? "border-slate-600 hover:bg-slate-700/50"
                          : "border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <input type="radio" name="payment" value="cod" className="text-primary" />
                      <Truck className="h-5 w-5" />
                      <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                        Cash on Delivery
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className={`border-0 shadow-lg sticky top-6 transition-all duration-300 ${getCardBackground()}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center transition-colors duration-300 ${getTextColor()}`}>
                    <Award className="mr-2 h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                          theme === "dark" ? "bg-slate-700/30" : "bg-slate-50"
                        }`}
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p
                            className={`font-medium text-sm line-clamp-1 transition-colors duration-300 ${getTextColor()}`}
                          >
                            {item.name}
                          </p>
                          <p className={`text-xs transition-colors duration-300 ${getMutedTextColor()}`}>
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className={`flex justify-between transition-colors duration-300 ${getTextColor()}`}>
                      <span>Subtotal</span>
                      <span>₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                      <span>Savings</span>
                      <span>-₹{getTotalSavings().toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between transition-colors duration-300 ${getTextColor()}`}>
                      <span>Shipping</span>
                      <span className={theme === "dark" ? "text-green-400" : "text-green-600"}>FREE</span>
                    </div>
                    <div className={`flex justify-between transition-colors duration-300 ${getTextColor()}`}>
                      <span>Tax (GST)</span>
                      <span>₹{Math.round(getTotalPrice() * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div
                        className={`flex justify-between text-xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
                      >
                        <span>Total</span>
                        <span>₹{(getTotalPrice() + Math.round(getTotalPrice() * 0.18)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className={`w-full h-12 text-lg bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Place Secure Order
                  </Button>

                  <div className={`text-center text-xs transition-colors duration-300 ${getMutedTextColor()}`}>
                    <p>🔒 Your payment information is secure and encrypted</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
