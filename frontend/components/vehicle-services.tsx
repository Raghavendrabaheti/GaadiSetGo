"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  FileText,
  Wrench,
  MapPin,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Star,
  Navigation,
  Phone,
  Clock,
  Filter,
} from "lucide-react"

interface VehicleServicesProps {
  theme: string
}

export default function VehicleServices({ theme }: VehicleServicesProps) {
  const [regNumber, setRegNumber] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("delhi")

  const locations = [
    { value: "delhi", label: "New Delhi" },
    { value: "mumbai", label: "Mumbai" },
    { value: "bangalore", label: "Bangalore" },
    { value: "chennai", label: "Chennai" },
  ]

  const fastagData = {
    balance: "₹1,250",
    tagId: "FT123456789",
    status: "Active",
    lastRecharge: "2024-01-10",
    vehicle: "DL-01-AB-1234",
    monthlyUsage: "₹850",
  }

  const challanData = [
    {
      id: "1",
      type: "Speed Violation",
      amount: "₹2,000",
      date: "2024-01-12",
      status: "Pending",
      location: "NH-1, Gurgaon",
      dueDate: "2024-02-12",
    },
    {
      id: "2",
      type: "Parking Violation",
      amount: "₹500",
      date: "2024-01-08",
      status: "Paid",
      location: "Connaught Place",
      paidDate: "2024-01-10",
    },
  ]

  const serviceCenters = [
    {
      id: "1",
      name: "AutoCare Service Center",
      brand: "Multi-Brand",
      rating: 4.5,
      reviews: 128,
      distance: "2.3 km",
      services: ["Oil Change", "Brake Service", "AC Repair", "General Service"],
      price: "₹₹",
      address: "Sector 18, Noida",
      phone: "+91 98765 43210",
      openTime: "9:00 AM - 7:00 PM",
      image: "/placeholder.svg?height=200&width=300&text=AutoCare+Service",
    },
    {
      id: "2",
      name: "Maruti Authorized Service",
      brand: "Maruti Suzuki",
      rating: 4.8,
      reviews: 256,
      distance: "3.1 km",
      services: ["General Service", "Parts Replacement", "Warranty Service"],
      price: "₹₹₹",
      address: "Lajpat Nagar, New Delhi",
      phone: "+91 98765 43211",
      openTime: "8:00 AM - 8:00 PM",
      image: "/placeholder.svg?height=200&width=300&text=Maruti+Service",
    },
  ]

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
      ? "from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
      : "from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
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
              theme === "dark" ? "from-green-400 to-blue-400" : "from-green-600 to-blue-600"
            }`}
          >
            Vehicle Services
          </h1>
          <p className={`mt-1 transition-colors duration-300 ${getMutedTextColor()}`}>
            Manage your vehicle services and information
          </p>
        </div>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger
            className={`w-48 transition-all duration-300 ${
              theme === "dark"
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
                className={theme === "dark" ? "text-slate-100 focus:bg-slate-700" : "text-slate-900 focus:bg-slate-100"}
              >
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="fastag" className="w-full">
        <TabsList
          className={`grid w-full grid-cols-3 h-12 transition-all duration-300 ${
            theme === "dark" ? "bg-slate-700" : "bg-slate-100"
          }`}
        >
          <TabsTrigger
            value="fastag"
            className={`font-medium transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
            }`}
          >
            FASTag
          </TabsTrigger>
          <TabsTrigger
            value="challan"
            className={`font-medium transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
            }`}
          >
            Challans
          </TabsTrigger>
          <TabsTrigger
            value="service"
            className={`font-medium transition-all duration-300 ${
              theme === "dark"
                ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
            }`}
          >
            Service Centers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fastag" className="space-y-6">
          {/* FASTag Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={`border-0 shadow-lg transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-slate-800 to-slate-900"
                  : "bg-gradient-to-br from-green-50 to-blue-50"
              }`}
            >
              <CardHeader>
                <CardTitle className={`flex items-center text-xl transition-colors duration-300 ${getTextColor()}`}>
                  <CreditCard className={`mr-3 h-6 w-6 ${theme === "dark" ? "text-green-400" : "text-green-600"}`} />
                  FASTag Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`text-center p-4 rounded-lg transition-all duration-300 ${
                      theme === "dark" ? "bg-slate-700" : "bg-white"
                    }`}
                  >
                    <Label className={`text-sm transition-colors duration-300 ${getMutedTextColor()}`}>
                      Current Balance
                    </Label>
                    <p
                      className={`text-2xl font-bold transition-colors duration-300 ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {fastagData.balance}
                    </p>
                  </div>
                  <div
                    className={`text-center p-4 rounded-lg transition-all duration-300 ${
                      theme === "dark" ? "bg-slate-700" : "bg-white"
                    }`}
                  >
                    <Label className={`text-sm transition-colors duration-300 ${getMutedTextColor()}`}>
                      Monthly Usage
                    </Label>
                    <p
                      className={`text-2xl font-bold transition-colors duration-300 ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {fastagData.monthlyUsage}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${getMutedTextColor()}`}>Tag ID</span>
                    <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                      {fastagData.tagId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${getMutedTextColor()}`}>Status</span>
                    <Badge
                      variant="default"
                      className={`transition-all duration-300 ${
                        theme === "dark" ? "bg-green-600 text-white" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {fastagData.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${getMutedTextColor()}`}>Vehicle</span>
                    <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                      {fastagData.vehicle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`transition-colors duration-300 ${getMutedTextColor()}`}>Last Recharge</span>
                    <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                      {fastagData.lastRecharge}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-0 shadow-lg transition-all duration-300 ${getCardBackground()}`}>
              <CardHeader>
                <CardTitle className={`transition-colors duration-300 ${getTextColor()}`}>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className={`w-full h-12 bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}>
                  <DollarSign className="mr-2 h-5 w-5" />
                  Recharge FASTag
                </Button>
                <Button
                  variant="outline"
                  className={`w-full h-12 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Transaction History
                </Button>
                <Button
                  variant="outline"
                  className={`w-full h-12 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Link New FASTag
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="challan" className="space-y-6">
          {/* Challan Search */}
          <Card
            className={`border-0 shadow-sm transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-slate-800 to-slate-900"
                : "bg-gradient-to-r from-red-50 to-orange-50"
            }`}
          >
            <CardHeader>
              <CardTitle className={`flex items-center text-xl transition-colors duration-300 ${getTextColor()}`}>
                <FileText className={`mr-3 h-6 w-6 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
                Traffic Challans
              </CardTitle>
              <CardDescription className={`transition-colors duration-300 ${getMutedTextColor()}`}>
                Check challan status by registration number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter registration number (e.g., DL-01-AB-1234)"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className={`h-12 transition-all duration-300 ${getInputBackground()}`}
                />
                <Button className="h-12 px-6">
                  <Search className="mr-2 h-4 w-4" />
                  Check
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Challan List */}
          <div className="space-y-4">
            {challanData.map((challan) => (
              <Card
                key={challan.id}
                className={`border-0 shadow-md transition-all duration-300 ${getCardBackground()}`}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className={`font-bold text-lg transition-colors duration-300 ${getTextColor()}`}>
                        {challan.type}
                      </h4>
                      <p className={`flex items-center mt-1 transition-colors duration-300 ${getMutedTextColor()}`}>
                        <MapPin className="mr-1 h-3 w-3" />
                        {challan.location}
                      </p>
                    </div>
                    <Badge
                      variant={challan.status === "Paid" ? "default" : "destructive"}
                      className={`px-3 py-1 transition-all duration-300 ${
                        challan.status === "Paid"
                          ? theme === "dark"
                            ? "bg-green-600 text-white"
                            : "bg-green-600 text-white"
                          : theme === "dark"
                            ? "bg-red-600 text-white"
                            : "bg-red-600 text-white"
                      }`}
                    >
                      {challan.status === "Paid" ? (
                        <>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Paid
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Amount</span>
                      <p className={`font-bold text-lg transition-colors duration-300 ${getTextColor()}`}>
                        {challan.amount}
                      </p>
                    </div>
                    <div>
                      <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>Date</span>
                      <p className={`font-medium transition-colors duration-300 ${getTextColor()}`}>{challan.date}</p>
                    </div>
                    <div>
                      <span className={`block transition-colors duration-300 ${getMutedTextColor()}`}>
                        {challan.status === "Paid" ? "Paid Date" : "Due Date"}
                      </span>
                      <p className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                        {challan.status === "Paid" ? challan.paidDate : challan.dueDate}
                      </p>
                    </div>
                    <div className="flex items-end">
                      {challan.status === "Pending" && (
                        <Button size="sm" className="w-full">
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="service" className="space-y-6">
          {/* Service Center Search */}
          <Card
            className={`border-0 shadow-sm transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-slate-800 to-slate-900"
                : "bg-gradient-to-r from-blue-50 to-purple-50"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                  />
                  <Input
                    placeholder="Search service centers..."
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
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent
                    className={theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}
                  >
                    <SelectItem value="all">All Brands</SelectItem>
                    <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                    <SelectItem value="hyundai">Hyundai</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
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

          {/* Service Centers List */}
          <div className="grid gap-6">
            {serviceCenters.map((center) => (
              <Card
                key={center.id}
                className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${getCardBackground()}`}
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={center.image || "/placeholder.svg"}
                      alt={center.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`font-bold text-xl mb-1 transition-colors duration-300 ${getTextColor()}`}>
                          {center.name}
                        </h3>
                        <p className={`text-sm mb-2 transition-colors duration-300 ${getMutedTextColor()}`}>
                          {center.brand}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className={`font-medium transition-colors duration-300 ${getTextColor()}`}>
                              {center.rating}
                            </span>
                            <span className={`ml-1 transition-colors duration-300 ${getMutedTextColor()}`}>
                              ({center.reviews})
                            </span>
                          </div>
                          <div className={`flex items-center transition-colors duration-300 ${getMutedTextColor()}`}>
                            <MapPin className="mr-1 h-3 w-3" />
                            {center.distance}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`px-3 py-1 transition-all duration-300 ${
                          theme === "dark" ? "bg-slate-600 text-slate-200" : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {center.price}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div
                        className={`flex items-center text-sm transition-colors duration-300 ${getMutedTextColor()}`}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{center.address}</span>
                      </div>
                      <div
                        className={`flex items-center text-sm transition-colors duration-300 ${getMutedTextColor()}`}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        <span>{center.phone}</span>
                      </div>
                      <div
                        className={`flex items-center text-sm transition-colors duration-300 ${getMutedTextColor()}`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{center.openTime}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {center.services.map((service, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`text-xs transition-all duration-300 ${
                            theme === "dark" ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"
                          }`}
                        >
                          <Wrench className="mr-1 h-3 w-3" />
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button className={`flex-1 bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Service
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex-1 transition-all duration-300 ${
                          theme === "dark"
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
      </Tabs>
    </div>
  )
}
