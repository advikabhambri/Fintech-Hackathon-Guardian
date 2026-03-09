import { create } from 'zustand'
import api from '../lib/api'

interface User {
  id: number
  email: string
  username: string
  full_name?: string
  is_active: boolean
  is_verified: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string, full_name?: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    set({ token: access_token, isAuthenticated: true })
    
    // Fetch user data
    const userResponse = await api.get('/api/auth/me')
    set({ user: userResponse.data })
  },

  register: async (email, username, password, full_name) => {
    await api.post('/api/auth/register', { email, username, password, full_name })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      const response = await api.get('/api/auth/me')
      set({ user: response.data })
    } catch (error) {
      console.error('Failed to fetch user:', error)
      set({ user: null, token: null, isAuthenticated: false })
    }
  },
}))
