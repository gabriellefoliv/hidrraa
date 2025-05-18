import { api, createSession } from "@/lib/api";
import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import type { AxiosResponse } from "axios";

// Interface para o usuário conforme o formato da API
interface User {
  codUsuario: number;
  nome: string;
  email: string;
  perfil: string;
}

// Interface para a resposta da API de login
interface LoginResponse {
  token: string;
  usuario: User;
}

interface LoginData {
  email: string;
  senha: string;
}

interface AuthContextType {
  authenticated: boolean;
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Criação do contexto com tipagem
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Verificar se existe um token salvo ao iniciar a aplicação
  useEffect(() => {
    const storedToken = localStorage.getItem("@App:token");
    const storedUser = localStorage.getItem("@App:user");
    
    if (storedToken && storedUser) {
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    try {
      const response: AxiosResponse<LoginResponse> = await createSession(data.email, data.senha);
      
      const { token, usuario } = response.data;
      
      // Configurando o token no cabeçalho
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Salvando no localStorage para persistência
      localStorage.setItem("@App:token", token);
      localStorage.setItem("@App:user", JSON.stringify(usuario));
      
      setUser(usuario);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    // Removendo o token do cabeçalho
    delete api.defaults.headers.common["Authorization"];
    
    // Removendo dados do localStorage
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
    
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        authenticated: !!user,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
