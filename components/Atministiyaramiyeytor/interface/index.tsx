export interface UserInterface {
  userName: string;
  mobile: string;
  date: string;
  time: string;
  status: number;
  application: string;
  role: string;
}
export interface UserTransaction {
  appName: string; // نام اپلیکیشن
  transactionId: string; // شناسه‌واریز
  documentNumber: string; // شماره سند
  billTransactionId: string; // شماره تراکنش قبض
  systemTransactionId: string; // شماره تراکنش سیستم
  transactionDate: string; // تاریخ تراکنش
  transactionTime: string; // ساعت تراکنش
  amount: string; // مبلغ
  ibanOrCardNumber: string; // شماره شبا/کارت
  payer: string; // پرداخت‌کننده
  payerMobile: string; // موبایل پرداخت‌کننده
  withdrawalType: string; // نوع برداشت
  customer: string; // مشتری
  ttype: number;
}

export interface PosInterface {
  id: string;
  name: string;
  customer: string;
  date: string;
  time: string;
  serviceProvider: string;
}
export interface CustomerList {
  customer_code: string;
  customer_name: string;
  customer_account: string;
  manager_uid: string;
}
export interface IUserResponse {
  customer_status: string;
  mobile: string;
  first_name: string;
  last_name: string;
  full_name: string;
  customer_code: string;
  role: string;
  approve_status: number;
  uid: number;
  user_approve: number;
  customer_approve: number;
  user_status: string;
  user_role_id: number;
  role_count: number;
}

export interface ShebaListScheme {
  sid: string;
  sdcode: string;
  sdtitle: string;
  mobile: string;
  shaba: string;
  bank_code: string;
  bank_name: string;
  bid_code: string;
  fullname: string;
}
