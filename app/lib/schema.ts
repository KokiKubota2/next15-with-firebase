import { z } from 'zod'

export const CREATE_REVIEW_SCHEMA = z.object({
  title: z
    .string()
    .min(1, '必須項目です')
    .max(30, '30文字以内で入力してください'),
  comment: z.string().max(100, '100文字以内で入力してください').nullable(),
})
