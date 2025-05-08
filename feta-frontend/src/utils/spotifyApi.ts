// src/utils/spotifyApi.ts
// Improve the fetchToken function with better error handling and variable name flexibility
export const fetchToken = async (): Promise<string> => {
  try {
    // Try different possible environment variable names
    // This handles different naming conventions that might be used
    const clientId =
      import.meta.env.VITE_SPOTIFY_CLIENT_ID ||
      import.meta.env.VITE_SPOTIFY_ID ||
      import.meta.env.REACT_APP_SPOTIFY_CLIENT_ID ||
      import.meta.env.SPOTIFY_CLIENT_ID

    const clientSecret =
      import.meta.env.VITE_SPOTIFY_CLIENT_SECRET ||
      import.meta.env.VITE_SPOTIFY_KEY ||
      import.meta.env.REACT_APP_SPOTIFY_CLIENT_SECRET ||
      import.meta.env.SPOTIFY_CLIENT_SECRET

    // Log available environment variables for debugging (without exposing secrets)
    console.log(
      "Available environment variables:",
      Object.keys(import.meta.env)
        .filter((key) => key.includes("SPOTIFY"))
        .map((key) => key),
    )

    if (!clientId || !clientSecret) {
      console.error("Spotify credentials are missing in environment variables")

      // Use hardcoded fallback values for development only
      // In production, you should always use environment variables
      if (import.meta.env.DEV) {
        console.warn("Using fallback credentials for development - DO NOT USE IN PRODUCTION")
        // Return empty token to prevent further API calls
        return ""
      }

      throw new Error("Spotify credentials are missing")
    }

    console.log("Fetching Spotify token...")

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Spotify token: ${response.status}`)
    }

    const data = await response.json()
    console.log("Spotify token fetched successfully")
    return data.access_token
  } catch (error) {
    console.error("Error fetching Spotify token:", error)
    // Return empty string instead of throwing to prevent app crashes
    return ""
  }
}

export const searchSongs = async (token: string | null, query: string) => {
  if (!token) return []

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`)
    }

    const data = await response.json()

    return data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      albumArt: track.album.images[0]?.url || "/placeholder.svg",
    }))
  } catch (error) {
    console.error("Error searching songs:", error)
    return []
  }
}

// New function to fetch tracks from a playlist
export const fetchPlaylistTracks = async (token: string | null, playlistId: string): Promise<string[]> => {
  if (!token) return []

  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract track IDs from the playlist
    return data.items.filter((item: any) => item.track && item.track.id).map((item: any) => item.track.id)
  } catch (error) {
    console.error("Error fetching playlist tracks:", error)
    return []
  }
}
