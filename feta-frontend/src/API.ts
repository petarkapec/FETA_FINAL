import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"

class API {
  private api: AxiosInstance

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token")
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )
  }

  async get<T = any>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(endpoint)
      return response.data
    } catch (error) {
      console.error("GET request failed", error)
      throw error
    }
  }

  async post<T = any>(endpoint: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(endpoint, data)
      return response.data
    } catch (error) {
      console.error("POST request failed", error)
      throw error
    }
  }

  async put<T = any>(endpoint: string, data: any): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(endpoint, data)
      return response.data
    } catch (error) {
      console.error("PUT request failed", error)
      throw error
    }
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(endpoint)
      return response.data
    } catch (error) {
      console.error("DELETE request failed", error)
      throw error
    }
  }
}

export const api = new API(import.meta.env.VITE_BACKEND_URL as string)
