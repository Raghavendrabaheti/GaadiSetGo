"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Car, Calendar, Edit } from "lucide-react"

interface AccountPageProps {
    theme: string
}

export default function AccountPage({ theme }: AccountPageProps) {
    const themeColors = {
        primary: "from-blue-600 to-purple-600",
        secondary: "from-green-500 to-blue-500",
        surface: "bg-white",
        text: "text-slate-900",
        textMuted: "text-slate-600",
        border: "border-slate-200",
    }

    const userData = {
        name: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phone: "+91 98765 43210",
        location: "Delhi NCR, India",
        memberSince: "January 2024",
        vehicleCount: 2,
        totalBookings: 45,
        profileComplete: 85
    }

    const vehicles = [
        {
            id: 1,
            brand: "Maruti Suzuki",
            model: "Swift",
            year: "2022",
            plate: "DL 01 AB 1234",
            type: "Hatchback"
        },
        {
            id: 2,
            brand: "Honda",
            model: "City",
            year: "2023",
            plate: "DL 02 CD 5678",
            type: "Sedan"
        }
    ]

    const recentActivity = [
        {
            id: 1,
            action: "Parking Booked",
            location: "Connaught Place",
            date: "2 hours ago",
            status: "Active"
        },
        {
            id: 2,
            action: "Service Reminder",
            location: "Swift - Oil Change Due",
            date: "1 day ago",
            status: "Pending"
        },
        {
            id: 3,
            action: "FASTag Recharged",
            location: "₹500 Added",
            date: "3 days ago",
            status: "Completed"
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className={`text-3xl font-bold ${themeColors.text}`}>Account</h1>
                <p className={`${themeColors.textMuted}`}>
                    Manage your profile, vehicles, and account settings
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Overview */}
                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className={themeColors.text}>Profile Information</span>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                    <User className="h-8 w-8 text-white" />
                                </Avatar>
                                <div className="space-y-1">
                                    <h3 className={`text-xl font-semibold ${themeColors.text}`}>
                                        {userData.name}
                                    </h3>
                                    <p className={`${themeColors.textMuted}`}>Premium Member</p>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="secondary">Profile {userData.profileComplete}% Complete</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className={themeColors.text}>Email</Label>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                        <Input
                                            id="email"
                                            value={userData.email}
                                            readOnly
                                            className="bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className={themeColors.text}>Phone</Label>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                        <Input
                                            id="phone"
                                            value={userData.phone}
                                            readOnly
                                            className="bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className={themeColors.text}>Location</Label>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        <Input
                                            id="location"
                                            value={userData.location}
                                            readOnly
                                            className="bg-slate-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="member-since" className={themeColors.text}>Member Since</Label>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-slate-500" />
                                        <Input
                                            id="member-since"
                                            value={userData.memberSince}
                                            readOnly
                                            className="bg-slate-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vehicle Information */}
                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className={themeColors.text}>My Vehicles</span>
                                <Button variant="outline" size="sm">
                                    Add Vehicle
                                </Button>
                            </CardTitle>
                            <CardDescription className={themeColors.textMuted}>
                                Manage your registered vehicles
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Car className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${themeColors.text}`}>
                                                {vehicle.brand} {vehicle.model}
                                            </h4>
                                            <p className={`text-sm ${themeColors.textMuted}`}>
                                                {vehicle.year} • {vehicle.plate} • {vehicle.type}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Edit
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className={themeColors.text}>Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${themeColors.text}`}>
                                    {userData.totalBookings}
                                </div>
                                <p className={`text-sm ${themeColors.textMuted}`}>Total Bookings</p>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${themeColors.text}`}>
                                    {userData.vehicleCount}
                                </div>
                                <p className={`text-sm ${themeColors.textMuted}`}>Registered Vehicles</p>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold text-green-600`}>
                                    ₹2,450
                                </div>
                                <p className={`text-sm ${themeColors.textMuted}`}>Money Saved</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className={themeColors.text}>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${themeColors.text}`}>
                                            {activity.action}
                                        </span>
                                        <Badge
                                            variant={
                                                activity.status === "Active" ? "default" :
                                                    activity.status === "Pending" ? "secondary" : "outline"
                                            }
                                            className="text-xs"
                                        >
                                            {activity.status}
                                        </Badge>
                                    </div>
                                    <p className={`text-xs ${themeColors.textMuted}`}>
                                        {activity.location}
                                    </p>
                                    <p className={`text-xs ${themeColors.textMuted}`}>
                                        {activity.date}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
