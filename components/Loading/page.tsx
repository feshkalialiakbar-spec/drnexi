import { useEffect, useState } from 'react'

const LoadingComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === 3) {
          setDirection(-1)
        } else if (prevIndex === 1) {
          setDirection(1)
        }
        return prevIndex + direction
      })
    }, 223)

    return () => clearInterval(interval)
  }, [direction])

  const loadingItems = new Array(3).fill(null)

  return (
    <div className='absolute w-[100%] top-0 right-0 bg-white h-[100%] flex justify-center items-center'>
      <div className='flex min-w-40 min-h-40 gap-3 w-fit justify-center items-center border border-slate-200 rounded-lg'>
        {loadingItems.map((_, index) => (
          <div
            key={index}
            className={`rounded-lg ${
              currentIndex <= index
                ? 'w-3 h-20 bg-[#2F27CE]'
                : 'w-4 h-4 rounded-full bg-blue-300'
            } transition-all duration-5000 ease-in-out`}
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingComponent
