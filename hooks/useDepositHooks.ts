import { IDepositForm } from '@/interfaces';
import { ICreateNewIPG } from '@/services/deposit';
import { create } from 'zustand'

interface IDepositInformation {
    depositInformation: IDepositForm | undefined;
    setDepositInformation: (value: IDepositForm) => void;
}
export const useDepositInformation = create<IDepositInformation>((set) => ({
    depositInformation: {
        amount: 0,
        cust_name: "",
        mobile: "",
        order_id: "",
        description: "",
    },
    setDepositInformation: (value: IDepositForm) => set(() => ({
        depositInformation: value
    })),
}))

interface IDepositPaymentData {
    paymentLinkData: ICreateNewIPG | undefined;
    setPaymentLinkData: (value: ICreateNewIPG) => void;
}
export const usePaymentLinkData = create<IDepositPaymentData>((set) => ({
    paymentLinkData: {
        payment_amount: 0,
        payment_url: "",
        status: "-1",
        token: ""
    },
    setPaymentLinkData: (value: ICreateNewIPG) => set(() => ({
        paymentLinkData: value
    })),
}))