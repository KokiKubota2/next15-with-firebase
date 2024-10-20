import { useRef } from 'react'

const Modal = ({ children }: { children: React.ReactNode }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  return (
    <dialog className='fixed inset-0 w-full h-full bg-opacity-90 z-50 flex justify-center items-center opacity-80 bg-black'>
      <div
        ref={modalRef}
        className='bg-white p-3 rounded-lg w-[325px] max-h-[660px] overflow-y-auto'
        id='modal'>
        {children}
      </div>
    </dialog>
  )
}

const ReloadButton: React.FC = () => (
  <button
    className='btn-primary w-[80%] mx-auto'
    onClick={() => window.location.reload()}>
    再読み込み
  </button>
)

const PermissionDeniedModal: React.FC = () => (
  <Modal>
    <div className='flex flex-col text-center gap-5 my-4'>
      <p className='modal-title'>位置情報の取得が許可されていません</p>
      <p className='modal-body'>
        下記のガイドを参考に
        <br />
        設定を変更してください。
      </p>
    </div>
  </Modal>
)

const PositionUnAvailableModal: React.FC = () => (
  <Modal>
    <div className='flex flex-col text-center gap-5 my-4'>
      <p className='modal-title'>位置情報が取得できません</p>
      <p className='modal-body'>位置情報の使用を許可してください</p>
      <ReloadButton />
    </div>
  </Modal>
)

const TimeoutModal: React.FC = () => (
  <Modal>
    <div className='flex flex-col text-center gap-5 my-4'>
      <p className='modal-title'>位置情報の取得に時間がかかっています</p>
      <p className='modal-body'>
        見通しの良い場所に移動するか
        <br />
        再読み込みしてください
      </p>
      <ReloadButton />
    </div>
  </Modal>
)

const C = ({ error }: { error: GeolocationPositionError }) =>
  error &&
  {
    1: <PermissionDeniedModal />,
    2: <PositionUnAvailableModal />,
    3: <TimeoutModal />,
  }[error.code]

export default C
