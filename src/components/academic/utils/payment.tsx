export const getPaymentPlan = (plan: string) => {
  if (!plan) return plan;
  
  const planLower = plan.toLowerCase().trim();
  
  switch (planLower) {
    case "lumpsum":
      return "Lump Sum";
    case "installment":
      return "Installment";
    default:
      // Return original if it doesn't match, or capitalize first letter
      return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
  }
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

