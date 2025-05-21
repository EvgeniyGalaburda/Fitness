export const calculateDailyCalories = (trainings) => {
  const dailyCalories = {};

  trainings.forEach((training) => {
    const createdAtDate = new Date(training.createdAt);
    const userTimeZoneOffsetMinutes = createdAtDate.getTimezoneOffset();
    const localDate = new Date(
      createdAtDate.getTime() - userTimeZoneOffsetMinutes * 60 * 1000
    )
      .toISOString()
      .split("T")[0];

    const calories = training.calories || 0;

    dailyCalories[localDate] = (dailyCalories[localDate] || 0) + calories;
  });

  return Object.keys(dailyCalories)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map((date) => ({ date, totalCalories: dailyCalories[date] }));
};
