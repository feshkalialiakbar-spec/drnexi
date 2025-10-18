'use client'

import { ITransactionAll } from '@/services/reports'
import TransactionRowItem from '../../wallet/TransactionRowItem'
import { useState } from 'react'

const Reports = ({
  withdrawData,
  type,
}: {
  withdrawData: ITransactionAll[] | undefined
  type: string
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 20
  const totalPages = withdrawData
    ? Math.ceil(withdrawData.length / itemsPerPage)
    : 1
  const currentData = Array.isArray(withdrawData)
    ? withdrawData?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : []

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Pagination logic to show only 10 pages at a time
  const generatePagination = () => {
    const pages = []
    const maxVisiblePages = 7
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (startPage > 1) {
      pages.push(1) // First page
      if (startPage > 2) {
        pages.push('...') // Show '...' after the first page
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...') // Show '...' before the last page
      }
      pages.push(totalPages) // Last page
    }

    return pages
  }

  const pagination = generatePagination()

  return (
    <>
      {currentData?.length
        ? currentData?.map((report, index) => (
            <TransactionRowItem
              key={index}
              originalAmount={report?.originalAmount || ''}
              pan={report?.pan || ''}
              remain={''}
              transactionDate_pe={report?.transactionDate_pe || ''}
              transactionTime={report?.transactionTime || ''}
              tstatus={`${report.status}` || ''}
              transaction_cost={report.transaction_cost || ''}
              amount={report.amount || ''}
              description={report.description || ''}
              user_uid={report?.pan_name || ''}
              transaction_code={report.transaction_code || '0'}
              wage_cost={report?.wage_cost || ''}
              ttype={Number(report?.ttype)}
              mobile={report?.mobile}
              
            />
          ))
        : type && <p>{type} ثبت نشده است.</p>}
      <div className='flex w-[100%] justify-center items-center  my-6'>
        {pagination?.map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              className={`px-2 mx-2  rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => handlePageChange(page)}>
              {page}
            </button>
          ) : (
            <span key={index} className='px-4 py-2'>
              {page}
            </span>
          )
        )}
      </div>
    </>
  )
}

export default Reports
