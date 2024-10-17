import { NewReviewForm, Reviews } from '@/app/(firebase)/reviews'

const P = () => {
  return (
    <div className='flex flex-col gap-4'>
      <NewReviewForm />
      <Reviews />
    </div>
  )
}

export default P
