'use client'

import { usePropsPanel } from '../lib/usePropsPanel'
import * as Tabs from '../ui/Tabs'
import Text from '../ui/Text'
import Code from './Code'
import * as PropsSheet from './PropsSheet'
import { classNames } from '@calcom/lib'
import { Button } from '@calcom/ui'
import { DirectionProvider } from '@radix-ui/react-direction'
import { FileCode, Component, Settings2, X } from 'lucide-react'
import { useState } from 'react'

export default function ComponentPreview({
  children,
  code,
  title,
  id,
  hasSlots,
}: {
  children: React.ReactNode
  code: string
  title?: string
  id?: string
  hasSlots?: boolean
}) {
  const { activeComponent, setActiveComponent } = usePropsPanel()
  const [dir, setDir] = useState<'rtl' | 'ltr'>('ltr')
  const [open, setOpen] = useState(false)

  return (
    <Tabs.Root defaultValue="preview" id={title?.toLowerCase()}>
      <div
        className={classNames(
          'mt-11 flex flex-row items-center justify-between gap-2 pb-1.5',
          !title ? 'justify-end' : ''
        )}
      >
        {title ? (
          <Text variant="h5" as="h2" href={`#${title.toLowerCase()}`} asJumpLink>
            {title}
          </Text>
        ) : null}
        <div className="flex items-center gap-2">
          <Tabs.List>
            <Tabs.Trigger value="code">
              <FileCode className="h-3.5 w-3.5" aria-label="implementation code" />
            </Tabs.Trigger>
            <Tabs.Trigger value="preview">
              <Component className="h-3.5 w-3.5" aria-label="preview" />
            </Tabs.Trigger>
          </Tabs.List>
          <Button
            color="secondary"
            className="w-10 py-2 text-xs"
            onClick={() => setDir((dir) => (dir === 'ltr' ? 'rtl' : 'ltr'))}
          >
            {dir.toUpperCase()}
          </Button>
          {id ? (
            <>
              <Button
                color="secondary"
                className="hidden py-2 xl:block"
                variant="icon"
                StartIcon={activeComponent.id ? X : Settings2}
                onClick={() => {
                  setActiveComponent({
                    id: activeComponent.id ? '' : id,
                    hasSlots,
                  })
                }}
              >
                <p className="sr-only">
                  {activeComponent.id
                    ? 'Close props settings panel'
                    : 'Open props settings panel'}
                </p>
              </Button>
              <PropsSheet.Root
                open={open}
                setOpen={setOpen}
                activeComponent={activeComponent}
              >
                <PropsSheet.Trigger className="xl:hidden" asChild>
                  <Button
                    color="secondary"
                    className="py-2"
                    variant="icon"
                    StartIcon={Settings2}
                    onClick={() => {
                      setActiveComponent({
                        id,
                        hasSlots,
                      })
                    }}
                  />
                </PropsSheet.Trigger>
              </PropsSheet.Root>
            </>
          ) : null}
        </div>
      </div>
      <Tabs.Content value="code" className="relative">
        <Code language="tsx">{code}</Code>
      </Tabs.Content>
      <Tabs.Content value="preview">
        <DirectionProvider dir={dir}>
          <bdo dir={dir}>
            <div className="rounded-default border-base bg-base flex justify-center border shadow-default">
              {children}
            </div>
          </bdo>
        </DirectionProvider>
      </Tabs.Content>
    </Tabs.Root>
  )
}
