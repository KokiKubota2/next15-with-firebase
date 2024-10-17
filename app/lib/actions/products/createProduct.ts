'use server'

import { FieldValue } from 'firebase-admin/firestore'
import _ from 'lodash'
import { revalidatePath } from 'next/cache'

import { db, getCurrentUser } from '@/app/lib/firebase/firebase-admin'
import { CREATE_PRODUCT_SCHEMA } from '@/app/lib/schema'

import { withFirebaseAuth } from '@/app/lib/actions/middleware'

const createProductHandler = async (
  prevState: { success: boolean; message: string } | null,
  queryData: FormData
) => {
  const values = {
    name: queryData.get('name'),
    price: _.toNumber(queryData.get('price')),
  }

  const validatedFields = CREATE_PRODUCT_SCHEMA.safeParse(values)
  if (!validatedFields.success)
    return { success: false, message: validatedFields.error.errors[0].message }

  const currentUser = await getCurrentUser()

  const docRef = await db.collection('products').add({
    ...values,
    createdAt: FieldValue.serverTimestamp(),
    createdBy: currentUser.uid,
  })

  revalidatePath('/products')

  return { success: true, message: docRef.id }
}

export const createProduct = withFirebaseAuth(createProductHandler)
