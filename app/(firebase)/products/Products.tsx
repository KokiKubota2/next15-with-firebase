import _ from 'lodash'
import { DateTime } from 'luxon'
import { Suspense, use } from 'react'

import { getProducts } from '@/app/lib/actions/products/getProducts'
import { formatNumber, formatTimestamp } from '@/app/lib/utils'
import { Product } from '@/app/types/addtional'

const ProductCard = ({ product }: { product: Product }) => (
  <div className='flex flex-col border-[1px] border-slate-300 bg-slate-200 rounded-md p-2'>
    <div className='flex justify-between'>
      <div>{product.name}</div>
      <div className='text-sm whitespace-pre-wrap'>
        {formatNumber(product.price)} 円
      </div>
    </div>
    <div className='text-xs opacity-70 text-right'>
      {formatTimestamp(DateTime.fromSeconds(product.createdAt._seconds))}
    </div>
  </div>
)

const Products = () => {
  const { data } = use(getProducts())

  return (
    <div className='flex flex-col gap-2 mx-2'>
      {_(data)
        .map((v, k) => ({ ...v, key: k }))
        .orderBy((v) => v.createdAt.toMillis(), 'desc')
        .map((v) => <ProductCard product={v} key={v.key} />)
        .value()}
    </div>
  )
}

const C = () => (
  <Suspense fallback={<>Loading...</>}>
    <Products />
  </Suspense>
)

export default C
