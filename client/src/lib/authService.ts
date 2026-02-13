import { mockUsers, type User as MockUser } from "@/lib/mockData";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  avatar: any;
  bio?: string;
  location?: string;
  joinedAt?: string;
}

// ---------------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------------
const SESSION_KEY = "animoforums_session";
const REMEMBER_KEY = "animoforums_remember";
const SIGNUP_USERS_KEY = "animoforums_signups"; 

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the right storage based on whether "Remember Me" was checked */
function getSessionStorage(): Storage {
  return localStorage.getItem(REMEMBER_KEY) === "true"
    ? localStorage
    : sessionStorage;
}

/** Get users registered through signup (stored in localStorage) */
function getSignupUsers(): (MockUser & { email: string; password: string })[] {
  try {
    return JSON.parse(localStorage.getItem(SIGNUP_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSignupUsers(users: (MockUser & { email: string; password: string })[]): void {
  localStorage.setItem(SIGNUP_USERS_KEY, JSON.stringify(users));
}

function saveSession(user: AuthUser): void {
  getSessionStorage().setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

function toAuthUser(user: MockUser): AuthUser {
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
// Public API
// ---------------------------------------------------------------------------

/**
 * Login with username + password.
 *
 * For mock users: password is their username (e.g. "tiamlee" / "tiamlee").
 * For signup users: password is whatever they registered with.
 *
 * TODO (Phase 2): Replace with POST /api/auth/login
 */
export function login(
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
    const authUser = toAuthUser(mockUser);
    saveSession(authUser);
    return authUser;
  }

  // 2. Check signup users (registered through the signup form)
  const signupUsers = getSignupUsers();
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
    const authUser = toAuthUser(signupUser);
    saveSession(authUser);
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
export function signup(
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
  const signupUsers = getSignupUsers();
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

  saveSignupUsers([...signupUsers, newUser]);

  // Auto-login after signup (session only, no remember)
  const authUser = toAuthUser(newUser);
  saveSession(authUser);
  return authUser;
}

/**
 * Get the currently logged-in user, if any.
 * Checks sessionStorage first, then localStorage (for remembered sessions).
 *
 * TODO (Phase 2): Replace with GET /api/auth/me
 */
export function getCurrentUser(): AuthUser | null {
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
export function logout(): void {
  clearSession();
}

/**
 * Check if someone is currently authenticated.
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}