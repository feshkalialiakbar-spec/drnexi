export interface IUserResponse {
  customer_status: string
  mobile: string
  first_name: string
  last_name: string
  full_name: string
  customer_code: string
  role: string
  approve_status: number
  uid: number
  cid: number,
  user_approve: number
  customer_approve: number
  user_status: string
  user_role_id: number
  role_type: number
  role_count: number
}

export interface IAddShabaSchema {
  title: string
  acctype: 1
  mobile: string
  shaba: string
  fullname: string
  Signature: string
}

export interface ITotalBalance {
  user_uid: string
  remain: string
}

export interface IAccountDetail {
  user_uid: string
  remain: string
  amount: string
  transaction_cost: string
  wage_cost: string
  transactionDate_pe: string
  transactionTime: string
  pan: string
  tstatus: string
  transactionType: string
}
export interface UserRoles {
  friendly_name: string
  user_role_id: number
  role_name: string
  status_id: number
  status_desc: string
  due_date: string
  description: string | null
  clevel: number
  customer_name: string
}

export interface IDepositForm {
  mobile: string
  cust_name: string
  amount: number
  order_id: string
  description?: string
  ref_order_id?: string
}
export type IWithdrawFormSchema = {
  target_id: string
  shaba_number: string
  amount: number
  description?: string
  Signature: string
}

export interface IShebaButtonItem {
  avatar: string
  username: string
  shabaNumber: string
  shabaId: string
  isDraggable?: boolean
  bankCode?: string
  bankName?: string
}
export interface IWalletBalance {
  username: string
  walletName: string
  showUsername?: boolean
  showBackBtn?: boolean
  flexType?: 1 | 2
  lastLoginDate?: string
  lastLoginTime?: string
  accessToken: string
}
export interface ReferralList {
  cust_id: number
  customer_code: string
  subsys_id: number
  approve: number
  status: string
  customer_name: string
  customer_approve: number
  customer_status: string
  customers_dep_status_wsb: number
}
