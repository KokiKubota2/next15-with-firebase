'use client'

import Form from 'next/form'
import { useActionState, useEffect, useState } from 'react'

import { Button, Input, TextArea } from '@/app/components'
import { createReview } from '@/app/lib/actions/reviews/createReview'

import { CREATE_REVIEW_SCHEMA } from '@/app/lib/schema'

const C = () => {
  const [formState, formAction, pending] = useActionState(createReview, null)
  const [formData, setFormData] = useState({ title: '', comment: '' })
  const [isValid, setIsValid] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const result = CREATE_REVIEW_SCHEMA.safeParse(formData)
    if (result.success) {
      setIsValid(true)
      return
    }

    setIsValid(false)
  }, [formData])

  return (
    <>
      <Form action={formAction} className='flex flex-col m-2 gap-4'>
        <Input
          type='text'
          name='title'
          label='タイトル'
          value={formData.title}
          onChange={handleInputChange}
        />
        <TextArea
          name='comment'
          label='コメント'
          rows={3}
          value={formData.comment}
          onChange={handleInputChange}
        />
        <Button type='submit' loading={pending} disabled={!isValid || pending}>
          レビューを送信する
        </Button>
      </Form>

      {formState?.success && (
        <p className='m-2'>SUCCEED: {formState?.message}</p>
      )}
      {formState?.success === false && (
        <p className='m-2'>FAILED: {formState?.message}</p>
      )}
    </>
  )
}

export default C
