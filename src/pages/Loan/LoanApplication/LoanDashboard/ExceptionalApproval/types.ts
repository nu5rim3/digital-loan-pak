import * as yup from "yup";

export interface ExceptionalApprovalFormData {
  exceptionalApprovalCategory: string;
  approvePerson: string;
  remark: string;
}

export const schema = yup.object().shape({
  exceptionalApprovalCategory: yup
    .string()
    .required("Exceptional Approval Method is required"),
  approvePerson: yup.string().required("Approve Person is required"),
  remark: yup.string().required("Comment is required"),
});

export interface ExceptionalApprovalRecord {
  idx: string;
  appraisalIdx: string;
  type: string;
  category: string;
  categoryDec: string;
  remark: string;
  roleCode: string;
  role: string;
  status: string;
  createdBy: string;
  creationDate: number;
  lastModifiedBy: string;
  lastModifiedDate: number;
  actionPerson: string | null;
  actionDate: number | null;
  comments: string | null;
}

export interface ExceptionalApprovalPersonResponse {
  code: string;
  description: string;
  status: string;
  exceptionalApprovalRoles: Array<{
    role: {
      code: string;
      description: string;
      status: string;
      roleName: string;
    };
    description: string;
    status: string;
  }>;
} 

export interface ExceptionalApprovalRole {
  role: Role;
  description: string;
  status: string;
}

export interface Role {
  code: string;
  description: string;
  status: string;
  roleName: string;
  createdBy?: string;
  creationDate?: string;
}