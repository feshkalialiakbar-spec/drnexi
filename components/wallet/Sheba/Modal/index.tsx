const ConfirmationModal = ({
  show,
  onCancel,
  onConfirm,
  username,
}: {
  show: boolean
  onCancel: () => void
  onConfirm: () => void
  username: string
}) => {
  if (!show) return null

  return (
    <div className='fixed inset-0 z-20 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
      <div
        className={`animate-logout bg-white p-6 absolute w-[93%] bottom-24 max-w-[880px] rounded z-30`}>
        <p className='text-lg mb-4 text-primary'>{`آیا می‌خواهید شبا ${username} را غیرفعال کنید؟`}</p>
        <div className='flex gap-6 mt-6 sm:mt-8'>
          <div className='flex-1'>
            <button
              className='fill-button w-full  h-10 rounded-lg'
              onClick={onCancel}>
              انصراف
            </button>
          </div>
          <div className='flex-1'>
            <button
              className='border border-red-600 h-10 text-red-500 w-full !rounded-lg'
              onClick={onConfirm}>
              غیرفعال کردن
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
