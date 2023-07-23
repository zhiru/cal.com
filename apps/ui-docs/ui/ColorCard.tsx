import Text from '@/ui/Text'
import { Check, Copy } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ColorCard({
  cssVar,
  twClass,
  bg,
}: {
  cssVar: string
  twClass: string
  bg: string
}) {
  const [cssVarValue, setCssVarValue] = useState(
    window
      .getComputedStyle(document.querySelector('html'))
      .getPropertyValue(cssVar.replace('var(', '').replace(')', ''))
  )

  const [copied, setCopied] = useState('')

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(''), 1500)

      return () => clearTimeout(timer)
    }
  }, [copied])

  useEffect(() => {
    const obs = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const target = mutation.target as HTMLElement

        const value = window.getComputedStyle(target).getPropertyValue(cssVar)

        setCssVarValue(value)
      })
    })

    obs.observe(document.querySelector('html'), {
      attributes: true,
    })

    return () => obs.disconnect()
  }, [cssVar])

  function copyToClipboard(value: string, type: 'cssVar' | 'cssVarValue' | 'twClass') {
    navigator.clipboard.writeText(value)
    setCopied(type)
  }

  return (
    <div className="rounded-default hover:bg-accent selection:hover:bg-foreground flex flex-row items-center gap-5 p-2">
      <div
        className={classNames('rounded-default border-base h-16 w-16 shrink-0 border')}
        style={{ backgroundColor: bg }}
      />
      <div className="flex h-full flex-col justify-evenly">
        <button
          className="group flex w-fit items-center lg:text-base"
          onClick={() => copyToClipboard(`var(${cssVar})`, 'cssVar')}
          aria-label="Copy CSS variable name"
        >
          <Text className="text-sm font-medium">
            <span>var({cssVar})</span>{' '}
          </Text>
          {copied === 'cssVar' ? (
            <Check className="h-3 text-success" />
          ) : (
            <Copy className="hidden h-3 group-hover:block" />
          )}
        </button>
        <button
          className="group flex w-fit items-center"
          onClick={() => copyToClipboard(cssVarValue, 'cssVarValue')}
          aria-label="Copy CSS variable value"
        >
          <Text className="text-sm text-subtle">{cssVarValue}</Text>
          {copied === 'cssVarValue' ? (
            <Check className=" h-3 text-success" />
          ) : (
            <Copy className="hidden h-3 text-subtle group-hover:block" />
          )}
        </button>
        <button
          className="group flex w-fit items-center"
          onClick={() => copyToClipboard(twClass, 'twClass')}
          aria-label="Copy class name"
        >
          <Text className="text-sm">{twClass}</Text>
          {copied === 'twClass' ? (
            <Check className="h-3 text-success" />
          ) : (
            <Copy className="hidden h-3 group-hover:block" />
          )}
        </button>
      </div>
    </div>
  )
}
