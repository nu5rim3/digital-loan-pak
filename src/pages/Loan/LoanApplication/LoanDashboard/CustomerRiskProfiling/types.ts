import { UseFormReturn } from "react-hook-form";

export interface CustomerRiskProfilingFormData {
  id?: number;
  customerType: string;
  deliveryChannel: string;
  mandate: string;
  educationQualification: string;
  product: string;
  sourceOfFund: string;
  expectedMonthlyCreditTurnover: string;
  expectedMonthlyTransaction: string;
  geographyLocation: string;
  residentStatus: string;
}

export interface CustomerRiskProfilingProps {
  mode: "save" | "update" | "remove";
  isModalOpen: boolean;
  closeModal: () => void;
  formMethods: UseFormReturn<CustomerRiskProfilingFormData>;
  onSubmit: (data: CustomerRiskProfilingFormData) => Promise<void>;
  onRemove?: (data: CustomerRiskProfilingFormData) => Promise<void>;
} 