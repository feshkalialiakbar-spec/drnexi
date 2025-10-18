'use client'
import { Export } from 'iconsax-react'
import React, { useState } from 'react'
import { getCookieByName } from '@/hooks/getToken'
import Loading from './LoadingSpinner'

const ExcelGenerator = ({ rows }: { rows: any[] }) => {
  const [loading, setLoading] = useState(false)

  const generateExcel = async () => {
    setLoading(true)
    const role = await getCookieByName('role')
    const requestData = {
      role,
      rows,
      font: { name: 'Calibri', size: 12 },
      headerBgColor: '2F27CE',
      cellBgColor: 'FFFFFF',
      headerFontColor: 'FFFFFF',
      cellFontColor: '2F27CE',
      columnWidths: [20, 10, 30],
    }

    try {
      const response = await fetch('/api/GenerateCustomExcel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report${new Date().toString().split(' G')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        console.error('Failed to generate Excel')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Export onClick={generateExcel} size='24' color='#2f27ce' />
      )}
    </div>
  )
}

export default ExcelGenerator
