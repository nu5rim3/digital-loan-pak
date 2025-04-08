import { IStakeholder } from "../store/stakeholderStore";

export function getStakeholderByType(
  stkType: string,
  stakeholders: IStakeholder[]
): IStakeholder[] {
  return (
    stakeholders &&
    stakeholders.filter((stakeholder) => stakeholder.stkType === stkType)
  );
}
