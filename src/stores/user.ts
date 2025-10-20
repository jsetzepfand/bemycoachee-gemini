import { defineStore } from 'pinia';

interface User {
  id: string;
  username: string;
  email: string;
  name?: string; // Last Name
  givenName?: string; // First Name
}

// This interface now matches the backend response
interface AuthResponse {
  idToken: string;
  refreshToken: string;
  accessToken: string;
}

// Helper function to decode JWT payload
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT", e);
    return null;
  }
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
            name: name,
            givenname: givenName
          }),
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

    async confirmUser(username: string, confirmationCode: string): Promise<boolean> {
      this.isLoading = true;
      this.authError = null;
      try {
        const response = await fetch(`${API_BASE_URL}/users/confirmUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, confirmationCode }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Confirmation failed');
        }

        this.isLoading = false;
        return true;
      } catch (error) {
        this.authError = error instanceof Error ? error.message : 'An unknown error occurred during confirmation';
        this.isLoading = false;
        return false;
      }
    },

    async resendConfirmationCode(username: string): Promise<boolean> {
      this.isLoading = true;
      this.authError = null;
      try {
        const response = await fetch(`${API_BASE_URL}/users/resend-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to resend code');
        }

        this.isLoading = false;
        return true;
      } catch (error) {
        this.authError = error instanceof Error ? error.message : 'An unknown error occurred while resending the code';
        this.isLoading = false;
        return false;
      }
    },

    async login(username: string, password: string): Promise<'SUCCESS' | 'UNCONFIRMED' | 'FAILED'> {
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
          if (errorData.message === 'User is not confirmed') {
            return 'UNCONFIRMED';
          }
          throw new Error(errorData.message || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        this.jwtToken = data.idToken; // Use idToken from the response

        const decodedToken = parseJwt(data.idToken);
        if (!decodedToken) {
          throw new Error('Invalid token received from server.');
        }

        this.user = { 
          id: decodedToken.sub, // 'sub' is the standard JWT claim for user ID
          username: decodedToken['cognito:username'] || decodedToken.username,
          email: decodedToken.email,
          name: decodedToken.name, // Map 'name' claim to last name
          givenName: decodedToken.given_name // Map 'given_name' claim to first name
        };

        if (!this.user.id || !this.user.username) {
          throw new Error('Token did not contain valid user information.');
        }

        this.isAuthenticated = true;
        localStorage.setItem('jwtToken', data.idToken); // Store the idToken
        localStorage.setItem('user', JSON.stringify(this.user));
        this.isLoading = false;
        return 'SUCCESS';
      } catch (error) {
        this.authError = error instanceof Error ? error.message : 'An unknown error occurred during login';
        this.isLoading = false;
        return 'FAILED';
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
          if (user && user.id && user.username) {
            this.jwtToken = token;
            this.user = user;
            this.isAuthenticated = true;
          }
        } catch (e) {
          console.error('Failed to parse user data from localStorage', e);
          this.logout();
        }
      }
    },
  },
});
