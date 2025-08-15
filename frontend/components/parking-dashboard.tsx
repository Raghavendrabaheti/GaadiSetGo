"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { api } from "@/lib/api"
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

interface ParkingLot {
  id: string
  name: string
  location: string
  address?: string
  total_capacity: number
  current_available_spots: number
  price_per_hour: number
  distance?: string
  rating?: number
  features: string[]
  image?: string
}

interface Vehicle {
  id: string
  make: string
  model: string
  registration_number: string
  color: string
  year: number
  vehicle_type: string
}

interface Booking {
  id: string
  parking_lot: {
    id: string
    name: string
    location: string
  }
  vehicle: {
    id: string
    registration_number: string
  }
  start_time: string
  end_time: string
  status: string
  total_amount: number
  spot_number?: string
}

export default function ParkingDashboard({ theme }: ParkingDashboardProps) {
  console.log('ParkingDashboard component rendered with theme:', theme); // Debug log

  const [selectedLocation, setSelectedLocation] = useState("delhi")
  const [selectedLot, setSelectedLot] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([])
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([])
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isBookingLoading, setIsBookingLoading] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<string>("")
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 50 },
    distance: 5,
    features: [] as string[]
  })
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

  // Fetch parking lots from API
  const fetchParkingLots = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.getParkingLots({
        search: searchQuery || undefined,
        min_price: filters.priceRange.min,
        max_price: filters.priceRange.max,
        features: filters.features.length > 0 ? filters.features : undefined,
        limit: 20
      })

      if (response.success && response.data) {
        const data = response.data as any
        if (data.data && data.data.lots) {
          setParkingLots(data.data.lots)
        } else if (data.lots) {
          setParkingLots(data.lots)
        } else {
          setError('Invalid response format')
        }
      } else {
        setError('Failed to fetch parking lots')
      }
    } catch (error) {
      console.error('Error fetching parking lots:', error)
      setError('Failed to fetch parking lots')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filters])

  // Fetch user bookings from API
  const fetchUserBookings = useCallback(async () => {
    try {
      const response = await api.getUserBookings({
        limit: 10
      })

      if (response.success && response.data) {
        const data = response.data as any
        if (data.data && data.data.bookings) {
          setUserBookings(data.data.bookings)
        } else if (data.bookings) {
          setUserBookings(data.bookings)
        }
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error)
    }
  }, [])

  // Fetch user vehicles from API
  const fetchUserVehicles = useCallback(async () => {
    try {
      const response = await api.getVehicles()

      if (response.success && response.data) {
        const data = response.data as any
        if (data.data && data.data.vehicles) {
          setUserVehicles(data.data.vehicles)
        } else if (data.vehicles) {
          setUserVehicles(data.vehicles)
        } else if (Array.isArray(data)) {
          setUserVehicles(data)
        }
      }
    } catch (error) {
      console.error('Error fetching user vehicles:', error)
    }
  }, [])

  // Handle booking creation
  const handleBooking = useCallback(async () => {
    console.log('handleBooking called with:', {
      selectedLot,
      selectedVehicle,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime
    })

    if (!selectedLot) {
      console.log('No lot selected')
      alert('Please select a parking lot')
      return
    }

    if (!selectedVehicle || selectedVehicle === 'no-vehicles') {
      console.log('No vehicle selected or no vehicles available')
      alert('Please select a vehicle. Add a vehicle first if you don\'t have any.')
      return
    }

    if (!bookingData.startTime || !bookingData.endTime) {
      console.log('Missing time data')
      alert('Please select start and end times')
      return
    }

    const startTime = new Date(bookingData.startTime)
    const endTime = new Date(bookingData.endTime)

    if (startTime >= endTime) {
      console.log('Invalid time range')
      alert('End time must be after start time')
      return
    }

    if (startTime < new Date()) {
      console.log('Start time in past')
      alert('Start time cannot be in the past')
      return
    }

    try {
      setIsBookingLoading(true)
      console.log('Sending booking request...')

      const bookingPayload = {
        parking_lot_id: selectedLot,
        vehicle_id: selectedVehicle,
        start_time: bookingData.startTime,
        end_time: bookingData.endTime,
      }

      console.log('Booking payload:', bookingPayload)

      const response = await api.createBooking(bookingPayload)
      console.log('Booking response:', response)

      if (response.success) {
        alert('Booking created successfully!')
        setIsBookingDialogOpen(false)
        setSelectedLot(null)
        setSelectedVehicle("")
        setBookingData({
          vehicleNumber: "",
          startTime: "",
          endTime: "",
        })
        // Refresh bookings and parking lots
        fetchUserBookings()
        fetchParkingLots()
      } else {
        const errorMsg = (response as any)?.message || 'Failed to create booking. Please try again.'
        console.log('Booking failed:', errorMsg)
        alert(errorMsg)
      }
    } catch (error: any) {
      console.error('Error creating booking:', error)
      const errorMsg = error?.message || error?.error || 'Error creating booking. Please try again.'
      alert(errorMsg)
    } finally {
      setIsBookingLoading(false)
    }
  }, [selectedLot, selectedVehicle, bookingData, fetchUserBookings, fetchParkingLots])  // Handle opening booking dialog for specific lot
  const handleBookSpot = useCallback((lotId: string) => {
    console.log('Book Spot clicked for lot:', lotId)
    setSelectedLot(lotId)
    setIsBookingDialogOpen(true)
    console.log('Dialog should now be open:', true)
  }, [])

  const handleQuickBooking = useCallback(() => {
    console.log("Quick Booking:", { selectedLot, ...bookingData })
    // Add actual booking logic here
  }, [selectedLot, bookingData])

  const handleLocationChange = useCallback((value: string) => {
    setSelectedLocation(value)
  }, [])

  // Real-time updates polling
  useEffect(() => {
    // Initial fetch
    fetchParkingLots()
    fetchUserBookings()
    fetchUserVehicles()

    const pollInterval = setInterval(() => {
      fetchParkingLots()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(pollInterval)
  }, [fetchParkingLots, fetchUserBookings, fetchUserVehicles])  // Fetch data when search or filters change
  useEffect(() => {
    fetchParkingLots()
  }, [searchQuery, filters.priceRange, filters.features])

  const fetchParkingLotUpdates = async () => {
    await fetchParkingLots()
  }  // Filter parking lots based on search and filters
  const filteredParkingLots = useMemo(() => {
    return parkingLots.filter(lot => {
      const matchesSearch = lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = lot.price_per_hour >= filters.priceRange.min &&
        lot.price_per_hour <= filters.priceRange.max
      return matchesSearch && matchesPrice
    })
  }, [parkingLots, searchQuery, filters])

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

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  // Error component
  const ErrorMessage = ({ message }: { message: string }) => (
    <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"}`}>
      <p>{message}</p>
    </div>
  )

  // Empty state component
  const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="text-center py-12">
      <Car className={`mx-auto h-12 w-12 ${getMutedTextColor()}`} />
      <h3 className={`mt-4 text-lg font-medium ${getTextColor()}`}>{title}</h3>
      <p className={`mt-2 ${getMutedTextColor()}`}>{description}</p>
    </div>
  )

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
          <Select value={selectedLocation} onValueChange={handleLocationChange}>
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
              <Button
                className={`w-full sm:w-auto bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}
                aria-label="Quick book parking spot"
              >
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
                <Button onClick={handleQuickBooking} className="w-full h-12 sm:h-10">
                  <Zap className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Booking Dialog */}
          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogContent
              className={`mx-2 sm:mx-0 w-[calc(100vw-1rem)] sm:max-w-md transition-all duration-300 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`}
            >
              <DialogHeader>
                <DialogTitle className={`transition-colors duration-300 ${getTextColor()}`}>
                  Book Parking Spot
                </DialogTitle>
                <DialogDescription className={`transition-colors duration-300 ${getMutedTextColor()}`}>
                  Select your vehicle and time slot to book this parking spot
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-select" className={`transition-colors duration-300 ${getTextColor()}`}>
                    Select Vehicle
                  </Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger
                      className={`h-12 sm:h-10 text-base sm:text-sm transition-all duration-300 ${theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-slate-100"
                        : "bg-white border-slate-300 text-slate-900"
                        }`}
                    >
                      <SelectValue placeholder="Choose your vehicle" />
                    </SelectTrigger>
                    <SelectContent className={theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}>
                      {userVehicles.length === 0 ? (
                        <SelectItem value="no-vehicles" disabled className="text-slate-400">
                          No vehicles found. Please add a vehicle first.
                        </SelectItem>
                      ) : (
                        userVehicles.map((vehicle) => (
                          <SelectItem
                            key={vehicle.id}
                            value={vehicle.id}
                            className={
                              theme === "dark" ? "text-slate-100 focus:bg-slate-700" : "text-slate-900 focus:bg-slate-100"
                            }
                          >
                            {vehicle.registration_number} - {vehicle.make} {vehicle.model}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="booking-start" className={`transition-colors duration-300 ${getTextColor()}`}>
                      Start Time
                    </Label>
                    <Input
                      id="booking-start"
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
                    <Label htmlFor="booking-end" className={`transition-colors duration-300 ${getTextColor()}`}>
                      End Time
                    </Label>
                    <Input
                      id="booking-end"
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

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsBookingDialogOpen(false)}
                    className="flex-1 h-12 sm:h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={isBookingLoading}
                    className="flex-1 h-12 sm:h-10"
                  >
                    {isBookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Booking...
                      </>
                    ) : (
                      <>
                        <Car className="mr-2 h-4 w-4" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </div>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search parking lots"
                    role="searchbox"
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
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : filteredParkingLots.length === 0 ? (
            <EmptyState
              title="No parking spots found"
              description="Try adjusting your search criteria or location"
            />
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {filteredParkingLots.map((lot) => (
                <Card
                  key={lot.id}
                  className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md ${getCardBackground()}`}
                >
                  <div className="flex flex-col sm:flex-row">
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
                          className={`px-3 py-1 font-medium border transition-all duration-300 self-start ${getAvailabilityColor(lot.current_available_spots, lot.total_capacity)}`}
                          variant="secondary"
                        >
                          {lot.current_available_spots} spots
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
                            {lot.total_capacity} spots
                          </p>
                        </div>
                        <div>
                          <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Price</span>
                          <p
                            className={`font-semibold transition-colors duration-300 ${theme === "dark" ? "text-green-400" : "text-green-600"
                              }`}
                          >
                            ₹{lot.price_per_hour}/hour
                          </p>
                        </div>
                        <div>
                          <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Distance</span>
                          <p className={`font-semibold transition-colors duration-300 ${getTextColor()}`}>
                            {lot.distance}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                        <Button
                          className={`w-full sm:flex-1 h-12 sm:h-10 bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}
                          onClick={() => handleBookSpot(lot.id)}
                        >
                          <Car className="mr-2 h-4 w-4" />
                          Book Spot
                        </Button>
                        <Button
                          variant="outline"
                          className={`w-full sm:flex-1 h-12 sm:h-10 transition-all duration-300 ${theme === "dark"
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
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <div className="grid gap-4">
            {userBookings.map((booking) => (
              <Card
                key={booking.id}
                className={`border-0 shadow-md transition-all duration-300 ${getCardBackground()}`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className={`font-bold text-lg transition-colors duration-300 ${getTextColor()}`}>
                        {booking.parking_lot.name}
                      </h3>
                      <p className={`transition-colors duration-300 ${getMutedTextColor()}`}>
                        Spot: {booking.spot_number || 'TBD'}
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
                        {booking.vehicle.registration_number}
                      </p>
                    </div>
                    <div>
                      <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Duration</span>
                      <p className={`font-semibold transition-colors duration-300 ${getTextColor()}`}>
                        {new Date(booking.start_time).toLocaleDateString()} •{" "}
                        {new Date(booking.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {new Date(booking.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <div>
                      <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Amount</span>
                      <p
                        className={`font-semibold transition-colors duration-300 ${theme === "dark" ? "text-green-400" : "text-green-600"
                          }`}
                      >
                        ₹{booking.total_amount}
                      </p>
                    </div>
                  </div>

                  {booking.status === "active" && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                      <Button
                        variant="outline"
                        className={`w-full sm:flex-1 h-12 sm:h-10 transition-all duration-300 ${theme === "dark"
                          ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                          : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Extend Time
                      </Button>
                      <Button
                        variant="destructive"
                        className={`w-full sm:flex-1 h-12 sm:h-10 transition-all duration-300 ${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"
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
