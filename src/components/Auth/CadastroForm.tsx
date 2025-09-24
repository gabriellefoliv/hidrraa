import { useAuth } from "@/context/auth";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface CadastroFormProps {
    perfil: string;
}

export function CadastroForm({ perfil }: CadastroFormProps) {
    const { user } = useAuth()
    const codCBH = user?.codCBH

    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        nomeEntExec: '',
        nomeEntGer: '',
        cnpjcpf: '',
        especialidade: '',
        contato: '',
        razaoSocial: '',
        cnpj: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        let endpoint = '';
        let payload = {}; 

        switch (perfil) {
            case 'entExec':
                endpoint = '/entExec/cadastro';
                payload = {
                    nome: formData.nomeEntExec,
                    email: formData.email,
                    senha: formData.senha,
                    codCBH: codCBH,
                    cnpjcpf: formData.cnpjcpf,
                    contato: formData.contato,
                    especialidade: formData.especialidade,
                };
                break;
            case 'investidor':
                endpoint = '/investidor/cadastro';
                payload = {
                    email: formData.email,
                    senha: formData.senha,
                    razaoSocial: formData.razaoSocial,
                    cnpj: formData.cnpj,
                    codCBH: codCBH
                };
                break;
            case 'entGer':
                endpoint = '/entGer/cadastro';
                payload = {
                    email: formData.email,
                    senha: formData.senha,
                    codCBH: codCBH,
                    nome: formData.nomeEntGer,
                    cnpjcpf: formData.cnpjcpf,
                    contato: formData.contato,
                };
                break;
            default:
                console.error("Perfil de usuário inválido!");
                return; 
        }

        try {
            console.log("Enviando para:", endpoint);
            console.log("Payload:", payload);

            const response = await api.post(endpoint, payload);

            const result = await response.data();
            toast.success('Cadastro realizado com sucesso!', result);

        } catch (error) {
            console.error('Erro no cadastro:', error);
        }
    };

    let camposAdicionais = null;

    switch (perfil) {
        case 'entExec':
            camposAdicionais = (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nome da Entidade Executora</label>
                        <input value={formData.nomeEntExec} onChange={handleChange} type="text" name="nomeEntExec" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">CNPJ ou CPF</label>
                        <input value={formData.cnpjcpf} onChange={handleChange} type="text" name="cnpjcpf" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Especialidade</label>
                        <input value={formData.especialidade} onChange={handleChange} type="text" name="especialidade" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Contato</label>
                        <input value={formData.contato} onChange={handleChange} type="text" name="contato" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </>
            );
            break;
        case 'investidor': 
            camposAdicionais = (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Razão Social</label>
                        <input value={formData.razaoSocial} onChange={handleChange} type="text" name="razaoSocial" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                        <input value={formData.cnpj} onChange={handleChange} type="number" name="cnpj" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Contato</label>
                        <input value={formData.contato} onChange={handleChange} type="number" name="contato" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </>
            );
            break;
        case 'membroComite':
            camposAdicionais = (
                <>
                
                </>
            );
            break;
        case 'entGer':
            camposAdicionais = (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nome da Entidade Gerenciadora</label>
                        <input value={formData.nomeEntGer} onChange={handleChange} type="text" name="nomeEntGer" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">CNPJ ou CPF</label>
                        <input value={formData.cnpjcpf} onChange={handleChange} type="text" name="cnpjcpf" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Contato</label>
                        <input value={formData.contato} onChange={handleChange} type="text" name="contato" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </>
            );
            break;
    }

    return (
        <form onSubmit={handleSubmit}>
            {camposAdicionais}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input value={formData.email} onChange={handleChange} type="email" name="email" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input value={formData.senha} onChange={handleChange} type="password" name="senha" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>


            <div className="flex items-center justify-between mt-4">
                <button type="submit" className="w-full py-2 px-4 bg-sky-900 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Cadastrar
                </button>
            </div>
        </form>
    )
}