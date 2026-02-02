export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}
