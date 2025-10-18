import { create } from 'zustand'


interface IDepositForm {
  showDepositForm: boolean
  setShowDepositForm: (value: boolean) => void
}
export const useToggleDepositForm = create<IDepositForm>((set) => ({
  showDepositForm: true,
  setShowDepositForm: (value: boolean) =>
    set(() => ({
      showDepositForm: value,
    })),
}))

interface IWithdrawForm {
  shebaNumber?: string
  shebaId?: string
  shebaUsername?: string
  bankName?: string
  amount?: number
  description?: string | null
  bankCode?:string
}
type IKeepWithdrawFormData = {
  withdrawForm: IWithdrawForm
  setWithdrawForm: (value: IWithdrawForm) => void
}
export const useKeepWithdrawFormData = create<IKeepWithdrawFormData>((set) => ({
  withdrawForm: {
    shebaNumber: '',
    shebaId: '',
    bankName: '',
    shebaUsername: '',
    amount: 0,
    description: '',
    bankCode:''
  },
  setWithdrawForm: (value: IWithdrawForm) =>
    set(() => ({
      withdrawForm: value,
    })),
}))
