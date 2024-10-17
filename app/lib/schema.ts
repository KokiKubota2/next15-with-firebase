import { z } from 'zod'

import { formatNumber } from '@/app/lib/utils'

export const CREATE_REVIEW_SCHEMA = z.object({
  title: z
    .string()
    .min(1, '必須項目です')
    .max(30, '30文字以内で入力してください'),
  comment: z.string().max(100, '100文字以内で入力してください').nullable(),
})

export const CREATE_PRODUCT_SCHEMA = z.object({
  name: z
    .string()
    .min(1, '必須項目です')
    .max(30, '30文字以内で入力してください'),
  price: z
    .number()
    .max(100000, `${formatNumber(100000)}円以下に設定してください`)
    .min(10, '100円以上には設定してください'),
})
