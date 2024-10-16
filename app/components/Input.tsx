import { cva, VariantProps } from 'class-variance-authority'
import { InputHTMLAttributes } from 'react'

import { cn } from '@/app/lib/utils'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
}

const inputVariants = cva(
  'border bg-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5',
  { variants: {}, defaultVariants: {} }
)

const C = ({ label, className, ...props }: InputProps) => (
  <div>
    {label && <label className='text-sm'>{label}</label>}
    <input {...props} className={cn(inputVariants({ className }))} />
  </div>
)

export default C
