"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MapPin,
  Car,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Navigation,
  Star,
  Zap,
  Shield,
} from "lucide-react"

interface ParkingDashboardProps {
  theme: string
}

export default function ParkingDashboard({ theme }: ParkingDashboardProps) {
  const [selectedLocation, setSelectedLocation] = useState("delhi")
  const [selectedLot, setSelectedLot] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState({
    vehicleNumber: "",
    startTime: "",
    endTime: "",
  })

  const locations = [
    { value: "delhi", label: "New Delhi" },
    { value: "mumbai", label: "Mumbai" },
    { value: "bangalore", label: "Bangalore" },
    { value: "chennai", label: "Chennai" },
    { value: "kolkata", label: "Kolkata" },
    { value: "hyderabad", label: "Hyderabad" },
    { value: "pune", label: "Pune" },
    { value: "ahmedabad", label: "Ahmedabad" },
  ]

  const parkingLots = [
    {
      id: "1",
      name: "City Center Mall",
      location: "Connaught Place, New Delhi",
      capacity: 200,
      available: 45,
      price: "₹20/hour",
      distance: "0.5 km",
      rating: 4.5,
      features: ["CCTV", "24/7 Security", "EV Charging"],
      image: "/placeholder.svg?height=200&width=300&text=City+Center+Mall",
    },
    {
      id: "2",
      name: "Metro Station Hub",
      location: "Rajiv Chowk Metro, New Delhi",
      capacity: 150,
      available: 12,
      price: "₹15/hour",
      distance: "1.2 km",
      rating: 4.2,
      features: ["Metro Access", "Covered Parking"],
      image: "/placeholder.svg?height=200&width=300&text=Metro+Station+Hub",
    },
    {
      id: "3",
      name: "Business District",
      location: "Cyber City, Gurgaon",
      capacity: 300,
      available: 89,
      price: "₹25/hour",
      distance: "2.1 km",
      rating: 4.7,
      features: ["Premium Location", "Valet Service", "Car Wash"],
      image: "/placeholder.svg?height=200&width=300&text=Business+District",
    },
  ]

  const myBookings = [
    {
      id: "1",
      lotName: "City Center Mall",
      spotNumber: "A-15",
      vehicleNumber: "DL-01-AB-1234",
      startTime: "2024-01-15 10:00",
      endTime: "2024-01-15 14:00",
      status: "active",
      amount: "₹80",
    },
    {
      id: "2",
      lotName: "Metro Station Hub",
      spotNumber: "B-08",
      vehicleNumber: "DL-01-CD-5678",
      startTime: "2024-01-14 09:00",
      endTime: "2024-01-14 18:00",
      status: "completed",
      amount: "₹135",
    },
  ]

  const handleBooking = () => {
    console.log("Booking:", { selectedLot, ...bookingData })
  }

  const getAvailabilityColor = (available: number, capacity: number) => {
    const percentage = (available / capacity) * 100
    if (percentage > 30) {
      return theme === "dark"
        ? "text-green-400 bg-green-900/30 border-green-700"
        : "text-green-600 bg-green-50 border-green-200"
    }
    if (percentage > 10) {
      return theme === "dark"
        ? "text-yellow-400 bg-yellow-900/30 border-yellow-700"
        : "text-yellow-600 bg-yellow-50 border-yellow-200"
    }
    return theme === "dark" ? "text-red-400 bg-red-900/30 border-red-700" : "text-red-600 bg-red-50 border-red-200"
  }

  const getCardBackground = () => {
    return theme === "dark"
      ? "bg-slate-800 border-slate-700 hover:bg-slate-750"
      : "bg-white border-slate-200 hover:bg-slate-50"
  }

  const getTextColor = () => {
    return theme === "dark" ? "text-slate-100" : "text-slate-900"
  }

  const getMutedTextColor = () => {
    return theme === "dark" ? "text-slate-400" : "text-slate-600"
  }

  const getGradientPrimary = () => {
    return theme === "dark"
      ? "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      : "from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="text-center sm:text-left">
          <h1
            className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${theme === "dark" ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
              }`}
          >
            Smart Parking Dashboard
          </h1>
          <p className={`mt-1 text-sm sm:text-base transition-colors duration-300 ${getMutedTextColor()}`}>
            Find and book parking spots with real-time availability
          </p>
        </div>

        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-3">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger
              className={`w-full sm:w-48 h-12 sm:h-10 transition-all duration-300 ${theme === "dark"
                  ? "bg-slate-700 border-slate-600 text-slate-100"
                  : "bg-white border-slate-300 text-slate-900"
                }`}
            >
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
              {locations.map((location) => (
                <SelectItem
                  key={location.value}
                  value={location.value}
                  className={
                    theme === "dark" ? "text-slate-100 focus:bg-slate-700" : "text-slate-900 focus:bg-slate-100"
                  }
                >
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button className={`w-full sm:w-auto bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}>
                <Plus className="mr-2 h-4 w-4" />
                Quick Book
              </Button>
            </DialogTrigger>
            <DialogContent
              className={`mx-2 sm:mx-0 w-[calc(100vw-1rem)] sm:max-w-md transition-all duration-300 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`}
            >
              <DialogHeader>
                <DialogTitle className={`transition-colors duration-300 ${getTextColor()}`}>
                  Quick Parking Booking
                </DialogTitle>
                <DialogDescription className={`transition-colors duration-300 ${getMutedTextColor()}`}>
                  Book a parking spot for immediate use
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle" className={`transition-colors duration-300 ${getTextColor()}`}>
                    Vehicle Number
                  </Label>
                  <Input
                    id="vehicle"
                    placeholder="DL-01-AB-1234"
                    className={`h-12 sm:h-10 text-base sm:text-sm transition-all duration-300 ${theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
                      }`}
                    value={bookingData.vehicleNumber}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, vehicleNumber: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start" className={`transition-colors duration-300 ${getTextColor()}`}>
                      Start Time
                    </Label>
                    <Input
                      id="start"
                      type="datetime-local"
                      className={`h-12 sm:h-10 text-base sm:text-sm transition-all duration-300 ${theme === "dark"
                          ? "bg-slate-700 border-slate-600 text-slate-100"
                          : "bg-white border-slate-300 text-slate-900"
                        }`}
                      value={bookingData.startTime}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end" className={`transition-colors duration-300 ${getTextColor()}`}>
                      End Time
                    </Label>
                    <Input
                      id="end"
                      type="datetime-local"
                      className={`h-12 sm:h-10 text-base sm:text-sm transition-all duration-300 ${theme === "dark"
                          ? "bg-slate-700 border-slate-600 text-slate-100"
                          : "bg-white border-slate-300 text-slate-900"
                        }`}
                      value={bookingData.endTime}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handleBooking} className="w-full h-12 sm:h-10">
                  <Zap className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList
          className={`grid w-full grid-cols-2 h-12 transition-all duration-300 ${theme === "dark" ? "bg-slate-700" : "bg-slate-100"
            }`}
        >
          <TabsTrigger
            value="available"
            className={`font-medium transition-all duration-300 text-sm sm:text-base ${theme === "dark"
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
              }`}
          >
            Available Parking
          </TabsTrigger>
          <TabsTrigger
            value="bookings"
            className={`font-medium transition-all duration-300 text-sm sm:text-base ${theme === "dark"
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
              }`}
          >
            My Bookings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 sm:space-y-6">
          {/* Search and Filter */}
          <Card
            className={`border-0 shadow-sm transition-all duration-300 ${theme === "dark"
                ? "bg-gradient-to-r from-slate-800 to-slate-900"
                : "bg-gradient-to-r from-blue-50 to-purple-50"
              }`}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <div className="relative flex-1">
                  <Search
                    className={`absolute left-3 top-3 sm:top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                  />
                  <Input
                    placeholder="Search parking lots..."
                    className={`pl-10 h-12 sm:h-10 text-base sm:text-sm transition-all duration-300 ${theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
                      }`}
                  />
                </div>
                <Button
                  variant="outline"
                  className={`h-12 sm:h-10 px-4 sm:px-6 transition-all duration-300 ${theme === "dark"
                      ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parking Lots Grid */}
          <div className="grid gap-4 sm:gap-6">
            {parkingLots.map((lot) => (
              <Card
                key={lot.id}
                className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md ${getCardBackground()}`}
              >
                <div className="sm:flex">
                  <div className="sm:w-1/3">
                    <img
                      src={lot.image || "/placeholder.svg"}
                      alt={lot.name}
                      className="w-full h-48 sm:h-full object-cover"
                    />
                  </div>
                  <div className="sm:w-2/3 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg sm:text-xl mb-1 transition-colors duration-300 ${getTextColor()}`}>
                          {lot.name}
                        </h3>
                        <div
                          className={`flex items-center mb-2 text-sm transition-colors duration-300 ${getMutedTextColor()}`}
                        >
                          <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">{lot.location}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                              {lot.rating}
                            </span>
                          </div>
                          <span className={`transition-colors duration-300 ${getMutedTextColor()}`}>•</span>
                          <span className={`text-sm transition-colors duration-300 ${getMutedTextColor()}`}>
                            {lot.distance} away
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={`px-3 py-1 font-medium border transition-all duration-300 self-start ${getAvailabilityColor(lot.available, lot.capacity)}`}
                        variant="secondary"
                      >
                        {lot.available} spots
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {lot.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`text-xs transition-all duration-300 ${theme === "dark" ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"
                            }`}
                        >
                          <Shield className="mr-1 h-3 w-3" />
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
                      <div>
                        <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Capacity</span>
                        <p className={`font-semibold transition-colors duration-300 ${getTextColor()}`}>
                          {lot.capacity} spots
                        </p>
                      </div>
                      <div>
                        <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Price</span>
                        <p
                          className={`font-semibold transition-colors duration-300 ${theme === "dark" ? "text-green-400" : "text-green-600"
                            }`}
                        >
                          {lot.price}
                        </p>
                      </div>
                      <div>
                        <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Distance</span>
                        <p className={`font-semibold transition-colors duration-300 ${getTextColor()}`}>
                          {lot.distance}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button className={`flex-1 h-11 sm:h-10 bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}>
                        <Car className="mr-2 h-4 w-4" />
                        Book Spot
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex-1 h-11 sm:h-10 transition-all duration-300 ${theme === "dark"
                            ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                            : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                      >
                        <Navigation className="mr-2 h-4 w-4" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="grid gap-4">
            {myBookings.map((booking) => (
              <Card
                key={booking.id}
                className={`border-0 shadow-md transition-all duration-300 ${getCardBackground()}`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-bold text-lg transition-colors duration-300 ${getTextColor()}`}>
                        {booking.lotName}
                      </h3>
                      <p className={`transition-colors duration-300 ${getMutedTextColor()}`}>
                        Spot: {booking.spotNumber}
                      </p>
                    </div>
                    <Badge
                      variant={booking.status === "active" ? "default" : "secondary"}
                      className={`px-3 py-1 transition-all duration-300 ${booking.status === "active"
                          ? theme === "dark"
                            ? "bg-green-600 text-white"
                            : "bg-green-600 text-white"
                          : theme === "dark"
                            ? "bg-slate-600 text-slate-200"
                            : "bg-slate-200 text-slate-700"
                        }`}
                    >
                      {booking.status === "active" ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Completed
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Vehicle</span>
                      <p className={`font-semibold transition-colors duration-300 ${getTextColor()}`}>
                        {booking.vehicleNumber}
                      </p>
                    </div>
                    <div>
                      <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Duration</span>
                      <p className={`font-semibold transition-colors duration-300 ${getTextColor()}`}>
                        {new Date(booking.startTime).toLocaleDateString()} •{" "}
                        {new Date(booking.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {new Date(booking.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div>
                      <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Amount</span>
                      <p
                        className={`font-semibold transition-colors duration-300 ${theme === "dark" ? "text-green-400" : "text-green-600"
                          }`}
                      >
                        {booking.amount}
                      </p>
                    </div>
                  </div>

                  {booking.status === "active" && (
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className={`flex-1 transition-all duration-300 ${theme === "dark"
                            ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                            : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Extend Time
                      </Button>
                      <Button
                        variant="destructive"
                        className={`flex-1 transition-all duration-300 ${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"
                          }`}
                      >
                        End Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
