"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, LogOut, Save, Pencil, Music } from "lucide-react"
import type { DJ } from "@/types/dj"

const Profil = () => {
  const [dj, setDj] = useState<DJ | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  // State for editable fields
  const [editableFields, setEditableFields] = useState<Record<string, boolean>>({})
  const [formData, setFormData] = useState<Partial<DJ>>({})

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }

    const fetchDjData = async () => {
      try {
        setLoading(true)
        const djData = localStorage.getItem("dj")
        if (djData) {
          const parsedDj = JSON.parse(djData)

          // Fetch the latest DJ data from the server
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/izvodjaci/${parsedDj.dj_id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch DJ data")
          }

          const latestDjData = await response.json()
          setDj(latestDjData)
          setFormData(latestDjData)
        }
      } catch (error) {
        console.error("Error fetching DJ data:", error)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchDjData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("dj")
    navigate("/login")
  }

  const toggleEdit = (field: string) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const saveField = async (field: string) => {
    if (!dj) return

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const updateData = {
        [field]: formData[field as keyof DJ],
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/izvodjaci/${dj.dj_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error(`Failed to update ${field}`)
      }

      // Update the DJ data in state and localStorage
      const updatedDj = { ...dj, ...updateData }
      setDj(updatedDj)
      localStorage.setItem("dj", JSON.stringify(updatedDj))

      // Close edit mode
      toggleEdit(field)
      setSuccessMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
      setError(`Failed to update ${field}. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  const renderEditableField = (label: string, field: keyof DJ, type = "text", placeholder = "") => {
    const isEditing = editableFields[field] || false
    const value = formData[field] || ""

    return (
      <div className="mb-4 p-4 bg-[#0B132B] rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <label className="text-[#5BC0BE] text-sm font-medium">{label}</label>
          {!isEditing ? (
            <Button
              onClick={() => toggleEdit(field)}
              variant="ghost"
              size="sm"
              className="text-[#5BC0BE] hover:text-[#6FFFE9] hover:bg-[#1C2541]"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => saveField(field)}
              variant="ghost"
              size="sm"
              className="text-green-500 hover:text-green-400 hover:bg-[#1C2541]"
              disabled={saving}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {type === "textarea" ? (
          <Textarea
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={!isEditing}
            placeholder={placeholder}
            className={`w-full bg-[#1C2541] border-[#3A506B] text-white ${!isEditing ? "opacity-80" : ""}`}
            rows={4}
          />
        ) : type === "date" ? (
          <Input
            type="date"
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={!isEditing}
            className={`w-full bg-[#1C2541] border-[#3A506B] text-white ${!isEditing ? "opacity-80" : ""}`}
          />
        ) : (
          <Input
            type={type}
            value={value as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            disabled={!isEditing}
            placeholder={placeholder}
            className={`w-full bg-[#1C2541] border-[#3A506B] text-white ${!isEditing ? "opacity-80" : ""}`}
          />
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0B132B]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5BC0BE]"></div>
      </div>
    )
  }

  if (!dj) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
        <div className="flex justify-center items-center h-64">
          <div className="p-6 bg-[#1C2541] rounded-lg border border-[#3A506B] max-w-md text-center">
            <p className="text-red-400 mb-4">{error || "Profile data not found"}</p>
            <Button onClick={() => navigate("/login")} className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B]">
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B132B] text-white p-4">
      <header className="p-4 flex justify-between items-center border-b border-[#3A506B]">
        <Button
          onClick={() => navigate("/user_home")}
          className="bg-[#3A506B] hover:bg-[#5BC0BE] text-white flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h1 className="text-4xl font-bold text-[#6FFFE9]">FETA</h1>

        <Button
          onClick={handleLogout}
          className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center py-8">
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-[#6FFFE9] mb-6">DJ Profile</h2>

          {error && <div className="p-3 mb-4 bg-red-500/20 border border-red-500 rounded-md text-red-300">{error}</div>}

          {successMessage && (
            <div className="p-3 mb-4 bg-green-500/20 border border-green-500 rounded-md text-green-300">
              {successMessage}
            </div>
          )}

          <div className="bg-[#1C2541] p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={dj.profilna_slika || "/placeholder.svg?height=100&width=100"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#5BC0BE]"
              />
              <div>
                <p className="text-2xl font-bold text-white">
                  {dj.ime} {dj.prezime}
                </p>
                <p className="text-sm text-[#5BC0BE]">{dj.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1C2541] p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-bold text-[#6FFFE9] mb-4">Personal Information</h3>

            {renderEditableField("First Name", "ime")}
            {renderEditableField("Last Name", "prezime")}
            {renderEditableField("Email", "email", "email")}
            {renderEditableField("Date of Birth", "datum_rodjenja", "date")}
            {renderEditableField("Address", "adresa")}
            {renderEditableField("OIB", "oib")}
            {renderEditableField("IBAN", "iban")}
          </div>

          <div className="bg-[#1C2541] p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-bold text-[#6FFFE9] mb-4">Social & Bio</h3>

            {renderEditableField("Instagram", "instagram", "text", "@username")}
            {renderEditableField("About Me", "about_me", "textarea", "Tell us about yourself...")}
            {renderEditableField("Profile Picture URL", "profilna_slika", "url", "https://example.com/image.jpg")}
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={() => navigate("/moje-sesije")}
              className="bg-[#5BC0BE] hover:bg-[#6FFFE9] text-[#0B132B] font-medium flex items-center gap-2 px-6 py-3"
            >
              <Music className="h-5 w-5" />
              My Events
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profil
