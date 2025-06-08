interface CadastroFormProps {
    perfil: string;
}

export function CadastroForm({ perfil }: CadastroFormProps) {
    let camposAdicionais = null

    switch (perfil) {
        case 'entExec':
            camposAdicionais = (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Nome da Entidade Executora</label>
                        <input type="text" name="nomeEntExec" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">CNPJ ou CPF</label>
                        <input type="text" name="cnpjcpf" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Especialidade</label>
                        <input type="text" name="especialidade" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Contato</label>
                        <input type="text" name="contato" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                </>
            );
            break;
        case 'investidor': 
            camposAdicionais = (
                <>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Razão Social</label>
                        <input type="text" name="cpf" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                        <input type="number" name="renda" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Contato</label>
                        <input type="number" name="renda" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
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
    }

    return (
        <form>
            {camposAdicionais}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input type="password" name="senha" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>


            <div className="flex items-center justify-between mt-4">
                <button type="submit" className="w-full py-2 px-4 bg-sky-900 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Cadastrar
                </button>
            </div>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">Já possui conta? <a href="/" className="text-blue-600 hover:underline">Entre aqui</a></p>
            </div>
        </form>
    )
}