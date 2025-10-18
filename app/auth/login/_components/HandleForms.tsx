"use client"

import { useToggleOtpForm } from "@/hooks/useToggle";
import LoginForm from "./LoginForm";
import OtpForm from "./OtpForm";

const HandleForms = () => {
    const { showOtpForm } = useToggleOtpForm();

    return (
        <>
            {showOtpForm ? <OtpForm /> : <LoginForm />}
        </>
    );
}

export default HandleForms;