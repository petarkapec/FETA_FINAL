"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        email,
        password,
      })

      // Save token and DJ info in localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("dj", JSON.stringify(response.data.izvodjac))

      // Check if DJ has an active session
      const djId = response.data.izvodjac.dj_id
      const activeSessionResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sesije/active/${djId}`)

      if (activeSessionResponse.ok) {
        const sessionData = await activeSessionResponse.json()
        if (sessionData && sessionData.sesija_id) {
          // Redirect to SesijaPage with the active session ID
          navigate(`/sesijapage/${sessionData.sesija_id}`)
          return
        }
      }

      // If no active session, redirect to user_home for session creation
      navigate("/user_home")
    } catch (error) {
      console.error("Login failed", error)
      setError("Login failed. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-center border-b border-[#3A506B]">
        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#1C2541] p-8 rounded-xl shadow-lg border border-[#3A506B]">
            <h2 className="text-2xl font-bold text-[#6FFFE9] mb-6 text-center">DJ Login</h2>

            {error && (
              <div className="p-3 mb-4 bg-red-500/20 border border-red-500 rounded-md text-red-300">{error}</div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#5BC0BE]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0B132B] border-[#3A506B] text-white placeholder:text-[#3A506B] h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#5BC0BE]">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#0B132B] border-[#3A506B] text-white placeholder:text-[#3A506B] h-12"
                />
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium h-12 mt-4"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0B132B]"></div>
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#5BC0BE]">
                Not registered yet?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/registracija")}
                  className="text-[#6FFFE9] p-0 h-auto font-medium"
                >
                  Join FETA team
                </Button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
