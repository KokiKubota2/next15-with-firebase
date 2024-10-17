export type QueryCondition = [string, WhereFilterOp, any]

export type QueryOrder = { field: string; direction: OrderByDirection }

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export type Review = {
  title: string
  comment: string | null
  createdAt: DateTime
  createdBy: string
}
