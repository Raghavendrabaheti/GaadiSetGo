"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Palette, Monitor, Sun, Moon, Smartphone, Tablet, Laptop } from "lucide-react"

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
  theme: string
  onThemeChange: (theme: string) => void
}

export default function ThemeCustomizer({ isOpen, onClose, theme, onThemeChange }: ThemeCustomizerProps) {
  const colorPalettes = {
    light: {
      primary: "#3B82F6", // Blue-500
      secondary: "#10B981", // Emerald-500
      accent: "#F59E0B", // Amber-500
      background: "#F8FAFC", // Slate-50
      surface: "#FFFFFF", // White
      text: "#0F172A", // Slate-900
      textMuted: "#64748B", // Slate-500
      border: "#E2E8F0", // Slate-200
      success: "#10B981", // Emerald-500
      warning: "#F59E0B", // Amber-500
      error: "#EF4444", // Red-500
    },
    dark: {
      primary: "#60A5FA", // Blue-400
      secondary: "#34D399", // Emerald-400
      accent: "#FBBF24", // Amber-400
      background: "#0F172A", // Slate-900
      surface: "#1E293B", // Slate-800
      text: "#F1F5F9", // Slate-100
      textMuted: "#CBD5E1", // Slate-300
      border: "#334155", // Slate-700
      success: "#34D399", // Emerald-400
      warning: "#FBBF24", // Amber-400
      error: "#F87171", // Red-400
    },
  }

  const deviceSizes = [
    { name: "Mobile", icon: Smartphone, width: "375px", height: "667px" },
    { name: "Tablet", icon: Tablet, width: "768px", height: "1024px" },
    { name: "Laptop", icon: Laptop, width: "1440px", height: "900px" },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`fixed inset-0 transition-opacity duration-300 ${
          theme === "dark" ? "bg-slate-900/80" : "bg-slate-900/50"
        }`}
        onClick={onClose}
      />
      <Card
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center text-xl">
              <Palette className="mr-2 h-5 w-5" />
              Theme Customizer
            </CardTitle>
            <CardDescription className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
              Customize the appearance and test responsive layouts
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`h-8 w-8 rounded-full ${
              theme === "dark"
                ? "hover:bg-slate-700 text-slate-400 hover:text-slate-100"
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Theme Mode</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => onThemeChange("light")}
                className="flex flex-col h-20 space-y-2"
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs">Light</span>
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => onThemeChange("dark")}
                className="flex flex-col h-20 space-y-2"
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs">Dark</span>
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => onThemeChange("system")}
                className="flex flex-col h-20 space-y-2"
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs">System</span>
              </Button>
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Color Palette</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colorPalettes[theme as keyof typeof colorPalettes]).map(([name, color]) => (
                <div key={name} className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="font-medium capitalize text-sm">{name.replace(/([A-Z])/g, " $1")}</p>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>{color}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Samples */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Typography</h3>
            <div className="space-y-4 p-4 rounded-lg border">
              <div>
                <h1 className="text-3xl font-bold mb-2">Heading 1 - Main Title</h1>
                <h2 className="text-2xl font-semibold mb-2">Heading 2 - Section Title</h2>
                <h3 className="text-xl font-medium mb-2">Heading 3 - Subsection</h3>
                <p className="text-base mb-2">
                  Body text - This is regular paragraph text that should be easily readable in both light and dark
                  modes.
                </p>
                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  Muted text - Secondary information and descriptions.
                </p>
              </div>
            </div>
          </div>

          {/* Responsive Preview */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Responsive Breakpoints</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deviceSizes.map((device) => {
                const Icon = device.icon
                return (
                  <div
                    key={device.name}
                    className={`p-4 rounded-lg border text-center transition-all duration-300 ${
                      theme === "dark"
                        ? "border-slate-700 hover:border-slate-600 bg-slate-700/30"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50"
                    }`}
                  >
                    <Icon className="h-8 w-8 mx-auto mb-2" />
                    <h4 className="font-medium">{device.name}</h4>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                      {device.width} × {device.height}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Accessibility Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <Badge variant="secondary" className="justify-center p-2">
                WCAG 2.1 AA Compliant
              </Badge>
              <Badge variant="secondary" className="justify-center p-2">
                High Contrast Support
              </Badge>
              <Badge variant="secondary" className="justify-center p-2">
                Keyboard Navigation
              </Badge>
              <Badge variant="secondary" className="justify-center p-2">
                Screen Reader Friendly
              </Badge>
            </div>
          </div>

          {/* Component Examples */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Component Examples</h3>
            <div className="space-y-4">
              {/* Buttons */}
              <div className="space-y-2">
                <h4 className="font-medium">Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                <h4 className="font-medium">Cards</h4>
                <Card className="p-4">
                  <h5 className="font-medium mb-2">Sample Card</h5>
                  <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    This is how cards appear in the current theme with proper contrast and readability.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
