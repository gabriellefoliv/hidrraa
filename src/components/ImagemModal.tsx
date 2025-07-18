import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTrigger } from './ui/dialog'

export function ImagemModal({ src }: { src: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt="Preview"
          className="w-20 h-20 object-cover rounded shadow cursor-pointer"
        />
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/60 z-50" />
        <DialogContent className="fixed z-50 top-1/2 left-1/2 max-w-5xl w-[90vw] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg flex flex-col items-end">
          {/* <DialogClose asChild>
            <button className="text-gray-600 hover:text-gray-900">
              <X size={24} />
            </button>
          </DialogClose> */}
          <img
            src={src}
            alt="Expanded"
            className="w-full h-full object-contain mt-2"
          />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
