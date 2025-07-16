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

interface SubmeterEvidenciasModalProps {
    onSubmit: () => void
}

export function SubmeterEvidenciasModal({ onSubmit }: SubmeterEvidenciasModalProps) {

  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button
          disabled={false}
          className="bg-sky-900 hover:bg-sky-900/75 text-white font-semibold py-4 px-4 ml-2 rounded-sm transition duration-200"
        >
          Submeter Evidências</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Confirmar submissão de evidências
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja submeter as evidências? Se sim, você não poderá alterar e elas serão avaliadas pelo comitê.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {/* <DialogClose asChild> */}
              <Button variant="outline" onClick={() => onSubmit()}>Confirmar submissão</Button>
            {/* </DialogClose> */}
            <DialogClose asChild>
              <Button>Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
