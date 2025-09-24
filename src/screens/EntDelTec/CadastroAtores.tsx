import { CadastroForm } from "@/components/Auth/CadastroForm";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function CadastroAtores() {
    const [, setActiveTab] = useState('entExec')
    return (
        <div className="w-full mx-auto p-6">
           <Header 
                title="Cadastro de Atores"
                description="Realize o cadastro de entidade executora e de entidade gerenciadora."
           />
            <Tabs defaultValue="entExec" onValueChange={setActiveTab}>
                <TabsList className="w-full flex justify-center mb-4">
                    <TabsTrigger value="entExec" className="py-2 px-4 text-sky-900 border-b-2 border-transparent hover:border-blue-600">
                        Entidade Executora
                    </TabsTrigger>
                    <TabsTrigger value="entGer" className="py-2 px-4 text-sky-900 border-b-2 border-transparent hover:border-blue-600">
                        Entidade Gerenciadora
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="entExec">
                    <h3 className="text-lg font-medium text-center text-sky-900 mb-4">Cadastre-se como Entidade Executora</h3>
                    <CadastroForm perfil="entExec" />
                </TabsContent>
                <TabsContent value="entGer">
                    <h3 className="text-lg font-medium text-center text-sky-900 mb-4">Cadastre-se como Entidade Gerenciadora</h3>
                    <CadastroForm perfil="entGer" />
                </TabsContent>
            </Tabs>
        </div>
    )
}