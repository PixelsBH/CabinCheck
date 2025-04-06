export const extractRollNo = (email) => {
  const regex = /^([a-zA-Z]+)(\d{2})(bcs|bec|bcy|bcd)(\d{1,3})@iiitkottayam\.ac\.in$/i;
  const match = email.match(regex);

  if (!match) return "Invalid Email";

  const year = `20${match[2]}`; // Extract year (e.g., 23 -> 2023)
  const program = match[3].toUpperCase(); // Extract program code and convert to uppercase
  const number = match[4].padStart(4, '0'); // Pad the number to 4 digits

  return `${year}${program}${number}`; // Construct roll number
};
