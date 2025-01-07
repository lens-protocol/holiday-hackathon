import { customAlphabet, nanoid } from 'nanoid';

export const generateOTP = (len: number) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < len; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const generateOrgCode = () => {
  const alphabet = '0123456789abcdef';
  const nanoid = customAlphabet(alphabet, 12);
  return nanoid();
};

export const generateInviteCode = () => {
  return nanoid();
};

export const generateRandomId = () => {
  return nanoid();
};

export const generateHotelId = () => {
  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, 10);
  const hotelId = `HTL${nanoid()}`;
  return hotelId;
};

export const generateReservationId = () => {
  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, 10);
  const resId = `RES${nanoid()}`;
  return resId;
};

export const generateBookingId = () => {
  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, 10);
  const resId = `BKNG${nanoid()}`;
  return resId;
};

export const generateInvoiceId = () => {
  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, 10);
  const resId = `INV${nanoid()}`;
  return resId;
};
