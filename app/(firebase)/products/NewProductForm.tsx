'use client'

import _ from 'lodash'
import Form from 'next/form'
import { useActionState, useEffect, useState } from 'react'

import { Button, Input } from '@/app/components'
import { createProduct } from '@/app/lib/actions/products/createProduct'

import { CREATE_PRODUCT_SCHEMA } from '@/app/lib/schema'

const C = () => {
  const [formState, formAction, pending] = useActionState(createProduct, null)
  const [formData, setFormData] = useState({ name: '', price: 0 })
  const [isValid, setIsValid] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? _.toNumber(value) : value,
    }))
  }

  useEffect(() => {
    const result = CREATE_PRODUCT_SCHEMA.safeParse(formData)
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
          name='name'
          label='商品名'
          value={formData.name}
          onChange={handleInputChange}
        />
        <Input
          name='price'
          label='値段'
          type='number'
          value={formData.price}
          onChange={handleInputChange}
        />
        <Button type='submit' loading={pending} disabled={!isValid || pending}>
          商品を追加する
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
