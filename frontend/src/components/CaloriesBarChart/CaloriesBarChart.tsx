import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export interface DailyCalories {
  date: string;
  totalCalories: number;
}

export const CaloriesBarChart: React.FC<{ data: DailyCalories[] }> = ({
  data,
}) => {
  return (
    <BarChart
      width={document.body.querySelector(".app")?.clientWidth as number}
      height={300}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="totalCalories" fill="#8884d8" />
    </BarChart>
  );
};
