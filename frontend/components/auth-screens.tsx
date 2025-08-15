"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Eye, EyeOff, Mail, Lock, User, Phone, Chrome, Github, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface AuthScreensProps {
  onLogin: () => void
  onBack?: () => void
  theme: string
}

export default function AuthScreens({ onLogin, onBack, theme }: AuthScreensProps) {
  const { login, register, isLoading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Clear auth error when user starts typing
    if (authError) {
      setAuthError(null)
    }
  }

  const validateForm = (isSignUp: boolean) => {
    const errors: Record<string, string> = {}

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (isSignUp) {
      if (!formData.name) {
        errors.name = "Name is required"
      }
      if (!formData.phone) {
        errors.phone = "Phone number is required"
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
        errors.phone = "Please enter a valid 10-digit phone number"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault()

    if (!validateForm(isSignUp)) {
      return
    }

    setIsLoading(true)
    setAuthError(null)

    try {
      let result;

      if (isSignUp) {
        // Register user
        result = await register({
          email: formData.email,
          password: formData.password,
          full_name: formData.name,
          phone: formData.phone || undefined,
        })
      } else {
        // Login user
        result = await login(formData.email, formData.password)
      }

      if (result.success) {
        // Success - add a small delay to ensure auth context is updated, then redirect
        console.log('Auth successful, redirecting in 100ms...');
        setTimeout(() => {
          onLogin()
        }, 100)
      } else {
        // Show error from API
        setAuthError(result.error || 'Authentication failed')
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error)
      setAuthError((error as Error).message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const password = formData.password
    let strength = 0
    if (password.length >= 6) strength += 25
    if (password.match(/[a-z]/)) strength += 25
    if (password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 25
    return strength
  }

  const getCardBackground = () => {
    return theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
  }

  const getGradientBackground = () => {
    return theme === "dark"
      ? "bg-gradient-to-br from-slate-800 to-slate-900"
      : "bg-gradient-to-br from-white to-blue-50"
  }

  const getTextColor = () => {
    return theme === "dark" ? "text-slate-100" : "text-slate-900"
  }

  const getMutedTextColor = () => {
    return theme === "dark" ? "text-slate-400" : "text-slate-600"
  }

  const getInputBackground = () => {
    return theme === "dark"
      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500"
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home Button */}
        {onBack && (
          <div className="flex justify-start">
            <Button
              variant="ghost"
              onClick={onBack}
              className={`transition-all duration-300 ${theme === "dark"
                ? "hover:bg-slate-700 text-slate-300 hover:text-slate-100"
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Button>
          </div>
        )}

        {/* Welcome Card */}
        <Card className={`text-center border-0 shadow-xl transition-all duration-300 ${getGradientBackground()}`}>
          <CardHeader className="pb-4">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${theme === "dark"
                ? "bg-gradient-to-br from-blue-400 to-purple-400"
                : "bg-gradient-to-br from-blue-500 to-purple-600"
                }`}
            >
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <CardTitle
              className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${theme === "dark" ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
                }`}
            >
              Welcome to GaadiSetGo
            </CardTitle>
            <CardDescription className={`text-base transition-colors duration-300 ${getMutedTextColor()}`}>
              Your comprehensive vehicle parking and services solution
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Auth Form */}
        <Card className={`shadow-xl border-0 transition-all duration-300 ${getCardBackground()}`}>
          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList
                className={`grid w-full grid-cols-2 mb-6 transition-all duration-300 ${theme === "dark" ? "bg-slate-700" : "bg-slate-100"
                  }`}
              >
                <TabsTrigger
                  value="signin"
                  className={`font-medium transition-all duration-300 ${theme === "dark"
                    ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                    : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
                    }`}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className={`font-medium transition-all duration-300 ${theme === "dark"
                    ? "data-[state=active]:bg-slate-600 data-[state=active]:text-slate-100"
                    : "data-[state=active]:bg-white data-[state=active]:text-slate-900"
                    }`}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                {/* Auth Error Display */}
                {authError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{authError}</span>
                  </div>
                )}

                <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 h-12 transition-all duration-300 ${getInputBackground()} ${validationErrors.email
                          ? theme === "dark"
                            ? "border-red-400 focus:border-red-400"
                            : "border-red-500 focus:border-red-500"
                          : ""
                          }`}
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                      {validationErrors.email && (
                        <div
                          className={`flex items-center mt-1 text-sm transition-colors duration-300 ${theme === "dark" ? "text-red-400" : "text-red-500"
                            }`}
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {validationErrors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                      />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pl-10 pr-12 h-12 transition-all duration-300 ${getInputBackground()} ${validationErrors.password
                          ? theme === "dark"
                            ? "border-red-400 focus:border-red-400"
                            : "border-red-500 focus:border-red-500"
                          : ""
                          }`}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute right-0 top-0 h-12 px-3 transition-colors duration-300 ${theme === "dark" ? "hover:bg-slate-600 text-slate-400" : "hover:bg-slate-100 text-slate-600"
                          }`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      {validationErrors.password && (
                        <div
                          className={`flex items-center mt-1 text-sm transition-colors duration-300 ${theme === "dark" ? "text-red-400" : "text-red-500"
                            }`}
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {validationErrors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full h-12 font-medium transition-all duration-300 ${theme === "dark"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      }`}
                    disabled={isLoading || authLoading}
                  >
                    {(isLoading || authLoading) ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Signing In...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Button
                    variant="link"
                    className={`text-sm transition-colors duration-300 ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                      }`}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                {/* Auth Error Display */}
                {authError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{authError}</span>
                  </div>
                )}

                <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                      />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className={`pl-10 h-12 transition-all duration-300 ${getInputBackground()} ${validationErrors.name
                          ? theme === "dark"
                            ? "border-red-400 focus:border-red-400"
                            : "border-red-500 focus:border-red-500"
                          : ""
                          }`}
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                      {validationErrors.name && (
                        <div
                          className={`flex items-center mt-1 text-sm transition-colors duration-300 ${theme === "dark" ? "text-red-400" : "text-red-500"
                            }`}
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {validationErrors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                      />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className={`pl-10 h-12 transition-all duration-300 ${getInputBackground()} ${validationErrors.phone
                          ? theme === "dark"
                            ? "border-red-400 focus:border-red-400"
                            : "border-red-500 focus:border-red-500"
                          : ""
                          }`}
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                      {validationErrors.phone && (
                        <div
                          className={`flex items-center mt-1 text-sm transition-colors duration-300 ${theme === "dark" ? "text-red-400" : "text-red-500"
                            }`}
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {validationErrors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-email"
                      className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                      />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 h-12 transition-all duration-300 ${getInputBackground()} ${validationErrors.email
                          ? theme === "dark"
                            ? "border-red-400 focus:border-red-400"
                            : "border-red-500 focus:border-red-500"
                          : ""
                          }`}
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                      {validationErrors.email && (
                        <div
                          className={`flex items-center mt-1 text-sm transition-colors duration-300 ${theme === "dark" ? "text-red-400" : "text-red-500"
                            }`}
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {validationErrors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-password"
                      className={`text-sm font-medium transition-colors duration-300 ${getTextColor()}`}
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${getMutedTextColor()}`}
                      />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className={`pl-10 pr-12 h-12 transition-all duration-300 ${getInputBackground()} ${validationErrors.password
                          ? theme === "dark"
                            ? "border-red-400 focus:border-red-400"
                            : "border-red-500 focus:border-red-500"
                          : ""
                          }`}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={`absolute right-0 top-0 h-12 px-3 transition-colors duration-300 ${theme === "dark" ? "hover:bg-slate-600 text-slate-400" : "hover:bg-slate-100 text-slate-600"
                          }`}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {formData.password && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className={`transition-colors duration-300 ${getMutedTextColor()}`}>
                            Password strength
                          </span>
                          <span
                            className={`transition-colors duration-300 ${getPasswordStrength() >= 75
                              ? theme === "dark"
                                ? "text-green-400"
                                : "text-green-600"
                              : getPasswordStrength() >= 50
                                ? theme === "dark"
                                  ? "text-yellow-400"
                                  : "text-yellow-600"
                                : theme === "dark"
                                  ? "text-red-400"
                                  : "text-red-600"
                              }`}
                          >
                            {getPasswordStrength() >= 75 ? "Strong" : getPasswordStrength() >= 50 ? "Medium" : "Weak"}
                          </span>
                        </div>
                        <Progress
                          value={getPasswordStrength()}
                          className={`h-2 transition-all duration-300 ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                            }`}
                        />
                      </div>
                    )}
                    {validationErrors.password && (
                      <div
                        className={`flex items-center mt-1 text-sm transition-colors duration-300 ${theme === "dark" ? "text-red-400" : "text-red-500"
                          }`}
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.password}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className={`w-full h-12 font-medium transition-all duration-300 ${theme === "dark"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      }`}
                    disabled={isLoading || authLoading}
                  >
                    {(isLoading || authLoading) ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator
                    className={`w-full transition-colors duration-300 ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`}
                  />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span
                    className={`px-2 font-medium transition-colors duration-300 ${theme === "dark" ? "bg-slate-800 text-slate-400" : "bg-white text-slate-600"
                      }`}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={onLogin}
                  className={`h-12 font-medium transition-all duration-300 ${theme === "dark"
                    ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                    : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={onLogin}
                  className={`h-12 font-medium transition-all duration-300 ${theme === "dark"
                    ? "border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200"
                    : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card
          className={`border-0 transition-all duration-300 ${theme === "dark"
            ? "bg-gradient-to-r from-slate-800 to-slate-900"
            : "bg-gradient-to-r from-blue-50 to-purple-50"
            }`}
        >
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              {[
                { icon: "🅿️", label: "Smart Parking", color: theme === "dark" ? "bg-blue-900" : "bg-blue-100" },
                { icon: "🔧", label: "Vehicle Services", color: theme === "dark" ? "bg-green-900" : "bg-green-100" },
                { icon: "🛒", label: "Auto Shopping", color: theme === "dark" ? "bg-purple-900" : "bg-purple-100" },
                { icon: "🤖", label: "AI Assistant", color: theme === "dark" ? "bg-orange-900" : "bg-orange-100" },
              ].map((feature, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${feature.color}`}
                  >
                    <span className="text-lg">{feature.icon}</span>
                  </div>
                  <p className={`text-xs font-medium transition-colors duration-300 ${getTextColor()}`}>
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
