/* eslint-disable @typescript-eslint/no-explicit-any */
export function calculateLoanStats(data: any) {
  if (!Array.isArray(data)) {
    console.warn("calculateLoanStats: Expected an array but received", data);
    return {
      numberOfPreviousLoans: 0,
      numberOfActiveLoans: 0,
      activeLoansAmount: 0,
      activeOutstanding: 0,
      overdue: 0,
      activeInstallmentValue: 0,
      arrearsAmount: 0,
    };
  }

  // Number of previous loans (all valid loans except cancelled)
  const numberOfPreviousLoans = data.length;

  // Filter active loans (totalDues > 0)
  const activeLoans = data.filter((loan: any) => Number(loan.totalDues) > 0);

  // Number of active loans
  const numberOfActiveLoans = activeLoans.length;

  // Total active loan amount (sum of leasedValue where totalDues > 0)
  const activeLoansAmount = activeLoans.reduce(
    (sum: number, loan: { leasedValue: any }) => sum + Number(loan.leasedValue),
    0
  );

  // Total active outstanding (sum of totalDues + overdueInterest where totalDues > 0)
  const activeOutstanding = activeLoans.reduce(
    (sum: number, loan: { totalDues: any; overdueInterest: any }) =>
      sum + (Number(loan.totalDues) + Number(loan.overdueInterest)),
    0
  );

  // Total Overdue (sum of all totalDues where totalDues > 0)
  const overdue = activeLoans.reduce(
    (sum: number, loan: { totalDues: any }) => sum + Number(loan.totalDues),
    0
  );

  // Total active installment amount (sum of currentRent where totalDues > 0)
  const activeInstallmentValue = activeLoans.reduce(
    (sum: number, loan: { currentRent: any }) => sum + Number(loan.currentRent),
    0
  );

  // Arrears amount = future rent
  const arrearsAmount = activeLoans.reduce(
    (sum: number, loan: { futureRent: any }) => sum + Number(loan.futureRent),
    0
  );

  return {
    numberOfPreviousLoans,
    numberOfActiveLoans,
    activeLoansAmount,
    activeOutstanding,
    overdue,
    activeInstallmentValue,
    arrearsAmount,
  };
}

export function specialChargesByCode(code: string): string {
  const specialCharges: { [key: string]: string } = {
    A: "Amount with Max/Min",
    A1: "Amount without Max/Min",
    P: "Percentage with Max/Min",
    P1: "Percentage without Max/Min",
    S: "Amount with Selection",
    S1: "Percentage with Selection",
  };
  return specialCharges[code] || "Unknown Charge";
}
