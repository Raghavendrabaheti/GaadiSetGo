"use client"

import { Car } from "lucide-react"

interface LoadingScreenProps {
  theme: string
}

export default function LoadingScreen({ theme }: LoadingScreenProps) {
  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-500 ${theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
        }`}
    >
      <div className="text-center">
        <div className="relative mb-8">
          <div
            className={`p-4 rounded-full animate-pulse transition-all duration-300 ${theme === "dark"
                ? "bg-gradient-to-br from-blue-400 to-purple-400"
                : "bg-gradient-to-br from-blue-600 to-purple-600"
              }`}
          >
            <Car className="h-12 w-12 text-white" />
          </div>
          <div
            className={`absolute inset-0 rounded-full border-4 animate-ping transition-all duration-300 ${theme === "dark" ? "border-blue-400/20" : "border-blue-600/20"
              }`}
          />
        </div>
        <h2
          className={`text-2xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${theme === "dark" ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"
            }`}
        >
          GaadiSetGo
        </h2>
        <p className={`transition-colors duration-300 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
          Loading your experience...
        </p>
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-1">
            {[0, 150, 300].map((delay, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full animate-bounce transition-all duration-300 ${theme === "dark" ? "bg-blue-400" : "bg-blue-600"
                  }`}
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
