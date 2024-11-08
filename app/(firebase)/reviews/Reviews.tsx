'use client'

import _ from 'lodash'

import { AuthenticatedClientWrapper } from '@/app/components/wrappers'
import { useFirestoreReads } from '@/app/lib/firebase/useFirestoreReads'
import { formatTimestamp } from '@/app/lib/utils'
import type { Review } from '@/app/types/addtional'

const ReviewCard = ({ review }: { review: Review }) => (
  <div className='flex flex-col border-[1px] border-slate-300 bg-slate-200 rounded-md p-2'>
    <div>{review.title}</div>
    <div className='text-sm whitespace-pre-wrap'>{review.comment}</div>
    <div className='text-xs opacity-70 text-right'>{review.createdBy}</div>
    <div className='text-xs opacity-70 text-right'>
      {formatTimestamp(review.createdAt)}
    </div>
  </div>
)

const Reviews = () => {
  const { listenReviews } = useFirestoreReads()
  const { data } = listenReviews()

  return (
    <div className='flex flex-col gap-2 mx-2'>
      {_(data)
        .map((v, k) => ({ ...v, key: k }))
        .orderBy((v) => v.createdAt.toMillis(), 'desc')
        .map((v) => <ReviewCard review={v} key={v.key} />)
        .value()}
    </div>
  )
}

const C = () => (
  <AuthenticatedClientWrapper>
    <Reviews />
  </AuthenticatedClientWrapper>
)

export default C
