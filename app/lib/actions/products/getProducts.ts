'use server'

import { withFirebaseAuth } from '@/app/lib/actions/middleware'
import { db } from '@/app/lib/firebase/firebase-admin'
import { querySnapToObj } from '@/app/lib/utils'

const getProductsHandler = async () => {
  const products = await db
    .collection('products')
    .get()
    .then((s) => querySnapToObj(s))

  return { success: true, data: products }
}

export const getProducts = withFirebaseAuth(getProductsHandler)
