import { db } from '@/app/lib/firebase/firebase-client'
import { QueryCondition } from '@/app/types/addtional'
import {
  DocumentData,
  Query,
  QueryConstraint,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'

const queryDocSnapToObj = <T>(snap: QueryDocumentSnapshot<T>) => ({
  id: snap.id,
  ...snap.data(),
})

const querySnapToObj = <T>(snap: QuerySnapshot<T>) =>
  _.transform(
    snap.docs,
    (result: { [key: string]: T }, doc) => {
      result[doc.id] = doc.data()
    },
    {}
  )

const convertTimestampToDateTime = <T>(doc: any): T =>
  _.mapValues(doc, (value) => {
    if (value instanceof Timestamp) return DateTime.fromJSDate(value.toDate())
    else if (_.isArray(value))
      return _.map(value, (item) => {
        if (item instanceof Timestamp) return DateTime.fromJSDate(item.toDate())
        else if (_.isPlainObject(item)) return convertTimestampToDateTime(item)
        else return item
      })
    else if (_.isPlainObject(value)) return convertTimestampToDateTime(value)
    else return value
  }) as T

const getDocSnap = async <T>(path: string) => {
  const ref = doc(db, path).withConverter({
    fromFirestore: (snapshot, options) =>
      convertTimestampToDateTime<T>(snapshot.data(options)),
    toFirestore: (model) => model as DocumentData,
  })

  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error(`Doc does not exist`)

  return snap
}

const getColSnap = <T>(
  path: string,
  conditions: QueryCondition[],
  constraints?: QueryConstraint[]
) => {
  const baseQuery: Query<T> = collection(db, path).withConverter({
    fromFirestore: (snapshot, options) =>
      convertTimestampToDateTime<T>(snapshot.data(options)),
    toFirestore: (model) => model as DocumentData,
  })

  const queryRef = _.reduce(
    conditions,
    (accQuery, [field, operator, value]) =>
      query(accQuery, where(field, operator, value)),
    baseQuery
  )

  const q = constraints ? query(queryRef, ...constraints) : queryRef
  return getDocs(q)
}

const listenDoc = <T>(path: string) => {
  const [data, setData] = useState<(T & { id: string }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, path).withConverter({
      fromFirestore: (snapshot, options) =>
        convertTimestampToDateTime<T>(snapshot.data(options)),
      toFirestore: (model) => model as DocumentData,
    })

    const unsub = onSnapshot(ref, (docSnap) => {
      if (!docSnap.exists()) {
        setData(null)
        setIsLoading(false)
        return
      }

      setData({ id: docSnap.id, ...docSnap.data() })
      setIsLoading(false)
    })

    return () => {
      unsub()
    }
  }, [db, path])

  return { isLoading, data }
}

const listenCol = <T>(path: string, conditions: QueryCondition[]) => {
  const [querySnap, setQuerySnap] = useState<QuerySnapshot<
    T,
    DocumentData
  > | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const baseQuery: Query<T> = collection(db, path).withConverter({
      fromFirestore: (snapshot, options) =>
        convertTimestampToDateTime<T>(snapshot.data(options)),
      toFirestore: (model) => model as DocumentData,
    })

    const queryRef: Query<T> = _.reduce(
      conditions,
      (accQuery, [field, operator, value]) =>
        query(accQuery, where(field, operator, value)),
      baseQuery
    )

    const unsub = onSnapshot(queryRef, (querySnapshot) => {
      setQuerySnap(querySnapshot)
      setIsLoading(false)
    })

    return () => {
      unsub()
    }
  }, [db, path])

  return { isLoading, querySnap }
}

const getDocCount = (path: string, conditions: QueryCondition[]) => {
  const baseQuery: Query<DocumentData> = collection(db, path)

  const queryRef: Query<DocumentData> = _.reduce(
    conditions,
    (accQuery, [field, operator, value]) =>
      query(accQuery, where(field, operator, value)),
    baseQuery
  )

  return getCountFromServer(queryRef)
}

export const firestoreOperations = {
  queryDocSnapToObj,
  querySnapToObj,
  getById<T>(path: string) {
    return getDocSnap<T>(path)
  },
  listenById<T>(path: string) {
    return listenDoc<T>(path)
  },
  getMany<T>(path: string, conditions: QueryCondition[]) {
    return getColSnap<T>(path, conditions)
  },
  getManyWithConstraints<T>(
    path: string,
    conditions: QueryCondition[],
    constraints: QueryConstraint[]
  ) {
    return getColSnap<T>(path, conditions, constraints)
  },
  listenMany<T>(path: string, conditions: QueryCondition[]) {
    return listenCol<T>(path, conditions)
  },
  getCount(path: string, conditions: QueryCondition[]) {
    return getDocCount(path, conditions)
  },
  createDoc(path: string, data: any) {
    return addDoc(collection(db, path), {
      ...data,
      createdAt: Timestamp.now(),
    })
  },
  deleteDoc(path: string) {
    return deleteDoc(doc(db, path))
  },
}
