// src/utils/spotifyApi.ts
export const fetchToken = async (): Promise<string> => {
    const clientId = import.meta.env.VITE_SPOTIFY_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_KEY;
  
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    });
  
    const data = await response.json();
    return data.access_token;
  };
  
  export const searchSongs = async (token: string | null, query: string) => {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    const data = await response.json();
  
    return data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      albumArt: track.album.images[0]?.url || "/placeholder.svg",
    }));
  };
  