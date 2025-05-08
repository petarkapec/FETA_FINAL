"use client"

import { useState } from "react"
import { api } from "../API.js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const NicknameForm = () => {
  const [nickname, setNickname] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/login", { nickname })
      // Save token in localStorage
      localStorage.setItem("tokenuser", response.token)
      localStorage.setItem("nickname", response.nickname) // optional, save nickname if needed
      localStorage.setItem("user_id", response.user_id)
      // Redirect to /homesearch after successful login
      window.location.href = "/locations"
      console.log(localStorage.getItem("user_id"))
    } catch (err) {
      setError("Error entering nickname. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B132B] p-4">
      <Card className="w-full max-w-md bg-[#1C2541] border-[#3A506B] text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#6FFFE9]">Enter Your Nickname</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-[#5BC0BE]">Enter the nickname you want your DJ to see!</p>
              <Input
                type="text"
                placeholder="Enter your nickname..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-[#0B132B] border-[#3A506B] text-white h-12"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium h-12"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                "Confirm"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NicknameForm
