'use server'

import { FieldValue } from 'firebase-admin/firestore'

import { db, getCurrentUser } from '@/app/lib/firebase/firebase-admin'
import { CREATE_REVIEW_SCHEMA } from '@/app/lib/schema'

import {
  interpretRecaptcha,
  withFirebaseAuth,
} from '@/app/lib/actions/middleware'

const createReviewHandler = async (
  prevState: { success: boolean; message: string } | null,
  queryData: FormData
) => {
  const values = {
    title: queryData.get('title'),
    comment: queryData.get('comment'),
  }

  const validatedFields = CREATE_REVIEW_SCHEMA.safeParse(values)
  if (!validatedFields.success)
    return { success: false, message: validatedFields.error.errors[0].message }

  const currentUser = await getCurrentUser()

  const docRef = await db.collection('reviews').add({
    ...values,
    createdAt: FieldValue.serverTimestamp(),
    createdBy: currentUser.uid,
  })

  return { success: true, message: docRef.id }
}

export const createReview = withFirebaseAuth(
  interpretRecaptcha(createReviewHandler)
)
