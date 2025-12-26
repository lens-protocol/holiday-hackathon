export const getMaskedEmail = (email: string) => {
  const isLongEmail = email.split('@')[0].length > 8 ? true : false;
  if (!isLongEmail) {
    return email.replace(
      /^(.)(.*)(.@.*)$/,
      (_, a, b, c) => a + b.replace(/./g, '*') + c,
    );
  }
  return email.replace(
    /^(..)(.*)(..@.*)$/,
    (_, a, b, c) => a + b.replace(/./g, '*') + c,
  );
};

export const getMaskedPhoneNumber = (phoneNumber: string) => {
  // TODO: Use libphonenumber to get better masking
  return phoneNumber.replace(
    /^(..)(.*)(..)$/,
    (_, a, b, c) => a + b.replace(/./g, '*') + c,
  );
};
