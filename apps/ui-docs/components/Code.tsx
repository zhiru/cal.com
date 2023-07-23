'use client'

import { Button } from '@calcom/ui'
import { Check, Clipboard } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import { useEffect, useState } from 'react'

export default function Code({
  children,
  language = 'tsx',
  mdx,
  className,
}: {
  children: string
  language?: string
  mdx?: boolean
  className?: string
}) {
  useEffect(() => Prism.highlightAll(), [children])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 1500)

      return () => clearTimeout(timer)
    }
  }, [copied])

  return (
    <div className="relative">
      <Button
        className="absolute right-4 top-2 z-10 w-min self-center"
        color="secondary"
        StartIcon={copied ? Check : Clipboard}
        variant="icon"
        onClick={() => {
          navigator.clipboard.writeText(children)
          setCopied(true)
        }}
      />
      <pre
        className={`${
          language ? `language-${language}` : null
        } rounded-default border-base group border text-sm shadow-default outline-none ${className}`}
      >
        {mdx ? children : <code className={`language-${language}`}>{children}</code>}
      </pre>
    </div>
  )
}
