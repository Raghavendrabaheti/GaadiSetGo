"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Bell,
    Shield,
    Moon,
    Globe,
    CreditCard,
    Smartphone,
    Mail,
    MessageSquare,
    Download,
    Trash2,
    Lock
} from "lucide-react"

interface SettingsPageProps {
    theme: string
}

export default function SettingsPage({ theme: _theme }: SettingsPageProps) {
    const themeColors = {
        primary: "from-blue-600 to-purple-600",
        secondary: "from-green-500 to-blue-500",
        surface: "bg-white",
        text: "text-slate-900",
        textMuted: "text-slate-600",
        border: "border-slate-200",
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className={`text-3xl font-bold ${themeColors.text}`}>Settings</h1>
                <p className={`${themeColors.textMuted}`}>
                    Manage your account settings and preferences
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Globe className="h-5 w-5" />
                                <span>Language & Region</span>
                            </CardTitle>
                            <CardDescription>
                                Configure your language and regional preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Select defaultValue="en">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                                            <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                                            <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select defaultValue="ist">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                                            <SelectItem value="utc">UTC</SelectItem>
                                            <SelectItem value="est">Eastern Standard Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Moon className="h-5 w-5" />
                                <span>Appearance</span>
                            </CardTitle>
                            <CardDescription>
                                Customize the look and feel of your interface
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme</Label>
                                <Select defaultValue="light">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="color-scheme">Color Scheme</Label>
                                <Select defaultValue="blue">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select color scheme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="blue">Blue</SelectItem>
                                        <SelectItem value="green">Green</SelectItem>
                                        <SelectItem value="purple">Purple</SelectItem>
                                        <SelectItem value="orange">Orange</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Bell className="h-5 w-5" />
                                <span>Notification Preferences</span>
                            </CardTitle>
                            <CardDescription>
                                Choose how you want to receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                {
                                    icon: Mail,
                                    title: "Email Notifications",
                                    description: "Receive updates via email",
                                    options: ["Booking confirmations", "Service reminders", "Payment notifications", "Marketing emails"]
                                },
                                {
                                    icon: Smartphone,
                                    title: "Push Notifications",
                                    description: "Receive notifications on your device",
                                    options: ["Real-time parking updates", "Navigation alerts", "Emergency notifications"]
                                },
                                {
                                    icon: MessageSquare,
                                    title: "SMS Notifications",
                                    description: "Receive text messages for important updates",
                                    options: ["Booking confirmations", "Payment receipts", "Emergency alerts"]
                                }
                            ].map((section, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <section.icon className="h-4 w-4" />
                                        <h4 className={`font-medium ${themeColors.text}`}>{section.title}</h4>
                                    </div>
                                    <p className={`text-sm ${themeColors.textMuted} ml-6`}>{section.description}</p>
                                    <div className="ml-6 space-y-2">
                                        {section.options.map((option, optIndex) => (
                                            <label key={optIndex} className="flex items-center space-x-2">
                                                <input type="checkbox" defaultChecked className="rounded" />
                                                <span className={`text-sm ${themeColors.text}`}>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy Settings */}
                <TabsContent value="privacy" className="space-y-6">
                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Shield className="h-5 w-5" />
                                <span>Privacy & Security</span>
                            </CardTitle>
                            <CardDescription>
                                Manage your privacy settings and account security
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className={`font-medium ${themeColors.text}`}>Location Sharing</h4>
                                        <p className={`text-sm ${themeColors.textMuted}`}>Allow app to access your location for better service</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className={`font-medium ${themeColors.text}`}>Usage Analytics</h4>
                                        <p className={`text-sm ${themeColors.textMuted}`}>Help improve the app by sharing anonymous usage data</p>
                                    </div>
                                    <input type="checkbox" defaultChecked className="rounded" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className={`font-medium ${themeColors.text}`}>Personalized Ads</h4>
                                        <p className={`text-sm ${themeColors.textMuted}`}>Show relevant ads based on your preferences</p>
                                    </div>
                                    <input type="checkbox" className="rounded" />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className={`font-medium ${themeColors.text} mb-3`}>Account Security</h4>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Lock className="h-4 w-4 mr-2" />
                                        Change Password
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Smartphone className="h-4 w-4 mr-2" />
                                        Two-Factor Authentication
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download My Data
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing Settings */}
                <TabsContent value="billing" className="space-y-6">
                    <Card className={`${themeColors.surface} ${themeColors.border}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <CreditCard className="h-5 w-5" />
                                <span>Billing & Payments</span>
                            </CardTitle>
                            <CardDescription>
                                Manage your payment methods and billing information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h4 className={`font-medium ${themeColors.text}`}>Payment Methods</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <CreditCard className="h-5 w-5 text-slate-500" />
                                            <div>
                                                <p className={`font-medium ${themeColors.text}`}>**** **** **** 1234</p>
                                                <p className={`text-sm ${themeColors.textMuted}`}>Expires 12/25</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </div>
                                    <Button variant="outline" className="w-full">
                                        Add Payment Method
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className={`font-medium ${themeColors.text}`}>Billing History</h4>
                                <div className="space-y-2">
                                    {[
                                        { date: "Dec 15, 2024", amount: "₹250", description: "Parking - Connaught Place" },
                                        { date: "Dec 10, 2024", amount: "₹500", description: "FASTag Recharge" },
                                        { date: "Dec 5, 2024", amount: "₹180", description: "Service Booking" }
                                    ].map((transaction, index) => (
                                        <div key={index} className="flex items-center justify-between py-2">
                                            <div>
                                                <p className={`font-medium ${themeColors.text}`}>{transaction.description}</p>
                                                <p className={`text-sm ${themeColors.textMuted}`}>{transaction.date}</p>
                                            </div>
                                            <span className={`font-medium ${themeColors.text}`}>{transaction.amount}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full">
                                    View All Transactions
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`${themeColors.surface} ${themeColors.border} border-red-200`}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-red-600">
                                <Trash2 className="h-5 w-5" />
                                <span>Danger Zone</span>
                            </CardTitle>
                            <CardDescription>
                                Irreversible actions that will affect your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="w-full">
                                Delete Account
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
