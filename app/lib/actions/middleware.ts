import axios from 'axios'
import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/app/lib/firebase/firebase-admin'

const RISK_THRESHOLD = 0.3

export const withFirebaseAuth =
  (handler: Function) =>
  async (...args: any[]) => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      return handler(...args)
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  }

export const interpretRecaptcha =
  (handler: Function) =>
  async (...args: any[]) => {
    try {
      const [, formData] = args
      const token = formData.get('reCaptchaToken')

      if (!token)
        return { success: false, message: 'reCAPTCHA token is missing' }

      const res = await axios.post(
        `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/assessments?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
          event: {
            token,
            expectedAction: 'NEW_REVIEW',
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          },
        }
      )

      if (
        !res.data.tokenProperties.valid ||
        res.data.riskAnalysis.score < RISK_THRESHOLD
      )
        return { success: false, message: 'reCAPTCHA verification failed' }

      return handler(...args)
    } catch (error) {
      console.error('reCAPTCHA verification error:', error)
      return { success: false, message: 'Internal Server Error' }
    }
  }
