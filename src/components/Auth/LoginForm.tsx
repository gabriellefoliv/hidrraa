import { AuthContext } from "@/context/auth"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"


export function LoginForm() {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
       
    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        console.log("Tentando fazer login com:", email, senha)

        const data = {
            email,
            senha
        }

        try {
            await login(data)
            navigate('/inicio')
    
        } catch (error) {
            console.error("Erro ao fazer login:", error)
            setError("Credenciais inválidas. Verifique seu email e senha.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4">
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            </div>
        )}
        
        <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
            </label>
            <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            />
        </div>

        <div className="mb-4">
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
            </label>
            <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            />
        </div>

        <div className="flex items-center justify-between mt-4">
            <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 ${
                isLoading ? "bg-gray-400" : "bg-sky-900 hover:bg-blue-700"
            } text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
            {isLoading ? "Entrando..." : "Entrar"}
            </button>
        </div>

        {/* <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
            Não possui conta?{" "}
            <a href="/cadastro" className="text-sky-900 hover:underline">
                Faça o cadastro aqui
            </a>
            </p>
        </div> */}
        </form>
    )
}