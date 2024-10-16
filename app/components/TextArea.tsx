import { cva, VariantProps } from 'class-variance-authority'
import { TextareaHTMLAttributes } from 'react'

import { cn } from '@/app/lib/utils'

interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string
}

const textareaVariants = cva(
  'border bg-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5',
  { variants: {}, defaultVariants: {} }
)

const TextArea = ({ label, className, ...props }: TextAreaProps) => (
  <div>
    {label && <label className='text-sm'>{label}</label>}
    <textarea {...props} className={cn(textareaVariants({ className }))} />
  </div>
)

export default TextArea
