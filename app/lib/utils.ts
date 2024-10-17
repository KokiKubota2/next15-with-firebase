import clsx, { type ClassValue } from 'clsx'
import { type DateTime } from 'luxon'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatTimestamp = (dt: DateTime) => dt.toFormat('yyyy-MM-dd HH:mm')
