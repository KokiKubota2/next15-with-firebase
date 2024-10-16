import { cva, VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes } from 'react'

import { cn } from '@/app/lib/utils'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  loading?: boolean
}

const buttonVariants = cva('rounded-md text-white', {
  variants: {
    variant: {
      primary: 'bg-sky-500 hover:bg-sky-600',
      secondary: 'bg-slate-500 hover:bg-slate-600',
      denger: 'bg-red-500 hover:bg-red-600',
    },
    size: {
      sm: 'text-sm px-4 py-1',
      md: 'text-base px-6 py-2',
      lg: 'text-xl px-8 py-3',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

const C = ({
  children,
  className,
  variant,
  size,
  loading,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cn(buttonVariants({ variant, size, className }), {
      'opacity-50 cursor-not-allowed': loading || props.disabled,
    })}>
    {loading ? 'Loading...' : children}
  </button>
)

export default C
