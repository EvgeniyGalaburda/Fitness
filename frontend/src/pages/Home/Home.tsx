import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { userInterface } from "../../AppRoutes";
import { UserRow } from "../../components/UserRow/UserRow";
import axios from "axios";
import { TodayLists } from "../../components/TodayLists/TodayLists";

export const Home: React.FC<{ plan: { title: string } }> = ({ plan }) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<{ data: userInterface }>(["authUser"]);
  const user = data?.data;

  const { data: responseT } = useQuery({
    queryKey: ["todayTrainings"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/trainings/today-info",
          { withCredentials: true }
        );
        return res;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });

  const { data: responseF } = useQuery({
    queryKey: ["todayFood"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/food/today-info",
          { withCredentials: true }
        );
        return res;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });

  const userTodayTrainings = responseT?.data.userTodayTrainings || [];
  const amountOfCaloriesT = responseT?.data.amountOfCalories || 0;

  const userTodayFood = responseF?.data.userFoodToday || [];
  const amountOfCaloriesF = responseF?.data.amountOfCalories || 0;

  return (
    <div style={{ color: "#fff" }}>
      <UserRow
        plan={plan.title}
        user={user as userInterface}
        tCalories={amountOfCaloriesT}
        fCalories={amountOfCaloriesF}
      />
      <TodayLists trainings={userTodayTrainings} food={userTodayFood} />
    </div>
  );
};
