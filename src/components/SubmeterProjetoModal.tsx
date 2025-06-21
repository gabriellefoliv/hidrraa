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

interface SubmeterProjetoModalProps {
    onSubmit: () => void
}

export function SubmeterProjetoModal({onSubmit}: SubmeterProjetoModalProps) {

  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button
          disabled={false}
          className="bg-sky-900 hover:bg-sky-900/75 text-white font-semibold py-6 px-4 rounded-md transition duration-200"
        >
          Submeter Projeto</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Confirmar submissão de projeto
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja submeter o projeto?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {/* <DialogClose asChild> */}
              <Button variant="outline" onClick={() => onSubmit()}>Salvar e Submeter</Button>
            {/* </DialogClose> */}
            <DialogClose asChild>
              <Button>Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
