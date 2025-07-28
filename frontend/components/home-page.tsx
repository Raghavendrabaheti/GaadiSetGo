"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Shield, Smartphone, Star, ArrowRight, CheckCircle } from "lucide-react"

interface HomePageProps {
    onGetStarted: () => void
}

export default function HomePage({ onGetStarted }: HomePageProps) {
    const themeColors = {
        primary: "from-blue-600 to-purple-600",
        secondary: "from-green-500 to-blue-500",
        surface: "bg-white",
        text: "text-slate-900",
        textMuted: "text-slate-600",
        border: "border-slate-200",
    }

    const features = [
        {
            icon: Clock,
            title: "Real-Time Parking",
            description: "Book parking slots in real-time with live availability tracking and instant confirmation across multiple locations."
        },
        {
            icon: Shield,
            title: "FASTag & Challan Management",
            description: "Integrated FASTag management and comprehensive challan tracking system with automated notifications and payments."
        },
        {
            icon: Smartphone,
            title: "AI-Powered Assistant",
            description: "Enhanced user experience with AI chatbot functionality providing instant support and intelligent recommendations."
        },
        {
            icon: Star,
            title: "Complete Vehicle Services",
            description: "Automated service reminders, maintenance scheduling, and comprehensive vehicle care management system."
        }
    ]

    const testimonials = [
        {
            name: "Rajesh Kumar",
            location: "Delhi NCR",
            rating: 5,
            comment: "GaadiSetGo's real-time parking booking has transformed my daily commute. The AI assistant provides excellent support and the automated reminders keep my vehicle serviced on time!"
        },
        {
            name: "Priya Sharma",
            location: "Mumbai",
            rating: 5,
            comment: "The FASTag management and challan tracking features are incredible. I love how everything is integrated into one platform with seamless API connections."
        },
        {
            name: "Amit Patel",
            location: "Bangalore",
            rating: 5,
            comment: "The e-commerce section for automotive products is fantastic. Combined with the AI chatbot, it provides a complete vehicle management experience. Highly recommended!"
        }
    ]

    return (
        <div className="w-full max-w-full overflow-x-hidden space-y-8 sm:space-y-12 lg:space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-4 sm:space-y-6 lg:space-y-8 py-6 sm:py-8 lg:py-12 px-2 sm:px-4">
                <div className="space-y-3 sm:space-y-4 max-w-full">
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent px-2 leading-tight`}>
                        AI-Enhanced Vehicle Platform
                    </h1>
                    <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r ${themeColors.secondary} bg-clip-text text-transparent px-2 leading-tight`}>
                        Smart Vehicle Management
                    </h2>
                    <p className={`text-sm sm:text-base lg:text-lg xl:text-xl max-w-4xl mx-auto ${themeColors.textMuted} px-4 leading-relaxed`}>
                        Comprehensive vehicle management application featuring real-time parking slot booking, integrated vehicle services, AI-powered chatbot, and complete automotive ecosystem solution.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 max-w-md sm:max-w-none mx-auto">
                    <Button
                        onClick={onGetStarted}
                        className={`text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 lg:py-6 rounded-xl bg-gradient-to-r ${themeColors.primary} hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto min-w-0`}
                    >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    </Button>
                    <Button
                        variant="outline"
                        className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-3 sm:py-4 lg:py-6 rounded-xl border-slate-300 hover:bg-slate-50 transition-all duration-300 w-full sm:w-auto min-w-0"
                    >
                        Learn More
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="space-y-6 sm:space-y-8 lg:space-y-12 px-2 sm:px-4 max-w-full overflow-hidden">
                <div className="text-center space-y-3 sm:space-y-4 max-w-full">
                    <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${themeColors.text} px-4 leading-tight`}>
                        Core Features
                    </h3>
                    <p className={`text-sm sm:text-base lg:text-lg max-w-3xl mx-auto ${themeColors.textMuted} px-4 leading-relaxed`}>
                        Comprehensive vehicle management platform with AI-enhanced capabilities and seamless integrations.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className={`${themeColors.surface} ${themeColors.border} hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-full min-w-0`}
                        >
                            <CardHeader className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6">
                                <div className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r ${themeColors.primary} flex items-center justify-center flex-shrink-0`}>
                                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                                </div>
                                <CardTitle className={`text-base sm:text-lg lg:text-xl ${themeColors.text} leading-tight`}>
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <CardDescription className={`text-center text-xs sm:text-sm lg:text-base ${themeColors.textMuted} leading-relaxed`}>
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Services Grid Section */}
            <section className="space-y-6 sm:space-y-8 lg:space-y-12 px-2 sm:px-4 max-w-full overflow-hidden">
                <div className="text-center space-y-3 sm:space-y-4 max-w-full">
                    <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${themeColors.text} px-4 leading-tight`}>
                        Platform Capabilities
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        { title: "Vehicle Parking", desc: "Real-time parking slot booking system with live availability and instant confirmation.", color: "bg-blue-500" },
                        { title: "FASTag Management", desc: "Comprehensive FASTag services with recharge capabilities and transaction tracking.", color: "bg-green-500" },
                        { title: "Challan Tracking", desc: "Automated challan detection and payment system with smart notification alerts.", color: "bg-red-500" },
                        { title: "Service Reminders", desc: "Automated maintenance and service reminder system with scheduling capabilities.", color: "bg-purple-500" },
                        { title: "E-commerce Section", desc: "Integrated automotive products marketplace with seamless purchasing experience.", color: "bg-orange-500" },
                        { title: "AI Assistant", desc: "Intelligent chatbot with natural language processing for enhanced user support.", color: "bg-teal-500" }
                    ].map((service, index) => (
                        <Card key={index} className={`${themeColors.surface} ${themeColors.border} hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden`}>
                            <div className={`h-1.5 sm:h-2 ${service.color}`}></div>
                            <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                                <CardTitle className={`text-lg sm:text-xl ${themeColors.text} mb-2`}>
                                    {service.title}
                                </CardTitle>
                                <CardDescription className={`${themeColors.textMuted} text-sm leading-relaxed`}>
                                    {service.desc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 p-4 sm:p-6">
                                <Button variant="outline" size="sm" className="w-full text-sm">
                                    Explore Feature
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 bg-gradient-to-r ${themeColors.primary} mx-2 sm:mx-4`}>
                <div className="text-center space-y-6 sm:space-y-8">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white px-2">
                        Comprehensive Automotive Ecosystem Solution
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Real-Time</p>
                            <p className="text-xs sm:text-sm lg:text-base text-blue-100">Parking Booking</p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">AI-Powered</p>
                            <p className="text-xs sm:text-sm lg:text-base text-blue-100">Chat Assistant</p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Automated</p>
                            <p className="text-xs sm:text-sm lg:text-base text-blue-100">Service Reminders</p>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Integrated</p>
                            <p className="text-xs sm:text-sm lg:text-base text-blue-100">API Solutions</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Solutions Section */}
            <section className="space-y-8 sm:space-y-12 px-2 sm:px-4">
                <div className="text-center space-y-3 sm:space-y-4">
                    <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${themeColors.text} px-4`}>
                        Technical Architecture
                    </h3>
                    <p className={`text-base sm:text-lg max-w-3xl mx-auto ${themeColors.textMuted} px-4`}>
                        Built with role-based authentication, administrative controls, and seamless API integrations
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {[
                        {
                            title: "Role-Based Authentication",
                            desc: "Secure multi-level access control system with user role management and permission-based functionality.",
                            features: ["Multi-level access control", "User role management", "Permission-based features", "Secure authentication"]
                        },
                        {
                            title: "Administrative Controls",
                            desc: "Comprehensive admin dashboard with full system oversight, user management, and analytics capabilities.",
                            features: ["System oversight dashboard", "User management panel", "Analytics & reporting", "Configuration controls"]
                        },
                        {
                            title: "API Integrations",
                            desc: "Seamless third-party service integration with real-time data synchronization and automated workflows.",
                            features: ["Real-time data sync", "Third-party integrations", "Automated workflows", "Service orchestration"]
                        },
                        {
                            title: "AI Enhancement",
                            desc: "Machine learning powered features including intelligent recommendations and automated decision making.",
                            features: ["Intelligent recommendations", "Automated decisions", "Pattern recognition", "Predictive analytics"]
                        }
                    ].map((solution, index) => (
                        <Card key={index} className={`${themeColors.surface} ${themeColors.border} hover:shadow-lg transition-all duration-300 p-4 sm:p-6`}>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <h4 className={`text-lg sm:text-xl font-semibold ${themeColors.text} mb-2`}>
                                        {solution.title}
                                    </h4>
                                    <p className={`${themeColors.textMuted} text-sm mb-3 sm:mb-4`}>
                                        {solution.desc}
                                    </p>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    {solution.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center space-x-2">
                                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                                            <span className={`text-xs sm:text-sm ${themeColors.textMuted}`}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-3 sm:mt-4 text-sm">
                                    Learn More
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="space-y-8 sm:space-y-12 px-2 sm:px-4">
                <div className="text-center space-y-3 sm:space-y-4">
                    <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${themeColors.text} px-4`}>
                        What Our Customers Say
                    </h3>
                    <p className={`text-base sm:text-lg max-w-2xl mx-auto ${themeColors.textMuted} px-4`}>
                        Don't just take our word for it. Here's what our satisfied customers have to say.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className={`${themeColors.surface} ${themeColors.border} hover:shadow-lg transition-all duration-300`}
                        >
                            <CardHeader className="p-4 sm:p-6">
                                <div className="flex items-center space-x-1 mb-2">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <CardDescription className={`${themeColors.textMuted} text-sm leading-relaxed`}>
                                    "{testimonial.comment}"
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <div className="space-y-1">
                                    <p className={`font-semibold text-sm sm:text-base ${themeColors.text}`}>
                                        {testimonial.name}
                                    </p>
                                    <p className={`text-xs sm:text-sm ${themeColors.textMuted}`}>
                                        {testimonial.location}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center space-y-6 sm:space-y-8 py-8 sm:py-12 px-2 sm:px-4">
                <div className="space-y-3 sm:space-y-4">
                    <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${themeColors.text} px-4`}>
                        Experience the Future of Vehicle Management
                    </h3>
                    <p className={`text-base sm:text-lg max-w-2xl mx-auto ${themeColors.textMuted} px-4`}>
                        Join GaadiSetGo and discover a comprehensive automotive ecosystem solution with AI-enhanced features and seamless integrations.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                    <Button
                        onClick={onGetStarted}
                        className={`text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-xl bg-gradient-to-r ${themeColors.primary} hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto`}
                    >
                        Start Your Journey
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                        <span className={themeColors.textMuted}>AI-Enhanced Platform</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
