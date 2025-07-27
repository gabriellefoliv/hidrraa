import { LoginForm } from "@/components/Auth/LoginForm"

export default function Login() {
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-center text-sky-900 mb-6">Login</h2>
                <LoginForm/>
            </div>
        </div>
    )
}