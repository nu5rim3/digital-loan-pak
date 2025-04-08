/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { API, APIAuth } from "../services/api";

interface IOTPResponse {
  idx: string;
  status: string;
  code: string;
}

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

const useOTPStore = create<IOTPState>((set) => ({
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      set({
        otpVerificationError: error.message,
        otpVerificationLoading: false,
      });
    }
  },
}));

export default useOTPStore;
