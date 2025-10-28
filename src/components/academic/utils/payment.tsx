export const getPaymentPlan = (plan: string) => {
  let paymentPlan;

  switch (plan) {
    case "lumpsum":
      paymentPlan = "Lumpsum";
      break;
    case "installment":
      paymentPlan = "Installment";
      break;
    default:
      break;
  }

  return paymentPlan;
};

export const getPaymentMethod = (method: string) => {
  let paymentMethod;

  switch (method) {
    case "bank-transfer":
      paymentMethod = "Bank Transfer";
      break;
    case "pos":
      paymentMethod = "POS";
      break;
    case "cash":
      paymentMethod = "Cash";
      break;
    default:
      break;
  }

  return paymentMethod;
};

export const getPaymentType = (type: string) => {
  let paymentType;

  switch (type) {
    case "monthly":
      paymentType = "Monthly";
      break;
    case "bi-monthly":
      paymentType = "Bi-Monthly";
      break;
    case "quarterly":
      paymentType = "Quarterly";
      break;
    default:
      break;
  }

  return paymentType;
};
