import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            
            login: (token) => {
                set({ token, user: null })
            },

            logout: async (client) => {
                set({ token: null, user: null })
                if (client) {
                    await client.resetStore()
                }
            },

            setUser: (user) => set({ user }),

            updateUser: (updates) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null
                }))
            },

            clearUser: () => set({ token: null, user: null })
        }),
        {
            name: 'libraryUser'
        }
    )
)

export default useUserStore

export const useUser = () => useUserStore((state) => state.user)
export const useToken = () => useUserStore((state) => state.token)

// Expose individual actions directly to prevent destructuring confusion
export const useLogin = () => useUserStore((state) => state.login)
export const useLogout = () => useUserStore((state) => state.logout)