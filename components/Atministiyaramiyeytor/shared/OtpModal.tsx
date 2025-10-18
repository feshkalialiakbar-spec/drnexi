import { useEffect, useState } from "react";
import { CloseSquare, Warning2 } from "iconsax-react";
import OTPInput from "./OTPinput"; 
import { getCookieByKey } from "@/actions/cookieToken";
import toast from "react-hot-toast";
import { SendWithdrawOtp } from "../services/withdraw";

const OtpModal = ({
  setOtp,
  close,
  title,
  submit,
  manageruid,
}: {
  setOtp: (value: string) => void;
  close: () => void;
  title: string;
  submit: () => void;
  manageruid: string;
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // setShowSendOtpButton(true)
    }
  }, [timeLeft]);

  const sendOtp = async () => {
    const accessToken = (await getCookieByKey("access_token")) || "";
    await SendWithdrawOtp({
      accessToken,
      manageruid: manageruid,
    }).then(() => toast.success("کد ارسال شد"));
  };
  return (
    <div
      className="fixed inset-0 flex justify-center items-center "
      style={{ zIndex: "50" }}
    >
      {/* بک‌دراپ */}
      <div className="absolute bg-slate-600 opacity-50 w-full h-full z-40 top-0 right-0"></div>
      {/* جعبه مودال */}
      <div className="p-10 rounded-lg max-md:w-[100%] w-[40vw] z-50 right-side-animate bg-white border border-gray-300 shadow-lg transition-transform duration-700 ease-in-out">
        {/* هدر مودال */}
        <div className="flex justify-between items-center w-full text-xl font-medium text-right text-gray-800 max-md:max-w-full">
          <div className="flex-1 shrink self-stretch my-auto min-w-[240px] max-md:max-w-full">
            {title}
          </div>
          <CloseSquare
            size={24}
            cursor="pointer"
            color="#50545F"
            onClick={close}
          />
        </div>
        <div className="flex justify-center mb-5">
          <Warning2 variant="Bold" size={44} color="#cda125" />
        </div>
        {/* نمایش Progress Bar در صورت وجود autoClose */}
        <div className="flex flex-col gap-4">
          <p>
            اگر نسبت به ثبت نهایی مطمئن هستید کد دریافتی را در قسمت پایین وارد
            کنید
          </p>
          <OTPInput setResult={setOtp} />
          <div className="flex gap-4">
            <button
              className="w-full h-10 mt-10 border-button rounded-lg hover:bg-purple-100"
              onClick={async () => {
                sendOtp();
                setTimeLeft(76);
              }}
            >
              {timeLeft === 0 ? (
                "ارسال کد تایید"
              ) : (
                <p className="text-amber-700">
                  {Math.floor(timeLeft / 60)}:
                  {("0" + (timeLeft % 60)).slice(-2)}
                </p>
              )}
            </button>
            <button
              className="w-full h-10 mt-10 fill-button rounded-lg hover:bg-purple-800"
              onClick={submit}
            >
              ثبت نهایی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;