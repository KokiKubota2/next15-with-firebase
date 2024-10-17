import { useQuery } from 'react-query'

import { firestoreOperations } from '@/app/lib/firebase/firestoreOperations'
import { QueryCondition, Review } from '@/app/types/addtional'

const {
  getById,
  getMany,
  getManyWithConstraints,
  getCount,
  listenById,
  listenMany,
  queryDocSnapToObj,
  querySnapToObj,
} = firestoreOperations

const getReviewsSnap = (conditions: QueryCondition[]) =>
  getMany<Review>('reviews', conditions)

export const useFirestoreReads = () => ({
  getReviews(conditions?: QueryCondition[]) {
    return useQuery(['reviews'], async () => {
      const snap = await getReviewsSnap(conditions || [])
      return querySnapToObj(snap)
    })
  },
  listenReviews(conditions?: QueryCondition[]) {
    const { isLoading, querySnap } = listenMany<Review>(
      'reviews',
      conditions || []
    )

    return { isLoading, data: querySnap ? querySnapToObj(querySnap) : null }
  },
})
