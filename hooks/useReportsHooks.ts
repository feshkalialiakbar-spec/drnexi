import { GetFilteredTransactionAll, ITransactionAll } from '@/services/reports'
import { create } from 'zustand'
import { getAccessToken } from './getAccessToken'

export interface ITransactionQueries {
  record_limit?: number
  record_skip?: number
  payer_name?: string
  mobile?: string
  pan?: string
  transaction_start_date?: string
  transaction_end_date?: string
  status?: number
  status_desc?: 'SUCCESS' | 'PENDING' | string
  amount_min?: number
  amount_max?: number
  ttype?: 1 | 2 | '' | 0
}

interface IReportsFilter {
  showReportsFilterModal: boolean
  setShowReportsFilterModal: (value: boolean) => void
  filteredQueries: ITransactionQueries
  setFilteredQueries: (value: ITransactionQueries) => void
  allData: ITransactionAll[]
  setAllData: (value: ITransactionAll[]) => void
  fetchFilteredData: (queries: ITransactionQueries) => void
}

export const useReportsFilterModal = create<IReportsFilter>((set) => ({
  showReportsFilterModal: false,
  setShowReportsFilterModal: (value: boolean) =>
    set(() => ({
      showReportsFilterModal: value,
    })),

  filteredQueries: {},
  setFilteredQueries: (value: ITransactionQueries) =>
    set((state) => ({
      filteredQueries: {
        ...state.filteredQueries,
        ...value,
      },
    })),

  allData: [],
  setAllData: (value: ITransactionAll[]) =>
    set(() => ({
      allData: value,
    })),
  fetchFilteredData: async (queries: ITransactionQueries) => {
    const accessToken = await getAccessToken()
    const response = await GetFilteredTransactionAll({ accessToken, queries })
    set({ allData: response })
  },
}))

interface IDepositWithdrawFilter {
  showDWFilterModal: boolean
  setShowDWFilterModal: (value: boolean) => void
  reportTab: number
  setReportTab: (value: number) => void
  filteredQueries: ITransactionQueries
  setFilteredQueries: (value: ITransactionQueries) => void
  depositData: ITransactionAll[]
  setDepositData: (value: ITransactionAll[]) => void
  fetchDepositData: (queries: ITransactionQueries) => void
  withdrawData: ITransactionAll[]
  setWithdrawData: (value: ITransactionAll[]) => void
  fetchWithdrawData: (queries: ITransactionQueries) => void
  allData: ITransactionAll[]
  setAllData: (value: ITransactionAll[]) => void
  fetchFilteredData: (queries: ITransactionQueries) => void
}

export const useDepositWithdrawFilter = create<IDepositWithdrawFilter>(
  (set) => ({
    showDWFilterModal: false,
    setShowDWFilterModal: (value: boolean) =>
      set(() => ({
        showDWFilterModal: value,
      })),

    reportTab: 1,
    setReportTab: (value: number) =>
      set(() => ({
        reportTab: value,
      })),

    filteredQueries: {},

    setFilteredQueries: (value: ITransactionQueries) =>
      set((state) => ({
        filteredQueries: {
          ...state.filteredQueries,
          ...value,
        },
      })),

    depositData: [],
    setDepositData: (value: ITransactionAll[]) =>
      set(() => ({
        depositData: value,
      })),
    fetchDepositData: async (queries: ITransactionQueries) => {
      const accessToken = await getAccessToken()
      const response = await GetFilteredTransactionAll({
        accessToken,
        queries: {
          ...queries,
          ttype: 1,
        },
      })
      set({ depositData: response })
    },

    withdrawData: [],
    setWithdrawData: (value: ITransactionAll[]) =>
      set(() => ({
        withdrawData: value,
      })),
    fetchWithdrawData: async (queries: ITransactionQueries) => {
      const accessToken = await getAccessToken()
      const response = await GetFilteredTransactionAll({
        accessToken,
        queries: {
          ...queries,
          ttype: 2,
        },
      })
      set({ withdrawData: response })
    },

    allData: [],
    setAllData: (value: ITransactionAll[]) =>
      set(() => ({
        allData: value,
      })),
    fetchFilteredData: async (queries: ITransactionQueries) => {
      const accessToken = await getAccessToken()
      const response = await GetFilteredTransactionAll({ accessToken, queries })

      set({ allData: response })
    },
  })
)
