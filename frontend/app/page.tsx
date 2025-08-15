"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Car, Menu, X } from "lucide-react"
import HomePage from "@/components/home-page"
import AuthScreens from "@/components/auth-screens"
import ParkingDashboard from "@/components/parking-dashboard"
import VehicleServices from "@/components/vehicle-services"
import ECommerceSection from "@/components/ecommerce-section"
import AIAssistant from "@/components/ai-assistant"
import AccountPage from "@/components/account-page"
import SettingsPage from "@/components/settings-page"
import Navigation from "@/components/navigation"
import LoadingScreen from "@/components/loading-screen"
import ConnectionTest from "@/components/connection-test"
import { useAuth } from "@/lib/auth-context"

export default function VehicleParkingApp() {
  const { isAuthenticated, logout, isLoading: authLoading } = useAuth()
  const [currentScreen, setCurrentScreen] = useState("home")
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Watch for authentication state changes and redirect accordingly
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, authLoading, currentScreen }); // Debug log

    // If user becomes authenticated while on auth screen, redirect to dashboard
    // Only do this if we're still on the auth screen (manual redirect in handleLogin should handle it first)
    if (isAuthenticated && !authLoading && currentScreen === "auth") {
      console.log('User authenticated via useEffect, redirecting to dashboard'); // Debug log
      setCurrentScreen("dashboard")
    }

    // If user is not authenticated but trying to access protected screen, redirect to auth
    if (!isAuthenticated && !authLoading && !["home", "auth"].includes(currentScreen)) {
      console.log('User not authenticated, redirecting to auth'); // Debug log
      setCurrentScreen("auth")
    }
  }, [isAuthenticated, authLoading, currentScreen])

  // Redirect to home when user logs out
  useEffect(() => {
    if (!isAuthenticated && !authLoading && !["home", "auth"].includes(currentScreen)) {
      setCurrentScreen("home")
    }
  }, [isAuthenticated, authLoading, currentScreen])

  // Fixed theme colors - using light theme only
  const themeColors = {
    primary: "from-blue-600 to-purple-600",
    accent: "from-orange-500 to-pink-500",
  }

  const handleLogin = () => {
    console.log('handleLogin called - redirecting to dashboard'); // Debug log
    // Redirect to dashboard immediately after successful login
    setCurrentScreen("dashboard")
    console.log('Screen set to dashboard'); // Debug log
  }

  const handleLogout = () => {
    setIsLoading(true)
    logout()
    setTimeout(() => {
      setCurrentScreen("home")
      setIsLoading(false)
    }, 1000)
  }

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentScreen("auth")
      setIsLoading(false)
    }, 300)
  }

  const handleBackToHome = () => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentScreen("home")
      setIsLoading(false)
    }, 300)
  }

  const handleScreenChange = (screen: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentScreen(screen)
      setIsLoading(false)
      setIsMobileMenuOpen(false)
    }, 300)
  }

  if (isLoading || authLoading) {
    return <LoadingScreen theme="light" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden w-full max-w-full">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 w-full max-w-full">
        {/* Glass Effect Background with enhanced blur and transparency */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/20 to-white/25 backdrop-blur-xl border-b border-white/30 shadow-lg shadow-black/5"></div>
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10"></div>

        <div className="relative w-full">
          <div className="w-full max-w-full flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
              <div className={`p-1.5 sm:p-2 rounded-xl shadow-lg bg-gradient-to-br ${themeColors.primary} transition-all duration-300 hover:shadow-xl hover:scale-105 flex-shrink-0`}>
                <Car className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0 max-w-[200px] sm:max-w-none">
                <span className={`font-bold text-sm sm:text-lg lg:text-xl bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent truncate block`}>
                  GaadiSetGo
                </span>
                <p className="text-xs hidden sm:block text-slate-600 truncate">
                  AI-Enhanced Vehicle Platform
                </p>
              </div>
            </div>

            {/* Horizontal Navigation */}
            {isAuthenticated && (
              <div className="hidden lg:block">
                <Navigation
                  currentScreen={currentScreen}
                  onScreenChange={handleScreenChange}
                  isMobile={false}
                  isOpen={true}
                  isHorizontal={true}
                  theme="light"
                  onLogout={handleLogout}
                />
              </div>
            )}

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Sign In Button - Only show on home page with glass effect */}
              {currentScreen === "home" && !isAuthenticated && (
                <Button
                  onClick={handleGetStarted}
                  className={`bg-gradient-to-r ${themeColors.primary} hover:shadow-xl transition-all duration-300 text-white px-3 sm:px-4 lg:px-6 py-2 text-xs sm:text-sm lg:text-base rounded-lg backdrop-blur-sm border border-white/20 hover:scale-105 whitespace-nowrap`}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Toggle with glass effect */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-full transition-all duration-300 hover:bg-white/30 text-slate-600 hover:text-slate-900 backdrop-blur-sm border border-white/20 hover:scale-105 flex-shrink-0"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-3 w-3 sm:h-4 sm:w-4" /> : <Menu className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Navigation Overlay with enhanced glass effects */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed left-0 top-14 sm:top-16 bottom-0 w-64 sm:w-72 bg-white/20 backdrop-blur-xl border-r border-white/30 shadow-2xl transition-all duration-300 max-w-[calc(100vw-2rem)] overflow-hidden">
              <Navigation
                currentScreen={currentScreen}
                onScreenChange={handleScreenChange}
                isMobile={true}
                isOpen={isMobileMenuOpen}
                theme="light"
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 w-full max-w-full overflow-x-hidden">
          <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-20 sm:pb-6 max-w-full box-border">
            {currentScreen === "home" && !isAuthenticated && <HomePage onGetStarted={handleGetStarted} />}
            {currentScreen === "home" && isAuthenticated && (
              <div className="space-y-6">
                <ConnectionTest className="max-w-md mx-auto" />
                <HomePage onGetStarted={handleGetStarted} />
              </div>
            )}
            {currentScreen === "auth" && <AuthScreens onLogin={handleLogin} onBack={handleBackToHome} theme="light" />}
            {currentScreen === "dashboard" && (
              <div>
                <p>Debug: isAuthenticated = {isAuthenticated.toString()}, currentScreen = {currentScreen}</p>
                {isAuthenticated ? <ParkingDashboard theme="light" /> : <div>Not authenticated - redirecting...</div>}
              </div>
            )}
            {currentScreen === "services" && isAuthenticated && <VehicleServices theme="light" />}
            {currentScreen === "ecommerce" && isAuthenticated && <ECommerceSection theme="light" />}
            {currentScreen === "ai" && isAuthenticated && <AIAssistant theme="light" />}
            {currentScreen === "account" && isAuthenticated && <AccountPage theme="light" />}
            {currentScreen === "settings" && isAuthenticated && <SettingsPage theme="light" />}

            {/* Fallback: If trying to access protected content without auth, redirect to auth */}
            {!isAuthenticated && !["home", "auth"].includes(currentScreen) && (
              <AuthScreens onLogin={handleLogin} onBack={handleBackToHome} theme="light" />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation with enhanced glass effect */}
      {isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/25 backdrop-blur-xl border-t border-white/30 lg:hidden z-30 transition-all duration-300 shadow-lg shadow-black/5">
          <Navigation
            currentScreen={currentScreen}
            onScreenChange={handleScreenChange}
            isMobile={true}
            isOpen={true}
            isBottom={true}
            theme="light"
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* AI Assistant Floating Button with enhanced glass effect */}
      {isAuthenticated && currentScreen !== "ai" && (
        <Button
          className={`fixed bottom-20 sm:bottom-24 lg:bottom-6 right-3 sm:right-4 lg:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r ${themeColors.accent} hover:scale-110 z-20 backdrop-blur-sm border border-white/20`}
          onClick={() => handleScreenChange("ai")}
        >
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
            <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </Button>
      )}
    </div>
  )
}
