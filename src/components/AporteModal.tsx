import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from "react"

interface AporteModalProps {
    bc_valor: string
    onSubmit: () => void
}

export function AporteModal({bc_valor, onSubmit}: AporteModalProps) {

    const [modalPage, setModalPage] = useState<1 | 2 | "closed">("closed")
    const handleSubmit = () => {
      if(!bc_valor) {
          alert("O valor do aporte deve ser informado.")
          return;
      }
      if (modalPage === 2) {
          onSubmit();
          setModalPage("closed");
      }
      else {
          setModalPage(2);
      }
  }

  return (
    <Dialog open={modalPage !== "closed"}>
        <DialogTrigger  asChild>
          <Button onClick={() => setModalPage(1)}
          disabled={false}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          Realizar Aporte</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{(modalPage === 1) ? "Confirmar Aporte" : "Entrada na Blockchain"}</DialogTitle>
            <DialogDescription>
              {(modalPage === 1) ? `Enviando R$ ${bc_valor} para o Comitê de Bacia Hidrográfica...` :  "Adentrando o valor na Blockchain..."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={() => handleSubmit()}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
