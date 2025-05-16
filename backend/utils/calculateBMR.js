export const calculateBMR = (user) => {
  if (user.sex === "male")
    return 66 + 13.7 * user.weight + 5 * user.height - 6.8 * user.age;
  if (user.sex === "female")
    return 655 + 9.6 * user.weight + 1.8 * user.height - 4.7 * user.age;
  return 0;
};
