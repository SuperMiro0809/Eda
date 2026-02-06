export interface User {
  id: string;
  first_name: string;
  family_name: string;
  full_name: string;
  email: string;
}

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, familyName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
