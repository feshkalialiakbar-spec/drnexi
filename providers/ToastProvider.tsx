"use client"

import { Toaster } from "react-hot-toast"

const ToastProvider = () => {
    return (
        <Toaster
            toastOptions={{
                duration: 4000,
                position: "top-center",
                style: {
                    padding: "0.5rem 0.75rem",
                    fontSize: "1rem",
                    fontWeight: "500",
                    maxWidth: "480px"
                }
            }}
        />
    )
}

export default ToastProvider