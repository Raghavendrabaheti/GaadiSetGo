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
  isOpen,
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
      <div className="grid grid-cols-5 h-14 sm:h-16 px-1 sm:px-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        {screens.map((screen) => {
          const Icon = screen.icon
          const isActive = currentScreen === screen.id
          return (
            <button
              key={screen.id}
              onClick={() => onScreenChange(screen.id)}
              className={`flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 transition-all duration-200 rounded-lg mx-0.5 sm:mx-1 py-1 sm:py-2 ${
                isActive 
                  ? `${screen.color} scale-105 sm:scale-110 bg-slate-100 dark:bg-slate-800` 
                  : getTextColor(false)
              }`}
            >
              <div className="relative">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                {screen.badge && (
                  <Badge
                    className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-3 w-3 sm:h-4 sm:w-4 p-0 text-[10px] sm:text-xs flex items-center justify-center ${
                      theme === "dark" ? "bg-red-500 text-white" : "bg-red-500 text-white"
                    }`}
                  >
                    {screen.badge}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-medium leading-tight">{screen.label}</span>
            </button>
          )
        })}
        {/* Account button in bottom navigation */}
        <button
          onClick={() => onScreenChange("account")}
          className={`flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 transition-all duration-200 rounded-lg mx-0.5 sm:mx-1 py-1 sm:py-2 ${
            currentScreen === "account" 
              ? "text-indigo-600 scale-105 sm:scale-110 bg-slate-100 dark:bg-slate-800" 
              : getTextColor(false)
          }`}
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-[10px] sm:text-xs font-medium leading-tight">Account</span>
        </button>
      </div>
    )
  }

  // Horizontal navigation for header
  if (isHorizontal) {
    return (
      <div className="flex items-center justify-between w-full">
        {/* Main navigation items */}
        <div className="flex items-center space-x-1">
          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {screens.map((screen) => {
              const Icon = screen.icon
              const isActive = currentScreen === screen.id
              return (
                <Button
                  key={screen.id}
                  variant="ghost"
                  size="sm"
                  className={`transition-all duration-200 ${
                    isActive
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

          {/* Tablet navigation - condensed */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {screens.map((screen) => {
              const Icon = screen.icon
              const isActive = currentScreen === screen.id
              return (
                <Button
                  key={screen.id}
                  variant="ghost"
                  size="sm"
                  className={`transition-all duration-200 px-2 ${
                    isActive
                      ? "bg-white/20 text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/10"
                  }`}
                  onClick={() => onScreenChange(screen.id)}
                >
                  <Icon className="h-4 w-4" />
                  {screen.badge && (
                    <Badge className="ml-1 h-3 w-3 p-0 text-xs bg-red-500 text-white">
                      {screen.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>

          {/* Mobile navigation - icons only for most important items */}
          <div className="flex md:hidden items-center space-x-1">
            {screens.slice(0, 3).map((screen) => {
              const Icon = screen.icon
              const isActive = currentScreen === screen.id
              return (
                <Button
                  key={screen.id}
                  variant="ghost"
                  size="sm"
                  className={`transition-all duration-200 px-2 relative ${
                    isActive
                      ? "bg-white/20 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/10"
                  }`}
                  onClick={() => onScreenChange(screen.id)}
                >
                  <Icon className="h-4 w-4" />
                  {screen.badge && (
                    <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 text-xs bg-red-500 text-white">
                      {screen.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Account section - responsive */}
        <div className="flex items-center space-x-1">
          {/* Desktop account section */}
          <div className="hidden lg:flex items-center space-x-1 ml-4 pl-4 border-l border-white/20">
            {accountItems.map((item) => {
              const Icon = item.icon
              const isActive = currentScreen === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={`transition-all duration-200 ${
                    isActive
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

          {/* Tablet account section - icons only */}
          <div className="hidden md:flex lg:hidden items-center space-x-1 ml-2 pl-2 border-l border-white/20">
            {accountItems.map((item) => {
              const Icon = item.icon
              const isActive = currentScreen === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  className={`transition-all duration-200 px-2 ${
                    isActive
                      ? "bg-white/20 text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/10"
                  }`}
                  onClick={() => onScreenChange(item.id)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200 px-2"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile account section - single account icon */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="sm"
              className={`transition-all duration-200 px-2 ${
                currentScreen === "account"
                  ? "bg-white/20 text-slate-900"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/10"
              }`}
              onClick={() => onScreenChange("account")}
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isMobile) {
    return (
      <aside
        className={`hidden md:flex w-56 lg:w-64 xl:w-72 flex-col border-r backdrop-blur-sm transition-all duration-300 ${theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-white/50 border-slate-200"
          }`}
      >
        <div className="p-4 lg:p-6 flex flex-col h-full">
          <div className="flex-1">
            <h3
              className={`font-semibold text-base lg:text-lg mb-3 lg:mb-4 transition-colors duration-300 ${theme === "dark" ? "text-slate-100" : "text-slate-900"
                }`}
            >
              Navigation
            </h3>
            <nav className="space-y-1 lg:space-y-2">
              {screens.map((screen) => {
                const Icon = screen.icon
                const isActive = currentScreen === screen.id
                return (
                  <Button
                    key={screen.id}
                    variant="ghost"
                    className={`w-full justify-start h-10 lg:h-12 text-sm lg:text-base transition-all duration-200 ${getBackgroundColor(
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
            <nav className="space-y-1 lg:space-y-2">
              {accountItems.map((item) => {
                const Icon = item.icon
                const isActive = currentScreen === item.id
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start h-8 lg:h-10 text-sm transition-all duration-200 ${getBackgroundColor(
                      isActive,
                    )} ${getTextColor(isActive)}`}
                    onClick={() => onScreenChange(item.id)}
                  >
                    <Icon
                      className={`mr-2 lg:mr-3 h-3 lg:h-4 w-3 lg:w-4 transition-colors duration-200 ${isActive ? (theme === "dark" ? "text-slate-100" : "text-slate-900") : item.color
                        }`}
                    />
                    <span className="font-medium text-xs lg:text-sm truncate">{item.label}</span>
                  </Button>
                )
              })}
              {/* Logout Button */}
              <Button
                variant="ghost"
                className={`w-full justify-start h-8 lg:h-10 text-sm transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
                onClick={onLogout}
              >
                <LogOut className="mr-2 lg:mr-3 h-3 lg:h-4 w-3 lg:w-4" />
                <span className="font-medium text-xs lg:text-sm">Logout</span>
              </Button>
            </nav>
          </div>

          {/* Account Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 lg:pt-4">
            <h4
              className={`font-medium text-xs lg:text-sm mb-2 lg:mb-3 transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
            >
              Account
            </h4>
            <nav className="space-y-1 lg:space-y-2">
              {accountItems.map((item) => {
                const Icon = item.icon
                const isActive = currentScreen === item.id
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start h-8 lg:h-10 text-sm transition-all duration-200 ${getBackgroundColor(
                      isActive,
                    )} ${getTextColor(isActive)}`}
                    onClick={() => onScreenChange(item.id)}
                  >
                    <Icon
                      className={`mr-2 lg:mr-3 h-3 lg:h-4 w-3 lg:w-4 transition-colors duration-200 ${isActive ? (theme === "dark" ? "text-slate-100" : "text-slate-900") : item.color
                        }`}
                    />
                    <span className="font-medium text-xs lg:text-sm truncate">{item.label}</span>
                  </Button>
                )
              })}
              {/* Logout Button */}
              <Button
                variant="ghost"
                className={`w-full justify-start h-8 lg:h-10 text-sm transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
                onClick={onLogout}
              >
                <LogOut className="mr-2 lg:mr-3 h-3 lg:h-4 w-3 lg:w-4" />
                <span className="font-medium text-xs lg:text-sm">Logout</span>
              </Button>
            </nav>
          </div>
                )
              })}
              {/* Logout Button */}
              <Button
                variant="ghost"
                className={`w-full justify-start h-8 lg:h-10 text-sm transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
                onClick={onLogout}
              >
                <LogOut className="mr-2 lg:mr-3 h-3 lg:h-4 w-3 lg:w-4" />
                <span className="font-medium text-xs lg:text-sm">Logout</span>
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
                className={`w-full justify-start h-10 sm:h-12 text-sm sm:text-base transition-all duration-200 ${getBackgroundColor(
                  isActive,
                )} ${getTextColor(isActive)}`}
                onClick={() => onScreenChange(screen.id)}
              >
                <Icon
                  className={`mr-2 sm:mr-3 h-4 sm:h-5 w-4 sm:w-5 transition-colors duration-200 ${isActive ? (theme === "dark" ? "text-slate-100" : "text-slate-900") : screen.color
                    }`}
                />
                <span className="font-medium truncate">{screen.label}</span>
                {screen.badge && (
                  <Badge
                    className={`ml-auto transition-colors duration-200 text-xs ${isActive
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
      <div className="border-t border-slate-200 dark:border-slate-700 pt-3 sm:pt-4 mt-3 sm:mt-4">
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
                className={`w-full justify-start h-8 sm:h-10 text-sm transition-all duration-200 ${getBackgroundColor(
                  isActive,
                )} ${getTextColor(isActive)}`}
                onClick={() => onScreenChange(item.id)}
              >
                <Icon
                  className={`mr-2 sm:mr-3 h-3 sm:h-4 w-3 sm:w-4 transition-colors duration-200 ${isActive ? (theme === "dark" ? "text-slate-100" : "text-slate-900") : item.color
                    }`}
                />
                <span className="font-medium text-xs sm:text-sm truncate">{item.label}</span>
              </Button>
            )
          })}
          {/* Logout Button */}
          <Button
            variant="ghost"
            className={`w-full justify-start h-8 sm:h-10 text-sm transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
            onClick={onLogout}
          >
            <LogOut className="mr-2 sm:mr-3 h-3 sm:h-4 w-3 sm:w-4" />
            <span className="font-medium text-xs sm:text-sm">Logout</span>
          </Button>
        </nav>
      </div>
    </div>
  )
}
