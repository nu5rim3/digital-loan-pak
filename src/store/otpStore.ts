/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { APIAuth } from "../services/api";
import { notification } from "antd";

interface IOTPState {
  otpResponse: any | null;
  otpLoading: boolean;
  otpError: string | null;

  otpVerificationResponse: any | null;
  otpVerificationLoading: boolean;
  otpVerificationError: string | null;

  sendOTP: (idx: string) => Promise<void>;
  verifyOTP: (idx: string, code: string) => Promise<void>;
}

const useOTPStore = create<IOTPState>()(
  devtools(
    (set) => ({
      otpResponse: null,
      otpLoading: false,
      otpError: null,

      otpVerificationResponse: null,
      otpVerificationLoading: false,
      otpVerificationError: null,

      sendOTP: async (idx: string) => {
        set({ otpLoading: true, otpError: null });
        try {
          const response = await APIAuth.get(
            `/mobixCamsClientele/v1/clienteles/verifications/send-sms/${idx}`
          );
          set({ otpResponse: response.data, otpLoading: false });
          notification.success({
            message: "OTP Sent",
            description: "An OTP has been sent to your mobile number.",
          });
        } catch (error: any) {
          console.error(error);
          set({ otpError: error.message, otpLoading: false });
        }
      },

      verifyOTP: async (idx: string, code: string) => {
        set({ otpVerificationLoading: true, otpVerificationError: null });
        try {
          const response = await APIAuth.post(
            `/mobixCamsClientele/v1/clienteles/verifications/verify-sms`,
            { idx, code }
          );
          set({
            otpVerificationResponse: response.data,
            otpVerificationLoading: false,
          });
          notification.success({
            message: "OTP Verification",
            description: "OTP verification successful.",
          });
        } catch (error: any) {
          console.error(error);
          set({
            otpVerificationError: error.message,
            otpVerificationLoading: false,
          });
        }
      },
    }),
    { name: "OTPStore" }
  )
);

export default useOTPStore;
