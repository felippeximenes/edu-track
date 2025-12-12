import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { api } from "../api/axios";


interface User {
  id: number;
  name: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário salvo no localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  // Função de login real usando sua API
  async function login(email: string, password: string) {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;

      // Salvar localmente
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Configurar axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      return true;
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
