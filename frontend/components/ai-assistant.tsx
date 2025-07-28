"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Car,
  MapPin,
  ShoppingCart,
  Wrench,
  Sparkles,
  MessageCircle,
  Zap,
  Brain,
} from "lucide-react"

interface AIAssistantProps {
  theme: string
}

export default function AIAssistant({ theme }: AIAssistantProps) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "bot",
      content:
        "👋 Hello! I'm your GaadiSetGo AI assistant. I'm here to help you with:\n\n🚗 Finding parking spots\n🔧 Vehicle services\n🛒 Shopping for auto products\n📋 Challan information\n\nHow can I assist you today?",
      timestamp: new Date(),
      suggestions: ["Find parking near me", "Check my vehicle service", "Show car accessories", "Help with FASTag"],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    {
      icon: Car,
      label: "Find Parking",
      action: "find parking near me",
      color:
        theme === "dark"
          ? "bg-blue-900/30 text-blue-400 hover:bg-blue-800/40"
          : "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    {
      icon: MapPin,
      label: "Directions",
      action: "get directions to nearest parking",
      color:
        theme === "dark"
          ? "bg-green-900/30 text-green-400 hover:bg-green-800/40"
          : "bg-green-100 text-green-700 hover:bg-green-200",
    },
    {
      icon: ShoppingCart,
      label: "Shop Products",
      action: "show me car accessories",
      color:
        theme === "dark"
          ? "bg-purple-900/30 text-purple-400 hover:bg-purple-800/40"
          : "bg-purple-100 text-purple-700 hover:bg-purple-200",
    },
    {
      icon: Wrench,
      label: "Service Centers",
      action: "find service centers nearby",
      color:
        theme === "dark"
          ? "bg-orange-900/30 text-orange-400 hover:bg-orange-800/40"
          : "bg-orange-100 text-orange-700 hover:bg-orange-200",
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputMessage
    if (!text.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: text,
      timestamp: new Date(),
      suggestions: [],
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response with typing indicator
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        type: "bot" as const,
        content: generateBotResponse(text),
        timestamp: new Date(),
        suggestions: generateSuggestions(text),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase()

    if (input.includes("parking")) {
      return "🅿️ **Found 3 parking lots near you:**\n\n**1. City Center Mall**\n• 45 spots available\n• ₹20/hour\n• 0.5 km away\n• Rating: 4.5⭐\n\n**2. Metro Station Hub**\n• 12 spots available\n• ₹15/hour\n• 1.2 km away\n• Rating: 4.2⭐\n\n**3. Business District**\n• 89 spots available\n• ₹25/hour\n• 2.1 km away\n• Rating: 4.7⭐\n\nWould you like me to book a spot for you? 🚗"
    } else if (input.includes("service")) {
      return "🔧 **Top-rated service centers near you:**\n\n**1. AutoCare Service Center**\n• Rating: 4.5⭐ (128 reviews)\n• Distance: 2.3 km\n• Services: Oil Change, Brake Service, AC Repair\n• Price Range: ₹₹\n\n**2. Maruti Authorized Service**\n• Rating: 4.8⭐ (256 reviews)\n• Distance: 3.1 km\n• Services: General Service, Parts, Warranty\n• Price Range: ₹₹₹\n\nWould you like to book an appointment? 📅"
    } else if (input.includes("shop") || input.includes("buy") || input.includes("accessories")) {
      return "🛒 **Popular automotive products:**\n\n**Tyres**\n• Michelin Primacy 4 - ₹25,000 (Set of 4)\n• 10% OFF - Save ₹3,000\n\n**Engine Oils**\n• Mobil 1 Synthetic - ₹2,500\n• Advanced protection formula\n\n**Accessories**\n• Bosch Car Battery - ₹8,500\n• Philips LED Headlights - ₹1,200\n\nWhat specific product are you looking for? 🔍"
    } else if (input.includes("challan") || input.includes("fine")) {
      return "📋 **Challan Information Service**\n\nI can help you check traffic challans by vehicle registration number.\n\n**Recent Updates:**\n• Online payment available\n• Instant status updates\n• Penalty reduction schemes active\n\nPlease provide your vehicle registration number (e.g., DL-01-AB-1234) to check for any pending challans. 🚨"
    } else if (input.includes("fastag")) {
      return "💳 **FASTag Services:**\n\n**Your FASTag Status:**\n• Balance: ₹1,250\n• Tag ID: FT123456789\n• Status: Active ✅\n• Monthly Usage: ₹850\n\n**Quick Actions:**\n• Recharge FASTag\n• View transaction history\n• Link new vehicle\n\nNeed help with any FASTag services? 🛣️"
    } else {
      return "🤖 I'm here to help! I can assist you with:\n\n• **Parking** - Find and book spots\n• **Vehicle Services** - Locate service centers\n• **Shopping** - Browse auto products\n• **Challans** - Check traffic fines\n• **FASTag** - Manage your account\n\nCould you please be more specific about what you're looking for? I'm ready to help! ✨"
    }
  }

  const generateSuggestions = (userInput: string) => {
    const input = userInput.toLowerCase()

    if (input.includes("parking")) {
      return ["Book City Center Mall", "Get directions", "Check other locations", "Set parking reminder"]
    } else if (input.includes("service")) {
      return ["Book AutoCare appointment", "Compare service centers", "Check service history", "Get service reminders"]
    } else if (input.includes("shop")) {
      return ["View tyre deals", "Check oil prices", "Browse accessories", "Track my order"]
    } else {
      return ["Find parking", "Vehicle services", "Shop products", "Check challans"]
    }
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // Voice recognition would be implemented here
    if (!isListening) {
      setTimeout(() => setIsListening(false), 3000) // Auto-stop after 3 seconds for demo
    }
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
      ? "from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
      : "from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
  }



  return (
    <div className="min-h-screen w-full max-w-full overflow-hidden">
      {/* Header - Responsive with proper spacing */}
      <div className="text-center px-3 sm:px-4 py-3 sm:py-4">
        <div
          className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-br transition-all duration-300 ${theme === "dark" ? "from-orange-400 to-pink-400" : "from-orange-400 to-pink-600"
            }`}
        >
          <Brain className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
        </div>
        <h1
          className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${theme === "dark" ? "from-orange-400 to-pink-400" : "from-orange-600 to-pink-600"
            }`}
        >
          AI Assistant
        </h1>
        <p className={`mt-1 text-xs sm:text-sm lg:text-base transition-colors duration-300 ${getMutedTextColor()}`}>
          Your intelligent companion for all parking and vehicle needs
        </p>
      </div>

      {/* Mobile Quick Features - Compact horizontal layout */}
      <div className="lg:hidden px-3 sm:px-4 mb-3 sm:mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {[
            { icon: "🅿️", label: "Parking" },
            { icon: "🔧", label: "Service" },
            { icon: "🛒", label: "Shop" },
            { icon: "📋", label: "Challans" },
            { icon: "💳", label: "FASTag" },
            { icon: "🗣️", label: "Voice" },
          ].map((feature, index) => (
            <div
              key={index}
              className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg min-w-[60px] transition-all duration-300 ${theme === "dark"
                  ? "bg-slate-700/50 border border-slate-600/50"
                  : "bg-white/80 border border-slate-200/80 backdrop-blur-sm"
                }`}
            >
              <span className="text-lg mb-1">{feature.icon}</span>
              <span className={`text-xs font-medium ${getTextColor()}`}>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-3 sm:px-4 lg:px-0">
        {/* Chat Interface - Responsive container */}
        <div className="lg:col-span-3">
          <Card
            className={`flex flex-col border-0 shadow-xl transition-all duration-300 ${getCardBackground()}`}
            style={{
              height: 'calc(100vh - 280px)',
              minHeight: '400px',
              maxHeight: '600px'
            }}
          >
            <CardHeader
              className={`flex-shrink-0 border-b transition-all duration-300 ${theme === "dark"
                ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700"
                : "bg-gradient-to-r from-orange-50 to-pink-50 border-slate-200"
                } px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4`}
            >
              <CardTitle className={`flex items-center text-sm sm:text-base lg:text-lg transition-colors duration-300 ${getTextColor()}`}>
                <div className="relative">
                  <Bot className={`mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
                  <div
                    className={`absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full animate-pulse ${theme === "dark" ? "bg-green-400" : "bg-green-500"
                      }`}
                  />
                </div>
                Smart AI Assistant
                <Badge
                  variant="secondary"
                  className={`ml-2 text-xs transition-all duration-300 ${theme === "dark" ? "bg-slate-600 text-slate-200" : "bg-slate-200 text-slate-700"
                    }`}
                >
                  Online
                </Badge>
              </CardTitle>
              <CardDescription className={`text-xs sm:text-sm transition-colors duration-300 ${getMutedTextColor()}`}>
                Powered by advanced AI • Real-time assistance
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 p-2 sm:p-3 lg:p-4">
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="space-y-1 sm:space-y-2">
                      <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex items-start space-x-1 sm:space-x-2 lg:space-x-3 max-w-[95%] sm:max-w-[90%] lg:max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          <Avatar className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex-shrink-0">
                            <AvatarFallback
                              className={`transition-all duration-300 ${message.type === "user"
                                ? theme === "dark"
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-blue-100 text-blue-700"
                                : theme === "dark"
                                  ? "bg-orange-900/30 text-orange-400"
                                  : "bg-orange-100 text-orange-700"
                                }`}
                            >
                              {message.type === "user" ? <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" /> : <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 min-w-0 ${message.type === "user"
                              ? "bg-blue-500 text-white"
                              : theme === "dark"
                                ? "bg-slate-700 border border-slate-600 text-slate-100"
                                : "bg-slate-100 border border-slate-200 text-slate-900"
                              }`}
                          >
                            <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed break-words">{message.content}</div>
                            <div
                              className={`text-xs mt-1 sm:mt-2 transition-colors duration-300 ${message.type === "user" ? "text-blue-100" : getMutedTextColor()
                                }`}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Suggestions - Responsive */}
                      {message.type === "bot" && message.suggestions && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 ml-6 sm:ml-8 lg:ml-11">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendMessage(suggestion)}
                              className={`text-xs h-6 sm:h-7 lg:h-8 rounded-full transition-all duration-300 px-2 sm:px-3 max-w-[200px] ${theme === "dark"
                                ? "border-slate-600 hover:bg-orange-900/20 hover:text-orange-400 hover:border-orange-600"
                                : "hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200"
                                }`}
                            >
                              <Sparkles className="mr-1 h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                              <span className="truncate">{suggestion}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator - Mobile responsive */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-1 sm:space-x-2 lg:space-x-3">
                        <Avatar className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8">
                          <AvatarFallback
                            className={`transition-all duration-300 ${theme === "dark" ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-700"
                              }`}
                          >
                            <Bot className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${theme === "dark"
                            ? "bg-slate-700 border border-slate-600"
                            : "bg-slate-100 border border-slate-200"
                            }`}
                        >
                          <div className="flex space-x-1">
                            <div
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-orange-400" : "bg-orange-500"
                                }`}
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-orange-400" : "bg-orange-500"
                                }`}
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-bounce ${theme === "dark" ? "bg-orange-400" : "bg-orange-500"
                                }`}
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Quick Actions & Input - Responsive bottom section */}
              <div
                className={`flex-shrink-0 p-2 sm:p-3 lg:p-4 border-t transition-all duration-300 ${theme === "dark"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700"
                  : "bg-gradient-to-r from-orange-50 to-pink-50 border-slate-200"
                  }`}
              >
                {/* Quick Actions - Mobile first layout */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.action)}
                        className={`text-xs h-7 sm:h-8 lg:h-9 rounded-full border-0 transition-all duration-300 px-2 sm:px-3 ${action.color}`}
                      >
                        <Icon className="mr-1 sm:mr-2 h-3 w-3" />
                        <span className="hidden sm:inline">{action.label}</span>
                        <span className="sm:hidden">{action.label.split(' ')[0]}</span>
                      </Button>
                    )
                  })}
                </div>

                {/* Input Area - Mobile responsive */}
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className={`pr-10 sm:pr-12 h-9 sm:h-10 lg:h-12 rounded-full border-2 transition-all duration-300 text-xs sm:text-sm ${theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-orange-400"
                        : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-orange-300"
                        }`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleVoice}
                      className={`absolute right-1 top-1 h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 rounded-full transition-all duration-300 ${isListening
                        ? theme === "dark"
                          ? "bg-red-900/20 text-red-400 animate-pulse"
                          : "bg-red-100 text-red-600 animate-pulse"
                        : theme === "dark"
                          ? "hover:bg-orange-900/20 hover:text-orange-400"
                          : "hover:bg-orange-100 hover:text-orange-600"
                        }`}
                    >
                      {isListening ? <MicOff className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" /> : <Mic className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleSendMessage()}
                    className={`h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r transition-all duration-300 ${getGradientPrimary()}`}
                    disabled={!inputMessage.trim()}
                  >
                    <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Sidebar - Hidden on mobile and tablets */}
        <div className="hidden lg:block space-y-4">
          {/* Voice Commands */}
          <Card className={`border-0 shadow-lg transition-all duration-300 ${getCardBackground()}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg flex items-center transition-colors duration-300 ${getTextColor()}`}>
                <Mic className={`mr-2 h-5 w-5 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
                Voice Commands
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {[
                  "Hey GaadiSetGo, find parking",
                  "Check my challans",
                  "Book service appointment",
                  "Show car accessories",
                  "What's my FASTag balance?",
                ].map((command, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`w-full justify-start p-2 text-xs transition-all duration-300 ${theme === "dark"
                      ? "bg-slate-700 text-slate-300 border-slate-600"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                  >
                    <MessageCircle className="mr-2 h-3 w-3" />&ldquo;{command}&rdquo;
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card className={`border-0 shadow-lg transition-all duration-300 ${getCardBackground()}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg flex items-center transition-colors duration-300 ${getTextColor()}`}>
                <Zap className={`mr-2 h-5 w-5 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 text-sm">
                {[
                  { icon: "🅿️", text: "Real-time parking availability" },
                  { icon: "🗺️", text: "Smart route optimization" },
                  { icon: "🎯", text: "Personalized recommendations" },
                  { icon: "🗣️", text: "Voice-activated booking" },
                  { icon: "🔔", text: "Predictive maintenance alerts" },
                  { icon: "💡", text: "Intelligent cost optimization" },
                ].map((capability, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-lg">{capability.icon}</span>
                    <span className={`transition-colors duration-300 ${getTextColor()}`}>{capability.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className={`border-0 shadow-lg transition-all duration-300 ${getCardBackground()}`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-lg flex items-center transition-colors duration-300 ${getTextColor()}`}>
                <Bot className={`mr-2 h-5 w-5 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
                Recent Assistance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3 text-sm">
                {[
                  { action: "Parking booked", time: "2 hours ago", icon: Car },
                  { action: "Service reminder sent", time: "1 day ago", icon: Wrench },
                  { action: "Product recommendation", time: "2 days ago", icon: ShoppingCart },
                  { action: "Route optimized", time: "3 days ago", icon: MapPin },
                ].map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${theme === "dark" ? "bg-slate-700/30" : "bg-slate-100/50"
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`} />
                        <span className={`transition-colors duration-300 ${getTextColor()}`}>{activity.action}</span>
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${getMutedTextColor()}`}>
                        {activity.time}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
