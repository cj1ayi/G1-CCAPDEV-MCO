export interface AuthUser {
  id: string;
  name: string;
  username: string;
  avatar: any;
  bio?: string;
  location?: string;
  joinedAt?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    usernameOrEmail: string, 
    password: string, 
    remember?: boolean
  ) => boolean;
  signup: (
    email: string, 
    username: string, 
    password: string) => boolean;
  logout: () => void;
}

export const SESSION_KEY = "animoforums_session";
export const REMEMBER_KEY = "animoforums_remember";
export const SIGNUP_USERS_KEY = "animoforums_signups"; 


