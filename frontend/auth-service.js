/**
 * FINN AUTHENTICATION SERVICE
 * User authentication, session management, and security
 */

import apiClient from './api-client';

class AuthenticationService {
  constructor() {
    this.user = null;
    this.isAuthenticated = false;
    this.sessionToken = null;
    this.listeners = [];
  }

  /**
   * Subscribe to auth changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify listeners of auth changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getAuthState()));
  }

  /**
   * Get current auth state
   */
  getAuthState() {
    return {
      isAuthenticated: this.isAuthenticated,
      user: this.user,
      token: this.sessionToken
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Store user and token
      this.user = data.user;
      this.sessionToken = data.token;
      this.isAuthenticated = true;

      // Set API client token
      apiClient.setToken(data.token);

      // Store in localStorage
      localStorage.setItem('finn_user', JSON.stringify(data.user));
      localStorage.setItem('finn_token', data.token);

      this.notifyListeners();
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign up new user
   */
  async signup(email, password, name) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();

      // Auto-login after signup
      this.user = data.user;
      this.sessionToken = data.token;
      this.isAuthenticated = true;

      apiClient.setToken(data.token);

      localStorage.setItem('finn_user', JSON.stringify(data.user));
      localStorage.setItem('finn_token', data.token);

      this.notifyListeners();
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout endpoint to invalidate token
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear local data
    this.user = null;
    this.sessionToken = null;
    this.isAuthenticated = false;

    apiClient.clearAuth();

    localStorage.removeItem('finn_user');
    localStorage.removeItem('finn_token');

    this.notifyListeners();
  }

  /**
   * Check if session is valid
   */
  async validateSession() {
    try {
      // Try to get user profile with current token
      const response = await fetch('http://localhost:3000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${this.sessionToken}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        this.user = user;
        this.isAuthenticated = true;
        this.notifyListeners();
        return true;
      } else {
        this.isAuthenticated = false;
        this.notifyListeners();
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      this.isAuthenticated = false;
      this.notifyListeners();
      return false;
    }
  }

  /**
   * Restore session from localStorage
   */
  restoreSession() {
    try {
      const user = localStorage.getItem('finn_user');
      const token = localStorage.getItem('finn_token');

      if (user && token) {
        this.user = JSON.parse(user);
        this.sessionToken = token;
        this.isAuthenticated = true;

        apiClient.setToken(token);

        // Validate the session
        this.validateSession();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Session restore error:', error);
      return false;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.sessionToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.sessionToken = data.token;

        apiClient.setToken(data.token);
        localStorage.setItem('finn_token', data.token);

        return true;
      } else {
        // Token refresh failed, logout
        await this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(
        'http://localhost:3000/api/user/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.sessionToken}`
          },
          body: JSON.stringify({ currentPassword, newPassword })
        }
      );

      if (response.ok) {
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/request-reset',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }
      );

      if (response.ok) {
        return { success: true };
      } else {
        throw new Error('Reset request failed');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/reset-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword })
        }
      );

      if (response.ok) {
        return { success: true };
      } else {
        throw new Error('Reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user
   */
  getUser() {
    return this.user;
  }

  /**
   * Get current token
   */
  getToken() {
    return this.sessionToken;
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn() {
    return this.isAuthenticated;
  }

  /**
   * Has specific permission
   */
  hasPermission(permission) {
    if (!this.user || !this.user.permissions) {
      return false;
    }
    return this.user.permissions.includes(permission);
  }

  /**
   * Has specific role
   */
  hasRole(role) {
    if (!this.user) {
      return false;
    }
    return this.user.role === role;
  }
}

// Export singleton instance
const authService = new AuthenticationService();

export default authService;
