import clsx, { type ClassValue } from 'clsx'
import _ from 'lodash'
import { type DateTime } from 'luxon'
import numeral from 'numeral'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatTimestamp = (dt: DateTime) => dt.toFormat('yyyy-MM-dd HH:mm')

export const formatNumber = (num: number) => numeral(num).format('0,0')

export const querySnapToObj = (
  snap: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) =>
  _.transform(
    snap.docs,
    (result: { [key: string]: any }, doc) => {
      result[doc.id] = doc.data()
    },
    {}
  )
