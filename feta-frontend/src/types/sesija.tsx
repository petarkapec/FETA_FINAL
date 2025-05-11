export type Sesija = {
  sesija_id: number
  dj_id: number
  lokacija_id: number
  expiration: string
  minimal_price: number
  comentary: string
  queue_max_song_count: number
  naziv: string
  status: "active" | "expired" // Added status field
  list_link: string // Added list_link field
  list_bool: boolean // Added list_bool field
  // Dodana polja za lokaciju
  location_name?: string; // Opcionalno polje za ime kluba
  location_address?: string; // Opcionalno polje za adresu
}
