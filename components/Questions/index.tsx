'use client'
import Header from '@/components/shared/Header'
import { useCallback, useEffect, useState } from 'react'
import { topics } from './data'
import { ArrowDown2, ArrowRight2, Danger } from 'iconsax-react'
import { Expand } from '../shared/IconGenerator'
import { useRouter } from 'next/navigation'
import { getCookieByKey } from '@/actions/cookieToken'

const FAQ = () => {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState<number>(3)

  const [openAccordion, setOpenAccordion] = useState<number[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const checkAuth = useCallback(async () => {
    const result = await getCookieByKey('access_token')
    result && setIsAuthenticated(true)
  }, [setIsAuthenticated])
  useEffect(() => {
    checkAuth()

    const handleHashChange = () => {
      const tag = location.hash.substring(1)
      if (tag === 'timeTable') setSelectedTopic(1)
    }

    window.addEventListener('hashchange', handleHashChange, false)
    handleHashChange()
    return () => {
      window.removeEventListener('hashchange', handleHashChange, false)
    }
  }, [checkAuth])

  const toggleAccordion = (subIndex: number) => {
    if (openAccordion.includes(subIndex)) {
      setOpenAccordion(openAccordion.filter((index) => index !== subIndex))
    } else {
      setOpenAccordion([...openAccordion, subIndex])
    }
  }

  return (
    <div className="transition-all duration-500 ease-in-out">
      <Header />
      <div>
        <button
          className="!font-medium !text-primary !flex !items-center !gap-2 !mb-8 lg:!mb-10 !rounded-lg"
          onClick={() => router.back()}
        >
          <ArrowRight2 size="24" color="#2f27ce" />
          {topics[selectedTopic].isTable
            ? 'جدول زمانبندی تسویه‌ها'
            : 'سوالات متداول'}
        </button>
        {topics[selectedTopic].isTable && (
          <div className="flex items-center rounded mb-7 py-5 px-10 bg-[#FBFAEB] text-[#8D5C1B]">
            <Danger size={42} />
            <p className="px-5">
              مشتری گرامی
              <br />
              تسویه های پایا از شنبه تا ۴ شنبه در ۳ چرخه انجام میپذیرد.در روزهای
              پنج شنبه و تعطیل پردازش انجام نمیپذیرد.
            </p>
          </div>
        )}
        <div className="flex gap-10 overflow-x-auto border-b pb-5 scrollbar-hide">
          {topics.map(
            (topic, index) =>
              (isAuthenticated || index === 3) && (
                <div
                  key={index}
                  onClick={() => setSelectedTopic(index)}
                  className={`border text-nowrap px-5 text-center py-3 rounded-lg cursor-pointer ${
                    selectedTopic === index ? 'bg-[#125AE3] text-white' : ''
                  }`}
                >
                  {topic.name}
                </div>
              )
          )}
        </div>

        <div className="flex flex-col mt-5">
          {!topics[selectedTopic].isTable ? (
            <div className="flex flex-col">
              {topics[selectedTopic].questions?.map((question, subIndex) => (
                <div key={subIndex} className="my-2">
                  <div
                    onClick={() => toggleAccordion(subIndex)}
                    className={`cursor-pointer font-bold flex items-center justify-between rounded-lg h-12 px-5 transition-colors ${
                      openAccordion.includes(subIndex)
                        ? 'bg-[#D9EDFF]'
                        : 'bg-white border border-[#D9EDFF]'
                    }`}
                  >
                    <div className="flex gap-5">
                      <Expand />
                      <span className="text-[#125AE3] font-medium">
                        {question.head}
                      </span>
                    </div>

                    <ArrowDown2
                      size="32"
                      className={`rounded-full p-1 transition-all duration-500 ease-in-out ${
                        openAccordion.includes(subIndex)
                          ? 'bg-[#2F27CE] text-white rotate-180'
                          : 'border-2 border-[#2F27CE] text-[#2F27CE]'
                      }`}
                    />
                  </div>

                  {openAccordion.includes(subIndex) && (
                    <div className="mt-2 py-5 mb-5 px-10 border border-[#C2D1FF] text-[#2F27CE] rounded-lg">
                      <span>{question.description}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Time table section
            <div className="flex flex-col">
              {topics[selectedTopic].timeTable?.map((timeGroup, subIndex) => (
                <div
                  key={subIndex}
                  className={`border border-[#E5E5E5] rounded-lg ${'my-2'}`}
                >
                  {/* Only the first item visible initially */}
                  {timeGroup.map((time, timeIndex) =>
                    timeIndex === 0 || openAccordion.includes(subIndex) ? (
                      <div
                        key={timeIndex}
                        onClick={() => toggleAccordion(subIndex)}
                        className={`cursor-pointer font-bold flex items-center justify-between w-full h-[8vh] ${
                          openAccordion.includes(subIndex) &&
                          timeGroup.length - 1 !== timeIndex &&
                          'border-b'
                        }`}
                      >
                        <div className="flex w-full h-full ">
                          <span
                            className={`flex items-center justify-center min-w-40 text-center bg-[#D9EDFF] text-[#125AE3] font-medium ${
                              openAccordion.includes(subIndex)
                                ? (timeIndex === 0 && 'rounded-tr-md') ||
                                  (timeIndex === timeGroup.length - 1 &&
                                    'rounded-br-md')
                                : timeIndex === 0 &&
                                  'rounded-tr-md rounded-br-md'
                            }`}
                          >
                            {time.head}
                          </span>
                          <span className="flex w-full items-center justify-center bg-white  text-black py-2">
                            {time.description}
                          </span>
                        </div>
                        {timeIndex === 0 && (
                          <ArrowDown2
                            size="18"
                            className={`ml-2 text-[#125AE3] transition-transform ${
                              openAccordion.includes(subIndex)
                                ? 'rotate-180'
                                : ''
                            }`}
                          />
                        )}
                      </div>
                    ) : null
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FAQ
