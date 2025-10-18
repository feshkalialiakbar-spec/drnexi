'use client'
import { useState } from 'react'
import DatePicker from 'react-datepicker2'
import moment from 'moment-jalaali'

interface Props {
  setDate: (date: string) => void
}

const Calendar: React.FC<Props> = ({ setDate }) => {
  const [selectedDay, setSelectedDay] = useState<{
    value: moment.Moment | undefined
  }>({ value: undefined })

  return (
    <div className='flex justify-center'>
      <div className='w-full'>
        <DatePicker
          className='w-full'
          onChange={(value) => {
            setSelectedDay({ value })
            setDate(moment(value).format('jYYYY-jMM-jDD'))
          }}
          value={selectedDay.value}
          isGregorian={false}
          timePicker={false}
          removable
        />
      </div>
    </div>
  )
}

export default Calendar
