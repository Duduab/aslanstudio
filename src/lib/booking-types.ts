export type PaymentId = "card" | "bit" | "cash";

export type BookingTimePayment = {
  startHour: string;
  endHour: string;
  payment: PaymentId;
};

export type BookingContact = {
  fullName: string;
  email: string;
  phone: string;
};

export type BookingPayload = BookingTimePayment &
  BookingContact & {
    /** yyyy-MM-dd */
    dateIso: string;
  };

export const PAYMENT_LABELS: Record<PaymentId, string> = {
  card: "כרטיס אשראי",
  bit: "ביט",
  cash: "מזומן בצילום",
};
