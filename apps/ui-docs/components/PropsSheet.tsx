import { PropsInputs, PropsInputsWithSlots } from './PropsPanel'
import { SheetTrigger } from '@calcom/ui'
import { Sheet, SheetContent } from '@calcom/ui'

function Root({
  children,
  activeComponent,
  open,
  setOpen,
}: {
  children: React.ReactElement<typeof SheetTrigger>
  activeComponent: {
    id: string
    hasSlots: boolean
  }
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)}>
      {children}
      <SheetContent>
        <div className="flex flex-col gap-12 overflow-auto px-4">
          {activeComponent.id ? (
            activeComponent.hasSlots ? (
              <PropsInputsWithSlots id={activeComponent.id} />
            ) : (
              <PropsInputs id={activeComponent.id} />
            )
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

const Trigger = SheetTrigger

export { Root, Trigger }
