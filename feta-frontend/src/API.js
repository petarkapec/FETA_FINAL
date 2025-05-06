import axios from 'axios';

class API {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  
  }

  // Metode za slanje zahtjeva
  async get(endpoint) {
    try {
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('GET request failed', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await this.api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('POST request failed', error);
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await this.api.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('PUT request failed', error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await this.api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('DELETE request failed', error);
      throw error;
    }
  }
}

// Eksportirajte instancu API klase
export const api = new API(import.meta.env.VITE_BACKEND_URL); // Dodajte osnovni URL backend servera
