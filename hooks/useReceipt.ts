import { create } from 'zustand'

export interface IReceiptParams {
  hasRecapture?:boolean
  user_uid?: string // نام کاربر
  amount: string // مقدار
  remain?: string // موجودی بعد از مقدار
  wage_cost?: string // هزینه کارمزد
  tstatus?:string
  pan?: string // شماره کارت
  pan_name?: string
  transactionDate_pe?: string // تاریخ تراکنش
  transactionTime?: string // ساعت تراکنش
  transaction_code?: string
  transaction_cost?: string
  originalAmount?: string
  ttype: number | string
  description?: string
  withdrawal_address?: string // آدرس شبا/کارت مقصد
  tracking_number?: string // کد پیگیری
  avatarUrl?: string // عکس آواتار
  mobile?:string
  ref_id?:string
}

interface ToggleType {
  receiptData: IReceiptParams | null
  setReceiptData: (data: IReceiptParams) => void
} 

export const useKeepReceiptData = create<ToggleType>((set) => ({
  receiptData: null,
  setReceiptData: (data: IReceiptParams) => set({ receiptData: data }),
  fetchReceiptData: async () => {
    try {
      // Replace this with your actual data fetching logic
      const response = await fetch('/api/receipt') // Example API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch receipt data')
      }
      const data: IReceiptParams = await response.json()
      set({ receiptData: data })
    } catch (error) {
      console.error('Error fetching receipt data:', error)
      set({ receiptData: null }) // Optionally reset receiptData on error
    }
  },
}))

// export const useKeepReceiptData = create<ToggleType>((set) => ({
//   receiptData: null,
//   setReceiptData: (data: IReceiptParams) =>
//     set(() => ({
//       receiptData: data,
//     })),
// }))
