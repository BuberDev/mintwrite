'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { clsx } from 'clsx'

interface CopyButtonProps {
  text: string
  variant?: 'default' | 'primary'
  label?: string
}

export default function CopyButton({
  text,
  variant = 'default',
  label,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={clsx(
        'transition-all duration-150 text-xs',
        variant === 'primary' ? 'btn-primary' : 'btn-secondary'
      )}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          {label ? 'Copied!' : ''}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label ?? ''}
        </>
      )}
    </button>
  )
}
