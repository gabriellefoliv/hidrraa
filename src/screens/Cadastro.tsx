import { CadastroForm } from "@/components/CadastroForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"



export default function Cadastro() {
    const [, setActiveTab] = useState('entExec')
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
            {/* <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Cadastro</h2> */}
            <Tabs defaultValue="entExec" onValueChange={setActiveTab}>
                <TabsList className="flex justify-around mb-4 -ml-5">
                    <TabsTrigger value="entExec" className="py-2 px-4 text-sky-900 border-b-2 border-transparent hover:border-blue-600">
                        Entidade Executora
                    </TabsTrigger>
                    <TabsTrigger value="investidor" className="py-2 px-4 text-sky-900 border-b-2 border-transparent hover:border-blue-600">
                        Investidor ESG
                    </TabsTrigger>
                    <TabsTrigger value="membroComite" className="py-2 px-4 text-sky-900 border-b-2 border-transparent hover:border-blue-600">
                        Membro Comitê
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="entExec">
                    <h3 className="text-lg font-medium text-center text-sky-900 mb-4">Cadastre-se como Entidade Executora</h3>
                    <CadastroForm perfil="entExec" />
                </TabsContent>
                <TabsContent value="investidor">
                    <h3 className="text-lg font-medium text-center text-sky-900 mb-4">Cadastre-se como Investidor ESG</h3>
                    <CadastroForm perfil="investidor" />
                </TabsContent>
                <TabsContent value="membroComite">
                    <h3 className="text-lg font-medium text-center text-sky-900 mb-4">Cadastre-se como Membro Comitê</h3>
                    <CadastroForm perfil="membroComite" />
                </TabsContent>
            </Tabs>
            </div>
        </div>
    )
}