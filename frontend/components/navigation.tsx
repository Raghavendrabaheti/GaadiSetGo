"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, MessageCircle, Wrench, LayoutDashboard, Home, User, Settings, LogOut } from "lucide-react"

interface NavigationProps {
  currentScreen: string
  onScreenChange: (screen: string) => void
  isMobile: boolean
  isOpen: boolean
  isBottom?: boolean
  isHorizontal?: boolean
  theme: string
  onLogout?: () => void
}

export default function Navigation({
  currentScreen,
  onScreenChange,
  isMobile,
  isOpen: _isOpen,
  isBottom,
  isHorizontal,
  theme,
  onLogout,
}: NavigationProps) {
  const screens = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      color: theme === "dark" ? "text-slate-400" : "text-slate-600",
      hoverColor: theme === "dark" ? "hover:text-slate-300" : "hover:text-slate-700",
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: theme === "dark" ? "text-blue-400" : "text-blue-600",
      hoverColor: theme === "dark" ? "hover:text-blue-300" : "hover:text-blue-700",
    },
    {
      id: "services",
      label: "Services",
      icon: Wrench,
      color: theme === "dark" ? "text-green-400" : "text-green-600",
      hoverColor: theme === "dark" ? "hover:text-green-300" : "hover:text-green-700",
    },
    {
      id: "ecommerce",
      label: "Shop",
      icon: ShoppingCart,
      color: theme === "dark" ? "text-purple-400" : "text-purple-600",
      hoverColor: theme === "dark" ? "hover:text-purple-300" : "hover:text-purple-700",
      badge: "2",
    },
    {
      id: "ai",
      label: "AI Assistant",
      icon: MessageCircle,
      color: theme === "dark" ? "text-orange-400" : "text-orange-600",
      hoverColor: theme === "dark" ? "hover:text-orange-300" : "hover:text-orange-700",
    },
  ]

  const accountItems = [
    {
      id: "account",
      label: "Account",
      icon: User,
      color: theme === "dark" ? "text-indigo-400" : "text-indigo-600",
      hoverColor: theme === "dark" ? "hover:text-indigo-300" : "hover:text-indigo-700",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: theme === "dark" ? "text-gray-400" : "text-gray-600",
      hoverColor: theme === "dark" ? "hover:text-gray-300" : "hover:text-gray-700",
    },
  ]

  const getTextColor = (isActive: boolean) => {
    if (isActive) {
      return theme === "dark" ? "text-slate-100" : "text-slate-900"
    }
    return theme === "dark" ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
  }

  const getBackgroundColor = (isActive: boolean) => {
    if (isActive) {
      return theme === "dark"
        ? "bg-slate-700 shadow-lg border border-slate-600"
        : "bg-white shadow-lg border border-slate-200"
    }
    return theme === "dark" ? "hover:bg-slate-700/50" : "hover:bg-slate-100/50"
  }

  if (isBottom) {
    return (
      <div className="grid grid-cols-5 h-14 sm:h-16 px-1 sm:px-2 w-full max-w-full overflow-hidden">
        {screens.map((screen) => {
          const Icon = screen.icon
          const isActive = currentScreen === screen.id
          return (
            <button
              key={screen.id}
              onClick={() => onScreenChange(screen.id)}
              className={`flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 transition-all duration-200 rounded-lg mx-0.5 sm:mx-1 min-w-0 ${isActive ? `${screen.color} scale-105 sm:scale-110` : getTextColor(false)
                }`}
            >
              <div className="relative flex-shrink-0">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                {screen.badge && (
                  <Badge
                    className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-3 w-3 sm:h-4 sm:w-4 p-0 text-xs flex items-center justify-center ${theme === "dark" ? "bg-red-500 text-white" : "bg-red-500 text-white"
                      }`}
                  >
                    {screen.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium leading-tight truncate max-w-full">{screen.label}</span>
            </button>
          )
        })}
        {/* Account button in bottom navigation */}
        <button
          onClick={() => onScreenChange("account")}
          className={`flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 transition-all duration-200 rounded-lg mx-0.5 sm:mx-1 min-w-0 ${currentScreen === "account" ? "text-indigo-600 scale-105 sm:scale-110" : getTextColor(false)
            }`}
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="text-xs font-medium leading-tight truncate max-w-full">Account</span>
        </button>
      </div>
    )
  }

  // Horizontal navigation for header
  if (isHorizontal) {
    return (
      <div className="flex items-center space-x-1">
        {/* Main navigation items */}
        <div className="hidden lg:flex items-center space-x-1">
          {screens.map((screen) => {
            const Icon = screen.icon
            const isActive = currentScreen === screen.id
            return (
              <Button
                key={screen.id}
                variant="ghost"
                size="sm"
                className={`transition-all duration-200 ${isActive
                  ? "bg-white/20 text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/10"
                  }`}
                onClick={() => onScreenChange(screen.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="font-medium">{screen.label}</span>
                {screen.badge && (
                  <Badge className="ml-2 h-4 w-4 p-0 text-xs bg-red-500 text-white">
                    {screen.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>

        {/* Account dropdown for desktop */}
        <div className="hidden lg:flex items-center space-x-1 ml-4 pl-4 border-l border-white/20">
          {accountItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`transition-all duration-200 ${isActive
                  ? "bg-white/20 text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/10"
                  }`}
                onClick={() => onScreenChange(item.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="font-medium">{item.label}</span>
              </Button>
            )
          })}
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>
    )
  }

  if (!isMobile) {
    return (
      <aside
        className={`hidden md:flex w-64 flex-col border-r backdrop-blur-sm transition-all duration-300 ${theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-slate-200"
          }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex-1">
            <h3
              className={`font-semibold text-lg mb-4 transition-colors duration-300 ${theme === "dark" ? "text-slate-100" : "text-slate-900"
                }`}
            >
              Navigation
            </h3>
            <nav className="space-y-2">
              {screens.map((screen) => {
                const Icon = screen.icon
                const isActive = currentScreen === screen.id
                return (
                  <Button
                    key={screen.id}
                    variant="ghost"
                    className={`w-full justify-start h-12 transition-all duration-200 ${getBackgroundColor(
                      isActive,
                    )} ${getTextColor(isActive)}`}
                    onClick={() => onScreenChange(screen.id)}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 transition-colors duration-200 ${isActive ? (theme === "dark" ? "text-slate-100" : "text-slate-900") : screen.color
                        }`}
                    />
                    <span className="font-medium">{screen.label}</span>
                    {screen.badge && (
                      <Badge
                        className={`ml-auto transition-colors duration-200 ${isActive
                          ? theme === "dark"
                            ? "bg-slate-600 text-slate-200"
                            : "bg-slate-200 text-slate-700"
                          : theme === "dark"
                            ? "bg-red-500 text-white"
                            : "bg-red-500 text-white"
                          }`}
                      >
                        {screen.badge}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </nav>
          </div>

          {/* Account Section */}
          <div className="border-t border-slate-200 pt-4">
            <h4
              className={`font-medium text-sm mb-3 transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
            >
              Account
            </h4>
            <nav className="space-y-2">
              {accountItems.map((item) => {
                const Icon = item.icon
                const isActive = currentScreen === item.id
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start h-10 transition-all duration-200 ${getBackgroundColor(
                      isActive,
                    )} ${getTextColor(isActive)}`}
                    onClick={() => onScreenChange(item.id)}
                  >
                    <Icon
                      className={`mr-3 h-4 w-4 transition-colors duration-200 ${isActive ? (theme === "dark" ? "text-slate-100" : "text-slate-900") : item.color
                        }`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Button>
                )
              })}
              {/* Logout Button */}
              <Button
                variant="ghost"
                className={`w-full justify-start h-10 transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50`}
                onClick={onLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium text-sm">Logout</span>
              </Button>
            </nav>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <div className="p-3 sm:p-4 flex flex-col h-full">
      <div className="flex-1">
        <nav className="space-y-1 sm:space-y-2">
          {screens.map((screen) => {
            const Icon = screen.icon
            const isActive = currentScreen === screen.id
            return (
              <Button
                key={screen.id}
                variant="ghost"
                className={`w-full justify-start h-10 sm:h-12 transition-all duration-200 ${getBackgroundColor(
                  isActive,
                )} ${getTextColor(isActive)}`}
                onClick={() => onScreenChange(screen.id)}
              >
                <Icon
                  className={`mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${isActive ? (theme === "dark" ? "text-slate-100" : "text-slate-900") : screen.color
                    }`}
                />
                <span className="font-medium text-sm sm:text-base">{screen.label}</span>
                {screen.badge && (
                  <Badge
                    className={`ml-auto transition-colors duration-200 ${isActive
                      ? theme === "dark"
                        ? "bg-slate-600 text-slate-200"
                        : "bg-slate-200 text-slate-700"
                      : theme === "dark"
                        ? "bg-red-500 text-white"
                        : "bg-red-500 text-white"
                      }`}
                  >
                    {screen.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Mobile Account Section */}
      <div className="border-t border-slate-200 pt-3 sm:pt-4 mt-3 sm:mt-4">
        <h4
          className={`font-medium text-xs sm:text-sm mb-2 sm:mb-3 transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"
            }`}
        >
          Account
        </h4>
        <nav className="space-y-1 sm:space-y-2">
          {accountItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start h-9 sm:h-10 transition-all duration-200 ${getBackgroundColor(
                  isActive,
                )} ${getTextColor(isActive)}`}
                onClick={() => onScreenChange(item.id)}
              >
                <Icon
                  className={`mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 transition-colors duration-200 ${isActive ? (theme === "dark" ? "text-slate-100" : "text-slate-900") : item.color
                    }`}
                />
                <span className="font-medium text-xs sm:text-sm">{item.label}</span>
              </Button>
            )
          })}
          {/* Logout Button */}
          <Button
            variant="ghost"
            className={`w-full justify-start h-9 sm:h-10 transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50`}
            onClick={onLogout}
          >
            <LogOut className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="font-medium text-xs sm:text-sm">Logout</span>
          </Button>
        </nav>
      </div>
    </div>
  )
}
