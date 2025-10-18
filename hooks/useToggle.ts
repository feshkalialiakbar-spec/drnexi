import { create } from 'zustand';

interface IOtpForm {
    showOtpForm: boolean;
    setShowOtpForm: (value: boolean) => void;
}
export const useToggleOtpForm = create<IOtpForm>((set) => ({
    showOtpForm: false,
    setShowOtpForm: (value: boolean) => set(() => ({
        showOtpForm: value
    })),
}))


interface IToggleSignupOtp {
    signupOTPForm: boolean;
    setSignupOTPForm: (value: boolean) => void;
}
export const useToggleSignupOtp = create<IToggleSignupOtp>((set) => ({
    signupOTPForm: false,
    setSignupOTPForm: (value: boolean) => set(() => ({
        signupOTPForm: value
    })),
}))