'use client'

import { useArgs } from '../lib/useArgs'
import { usePropsPanel } from '../lib/usePropsPanel'
import InputType from './InputType'
import { classNames } from '@calcom/lib'
import { Button } from '@calcom/ui'
import { useSlot, useSlots } from 'lib/useArgsWithSlots'
import { X, Info } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function PropsPanel() {
  const { activeComponent, setActiveComponent } = usePropsPanel()

  return (
    <div
      className={classNames(
        'border-base bg-foreground dark:bg-base sticky right-0 top-0 hidden h-screen w-72 shrink-0 flex-col overflow-auto border-l text-sm text-subtle shadow-default',
        activeComponent.id ? 'xl:flex' : 'hidden'
      )}
    >
      <Button
        className="absolute right-2 top-2 rounded-full px-2 py-2"
        StartIcon={X}
        variant="icon"
        onClick={() => setActiveComponent({ id: '', hasSlots: false })}
      />
      <div className="mt-14 flex flex-col gap-10 overflow-auto px-4 pb-6">
        {activeComponent.id ? (
          activeComponent.hasSlots ? (
            <PropsInputsWithSlots id={activeComponent.id} />
          ) : (
            <PropsInputs id={activeComponent.id} />
          )
        ) : null}
      </div>
    </div>
  )
}

export function PropsInputs({ id }: { id: string }) {
  const { args, argsAtom } = useArgs(id)

  return (
    <>
      {Object.keys(args).map((arg) => (
        <InputType key={arg} argsAtom={argsAtom} arg={args[arg]} argName={arg} />
      ))}
    </>
  )
}

export function SlotInputType({ id, slotName }: { id: string; slotName: string }) {
  const { argsAtom, slot } = useSlot(id, slotName)

  return (
    <div className="space-y-5">
      <div className="border-base flex flex-row items-center gap-1 border-b pb-2">
        <h3 className="text-base font-medium text-default">
          {slotName ? slotName.charAt(0).toUpperCase() + slotName.slice(1) : null}
        </h3>
        <Button className="p-0.5">
          <Link href={`#${slotName}-props`} className="hidden xl:block">
            <Info className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="space-y-7">
        {Object.keys(slot.args).map((arg) => (
          <InputType key={arg} argsAtom={argsAtom} arg={slot.args[arg]} argName={arg} />
        ))}
      </div>
    </div>
  )
}
export function PropsInputsWithSlots({ id }: { id: string }) {
  const { slots } = useSlots(id)

  return (
    <>
      {Object.keys(slots).map((slotName) => {
        return <SlotInputType key={slotName} id={id} slotName={slotName} />
      })}
    </>
  )
}
