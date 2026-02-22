import { 
  mockUsers, 
  type User as MockUser 
} from "@/lib/mockData";

import { 
  AuthUser,
  SESSION_KEY,
  REMEMBER_KEY,
  SIGNUP_USERS_KEY,
} from "../types"

/**
 * AuthService - Handles authentication operations
 * 
 * Current: Uses localStorage/sessionStorage for mock auth
 * TODO (Phase 2): Replace with API calls to backend
 */
class AuthService {
  // ---------------------------------------------------------------------------
  // Private Helper Methods
  // ---------------------------------------------------------------------------

  /** Get the right storage based on whether "Remember Me" was checked */
  private getSessionStorage(): Storage {
    return localStorage.getItem(REMEMBER_KEY) === "true"
      ? localStorage
      : sessionStorage;
  }

  /** Get users registered through signup (stored in localStorage) */
  private getSignupUsers(): (MockUser & { email: string; password: string })[] {
    try {
      return JSON.parse(localStorage.getItem(SIGNUP_USERS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  /** Save signup users to localStorage */
  private saveSignupUsers(users: (MockUser & { email: string; password: string })[]): void {
    localStorage.setItem(SIGNUP_USERS_KEY, JSON.stringify(users));
  }

  /** Save user session to appropriate storage */
  private saveSession(user: AuthUser): void {
    this.getSessionStorage().setItem(SESSION_KEY, JSON.stringify(user));
  }

  /** Clear all session data */
  private clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }

  /** Convert MockUser to AuthUser */
  private toAuthUser(user: MockUser): AuthUser {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      joinedAt: user.joinedAt,
    };
  }

  // ---------------------------------------------------------------------------
  // Public API Methods
  // ---------------------------------------------------------------------------

  /**
   * Login with username/email + password.
   *
   * For mock users: password is their username (e.g. "tiamlee" / "tiamlee").
   * For signup users: password is whatever they registered with.
   *
   * TODO (Phase 2): Replace with POST /api/auth/login
   */
  login(
    usernameOrEmail: string,
    password: string,
    remember: boolean = false
  ): AuthUser | null {
    const input = usernameOrEmail.toLowerCase().trim();

    // 1. Check mock users — password is their username, allow login by username or email
    const mockUser = Object.values(mockUsers).find(
      (u) =>
        (u.username.toLowerCase() === input ||
          (u.email && u.email.toLowerCase() === input)) &&
        password === u.username // password for mock users is always their username
    );

    if (mockUser) {
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      const authUser = this.toAuthUser(mockUser);
      this.saveSession(authUser);
      return authUser;
    }

    // 2. Check signup users (registered through the signup form)
    const signupUsers = this.getSignupUsers();
    const signupUser = signupUsers.find(
      (u) =>
        (u.username.toLowerCase() === input ||
          (u.email && u.email.toLowerCase() === input)) &&
        u.password === password
    );

    if (signupUser) {
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, "true");
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      const authUser = this.toAuthUser(signupUser);
      this.saveSession(authUser);
      return authUser;
    }

    return null;
  }

  /**
   * Register a new account.
   * @returns AuthUser on success, null if username/email taken.
   *
   * TODO (Phase 2): Replace with POST /api/auth/register
   */
  signup(
    email: string,
    username: string,
    password: string
  ): AuthUser | null {
    // Check against mock users
    const mockTaken = Object.values(mockUsers).some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    if (mockTaken) return null;

    // Check against existing signups
    const signupUsers = this.getSignupUsers();
    const signupTaken = signupUsers.some(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() ||
        (u.email && u.email.toLowerCase() === email.toLowerCase())
    );
    if (signupTaken) return null;

    const newUser = {
      id: `user_${Date.now()}`,
      name: username,
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: "",
      location: "",
      joinedAt: new Date().toISOString().split("T")[0],
      email,
      password,
    };

    this.saveSignupUsers([...signupUsers, newUser]);

    // Auto-login after signup (session only, no remember)
    const authUser = this.toAuthUser(newUser);
    this.saveSession(authUser);
    return authUser;
  }

  /**
   * Get the currently logged-in user, if any.
   * Checks sessionStorage first, then localStorage (for remembered sessions).
   *
   * TODO (Phase 2): Replace with GET /api/auth/me
   */
  getCurrentUser(): AuthUser | null {
    try {
      // If Remember Me is set, prefer localStorage, else sessionStorage
      const remember = localStorage.getItem(REMEMBER_KEY) === "true";
      let session: string | null = null;
      if (remember) {
        session = localStorage.getItem(SESSION_KEY);
      } else {
        session = sessionStorage.getItem(SESSION_KEY);
      }
      if (!session) return null;
      return JSON.parse(session) as AuthUser;
    } catch {
      return null;
    }
  }

  /**
   * Log out the current user.
   *
   * TODO (Phase 2): Replace with POST /api/auth/logout
   */
  logout(): void {
    this.clearSession();
  }

  /**
   * Check if someone is currently authenticated.
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

// Export singleton instance
export const authService = new AuthService()

// Also export individual methods for backwards compatibility
// (Remove these later if you want to force using authService.method())
export const login = authService.login.bind(authService)
export const signup = authService.signup.bind(authService)
export const getCurrentUser = authService.getCurrentUser.bind(authService)
export const logout = authService.logout.bind(authService)
export const isAuthenticated = authService.isAuthenticated.bind(authService)
