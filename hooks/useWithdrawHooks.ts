import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { create } from "zustand";

// import crypto from 'crypto';
const crypto = require('crypto');

const secretKey = "jnCeAJyBgDTJo4MPWHmzoL1wSRy6ZXKbVyy2MthFBv4Drt3yuxdZsSCgFIKYcFNrhWr59hXHvEoGkgKkX7Otx63rMbyIHdUEKO2caskuA0yNezbOSxrtcIuYFUFBZ4bxJk7r1ZFR6llzQnrEzrHBovHY3Stzeh1fWp9dLqabRoRnhjqclAY02PLrsjeFbBWrxf9FGDw0DiIFVq7Blw4ND9Xiy2xYirq8eSiaDKLzPIkYwHycrqBOpZxTXX6Arq1g";
const hmacKey = Buffer.from(secretKey, 'utf-8');

interface IWidhrawProps {
    amount: string;
    withdrawalType: 3 | number;
    customerMobile: string; // customer mobile
    shabaId: string; // shaba id (sid)
}

// تابع برای sign_verify_Withdrawal_order
const generateWidhrawSignature = ({ amount, withdrawalType, customerMobile, shabaId }: IWidhrawProps) => {
    const signString = `${customerMobile}#${withdrawalType}#${amount}#${shabaId}`;
    const stringToSign = Buffer.from(signString, 'utf-8');

    const sign = crypto.createHmac('sha512', hmacKey)
        .update(stringToSign)
        .digest('hex');

    return sign;
};

interface IShabaProps {
    acctype: 1 | number;
    shaba: string;
    mobile: string;
}

// تابع برای sign_create_shaba_destination
const generateShabaSignature = ({ mobile, shaba, acctype }: IShabaProps) => {
    const signString = `${mobile}#${shaba}#${acctype}`;
    const stringToSign = Buffer.from(signString, 'utf-8');

    const sign = crypto.createHmac('sha512', hmacKey)
        .update(stringToSign)
        .digest('hex');

    return sign;
};


interface IReceiptProps {
    acctype: "5" | null;
    mobile: string | RequestCookie | null;
    token: string | RequestCookie | null;
    amount: string | RequestCookie | null;
}
// تابع برای تایید گرفتن ساین و دریافت اطلاعات رسید تراکنش
const generateReceiptSignature = ({ token, amount, mobile, acctype }: IReceiptProps) => {
    const signString = `${token}#${amount}#${mobile}#${acctype}`;
    const stringToSign = Buffer.from(signString, 'utf-8');

    const sign = crypto.createHmac('sha512', hmacKey)
        .update(stringToSign)
        .digest('hex');

    return sign;
};

interface IWithdrawStepTwo {
    showWithdrawStepTwo: boolean;
    setShowWithdrawStepTwo: (value: boolean) => void;
}
export const useWithdrawStepTwo = create<IWithdrawStepTwo>((set) => ({
    showWithdrawStepTwo: false,
    setShowWithdrawStepTwo: (value: boolean) => set(() => ({
        showWithdrawStepTwo: value
    })),
}))

export {
    generateShabaSignature,
    generateWidhrawSignature,
    generateReceiptSignature
}