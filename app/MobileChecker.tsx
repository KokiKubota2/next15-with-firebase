import { headers } from 'next/headers'

const MobileChecker = ({ children }: { children: React.ReactNode }) => {
  const userAgent = headers().get('user-agent') || ''
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(userAgent)

  if (!isMobileDevice) {
    return (
      <div className='m-4 text-primary'>
        ご利用の端末はサポート対象外です
        <br />
        <br />
        MeGo は現在、iOS および Androidデバイスのみでご利用いただけます。
        <br />
        ご不便をおかけして申し訳ございませんが、対応端末からのアクセスをお願いいたします。
      </div>
    )
  }

  return <>{children}</>
}

export default MobileChecker
