import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const C = ({ children }: { children: React.ReactNode }) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
    useEnterprise={true}>
    {children}
  </GoogleReCaptchaProvider>
)

export default C
