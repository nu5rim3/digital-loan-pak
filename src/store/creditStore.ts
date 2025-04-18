import { create } from "zustand";
import { API, APIAuth } from "../services/api";
import { notification } from "antd";

export interface IGoldLoanAppArticleDetails {
  articleDtls: string;
  articleQuantity: string;
  articleStatus: string;
  masterArticleCode: string;
}

export interface IGoldLoanAppDetails {
  appIdx?: string;
  id?: string;
  tppNumber: string;

  goldLoanAppType: string | "GOD" | "DEN";

  goldsmithIdFx?: string;
  goldCollateralValue?: string;
  goldGrossWeight?: string;
  goldLoanAppArticleDtlsDtoList?: IGoldLoanAppArticleDetails[] | null;
  goldMarketValue?: string;
  goldNetWeight?: string;

  denCollateralValue?: string;
  denGrossWeight?: string;
  denMarketValue?: string;
  denNetWeight?: string;

  loanAppStatus?: string | "A" | "I";
}

interface IGoldLoanState {
  goldLoanAppDetails: IGoldLoanAppDetails[];
  goldLoanAppDetailsLoading: boolean;
  goldLoanAppDetailsError: string | null;

  fetachGoldLoanAppDetails: (appId: string) => Promise<void>;
  addGoldLoanAppDetails: (data: IGoldLoanAppDetails) => Promise<void>;
  updateGoldLoanAppDetails: (
    goldId: string,
    data: IGoldLoanAppDetails
  ) => Promise<void>;
}

const useCreditStore = create<IGoldLoanState>((set) => ({
  goldLoanAppDetails: [],
  goldLoanAppDetailsLoading: false,
  goldLoanAppDetailsError: null,

  fetachGoldLoanAppDetails: async (appId: string) => {
    set({ goldLoanAppDetailsLoading: true });
    try {
      const response = await API.get(
        `/mobixCamsCredit/v1/gold-loan/${appId}/appraisalId`
      );
      set({
        goldLoanAppDetails: response.data,
        goldLoanAppDetailsLoading: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        goldLoanAppDetailsError: error.message,
        goldLoanAppDetailsLoading: false,
      });
    }
  },

  addGoldLoanAppDetails: async (data: IGoldLoanAppDetails) => {
    set({ goldLoanAppDetailsLoading: true });
    try {
      APIAuth.post("/mobixCamsCredit/v1/gold-loan", data);
      set(() => ({
        goldLoanAppDetailsLoading: false,
      }));
      notification.success({
        message: "Gold Facility Application Details Added Successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        goldLoanAppDetailsError: error.message,
        goldLoanAppDetailsLoading: false,
      });
    }
  },

  updateGoldLoanAppDetails: async (
    goldId: string,
    data: IGoldLoanAppDetails
  ) => {
    set({ goldLoanAppDetailsLoading: true });
    try {
      await APIAuth.put(`/mobixCamsCredit/v1/gold-loan/${goldId}`, data);
      set(() => ({
        goldLoanAppDetailsLoading: false,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        goldLoanAppDetailsError: error.message,
        goldLoanAppDetailsLoading: false,
      });
    }
  },
}));

export default useCreditStore;
