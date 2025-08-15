export const getDepartment = (email) => {
  const regex = /^([\w\d]+)(\d{2})(bcs|bec|bcy|bcd)(\d{1,3})@iiitkottayam\.ac\.in$/i;
  const match = email.match(regex);

  if (!match) return "Unknown Department";

  const program = match[3].toLowerCase(); 

  switch (program) {
    case "bcs":
      return "Computer Science and Engineering";
    case "bec":
      return "Electronics and Communication Engineering";
    case "bcy":
      return "Computer Science and Engineering with Specialisation in Cyber Security";
    case "bcd":
      return "Computer Science and Engineering with Specialisation in Artificial Intelligence and Data Science";
    default:
      return program;
  }
};