import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Entidade {
    codEntExec: number;
    codEntGer: number;
    nome: string;
}

interface DesignarEntidadeModalProps {
    isOpen: boolean;
    onClose: () => void;
    codProjeto: number;
    onConfirm: (codProjeto: number, codEntExec: number, codEntGer: number) => Promise<void>;
}

export function DesignarEntidadeModal({ isOpen, onClose, codProjeto, onConfirm }: DesignarEntidadeModalProps) {
    const [entidadesExecutoras, setEntidadesExecutoras] = useState<Entidade[]>([]);
    const [entidadesGerenciadoras, setEntidadesGerenciadoras] = useState<Entidade[]>([]);
    const [selectedExecutora, setSelectedExecutora] = useState<string>("");
    const [selectedGerenciadora, setSelectedGerenciadora] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Busca as entidades quando o modal for aberto
        if (isOpen) {
            const fetchEntidades = async () => {
                try {
                    // Substitua pelos endpoints corretos da sua API
                    const [resExecutoras, resGerenciadoras] = await Promise.all([
                        api.get("/entExecs"),
                        api.get("/entGers"),
                    ]);
                    setEntidadesExecutoras(resExecutoras.data);
                    setEntidadesGerenciadoras(resGerenciadoras.data);
                } catch (error) {
                    console.error("Erro ao buscar entidades:", error);
                    toast.error("Falha ao carregar lista de entidades.");
                }
            };
            fetchEntidades();
        }
    }, [isOpen]);

    const handleConfirmClick = async () => {
        if (!selectedExecutora || !selectedGerenciadora) {
            toast.warning("Por favor, selecione ambas as entidades.");
            return;
        }

        setIsSubmitting(true);
        await onConfirm(codProjeto, Number(selectedExecutora), Number(selectedGerenciadora));
        setIsSubmitting(false);
    };
    
    // Função para lidar com a mudança de estado do Dialog (aberto/fechado)
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Designar entidades responsáveis pela execução</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4 py-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="entidade-executora">Entidade Executora</label>
                        <Select onValueChange={setSelectedExecutora} value={selectedExecutora}>
                            <SelectTrigger id="entidade-executora">
                                <SelectValue placeholder="Selecione uma entidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {entidadesExecutoras.map((ent) => (
                                    <SelectItem key={ent.codEntExec} value={String(ent.codEntExec)}>
                                        {ent.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="entidade-gerenciadora">Entidade Gerenciadora</label>
                        <Select onValueChange={setSelectedGerenciadora} value={selectedGerenciadora}>
                            <SelectTrigger id="entidade-gerenciadora">
                                <SelectValue placeholder="Selecione uma entidade" />
                            </SelectTrigger>
                            <SelectContent>
                                {entidadesGerenciadoras.map((ent) => (
                                    <SelectItem key={ent.codEntGer} value={String(ent.codEntGer)}>
                                        {ent.nome}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button type="button" variant="outline">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button onClick={handleConfirmClick} disabled={isSubmitting}>
                        {isSubmitting ? "Confirmando..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
