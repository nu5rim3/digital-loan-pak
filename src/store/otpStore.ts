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
  verifyOTP: (idx: string, code: string) => Promise<boolean>;
  restOtpVerificationResponse: () => void;
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
          return true; // Indicate success
        } catch (error: any) {
          let errorMessage = "Something went wrong. Please try again.";
          if (error.response) {
            if (error.response.status === 400) {
              // Custom message for invalid OTP
              errorMessage =
                error.response.data?.message ||
                "The OTP you entered is incorrect. Please try again.";
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            }
          }
          set({
            otpVerificationError: errorMessage,
            otpVerificationLoading: false,
          });
          console.error(error);
          return false; // Indicate failure
        }
      },
      restOtpVerificationResponse: () => {
        set({ otpVerificationResponse: null });
      },
    }),
    { name: "OTPStore" }
  )
);

export default useOTPStore;
