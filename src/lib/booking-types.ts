export type BookingTimeRange = {
  startHour: string;
  endHour: string;
};

export type BookingContact = {
  fullName: string;
  phone: string;
};

export type BookingPayload = BookingTimeRange &
  BookingContact & {
    /** yyyy-MM-dd */
    dateIso: string;
  };
