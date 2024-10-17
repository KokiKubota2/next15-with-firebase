import { NewProductForm, Products } from '@/app/(firebase)/products'

const P = () => (
  <div className='flex flex-col gap-4'>
    <NewProductForm />
    <Products />
  </div>
)

export default P
