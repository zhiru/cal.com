'use client'

import * as SwitchPrimitives from '@radix-ui/react-switch'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={classNames(
      'radix-state-checked:bg-primary radix-state-unchecked:bg-primary/25 peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent outline-none transition-colors ease-in-out focus:ring-subtle focus:ring-offset-2 focus:ring-offset-default placeholder:focus:ring-offset-default focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.required ? 'ring-danger ring-2 ring-offset-2 ring-offset-default' : '',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={classNames(
        'bg-base pointer-events-none block h-4 w-4 rounded-full shadow-default ring-0 transition-transform ease-in-out radix-disabled:opacity-50 radix-state-checked:translate-x-4 radix-state-unchecked:translate-x-0 rtl:radix-state-checked:-translate-x-4'
      )}
    />
  </SwitchPrimitives.Root>
))

Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
