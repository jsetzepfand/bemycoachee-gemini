import { defineStore } from 'pinia';

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  givenName?: string;
}

interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  email: string;
  name?: string;
  givenName?: string;
}

const API_BASE_URL = 'https://g6ewdsfzsz.eu-central-1.awsapprunner.com'; // Your backend API base URL

export const useUserStore = defineStore('user', {
  state: () => ({
    isAuthenticated: false,
    user: null as User | null,
    jwtToken: null as string | null,
    authError: null as string | null,
    isLoading: false,
  }),

  actions: {
    async register(username: string, email: string, password: string, name?: string, givenName?: string): Promise<boolean> {
      this.isLoading = true;
      this.authError = null;
      try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username,
            email,
            password,
            name: name, // Maps to "gross"
            givenname: givenName // Maps to "benno"
          }), // Use flat structure as confirmed
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        this.isLoading = false;
        return true;
      } catch (error) {
        this.authError = error instanceof Error ? error.message : 'An unknown error occurred during registration';
        this.isLoading = false;
        return false;
      }
    },

    async login(username: string, password: string): Promise<boolean> {
      this.isLoading = true;
      this.authError = null;
      try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        this.jwtToken = data.token;
        this.user = { 
          id: data.userId, 
          username: data.username, 
          email: data.email,
          name: data.name,
          givenName: data.givenName
        };
        this.isAuthenticated = true;
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.isLoading = false;
        return true;
      } catch (error) {
        this.authError = error instanceof Error ? error.message : 'An unknown error occurred during login';
        this.isLoading = false;
        return false;
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.jwtToken = null;
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
    },

    initializeAuth() {
      const token = localStorage.getItem('jwtToken');
      const userJson = localStorage.getItem('user');

      if (token && userJson) {
        try {
          const user: User = JSON.parse(userJson);
          this.jwtToken = token;
          this.user = user;
          this.isAuthenticated = true;
        } catch (e) {
          console.error('Failed to parse user data from localStorage', e);
          this.logout(); // Clear potentially corrupted data
        }
      }
    },
  },
});
