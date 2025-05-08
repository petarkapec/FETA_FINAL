import io from "socket.io-client"

// Get the WebSocket server URL from environment variables or use a default
const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"

// Create a singleton socket instance to be reused across components
const socket = io(SOCKET_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  transports: ["websocket", "polling"],
})

// Log connection status for debugging
socket.on("connect", () => {
  console.log("Socket connected:", socket.id)
})

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason)
})

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error)
})

export default socket
