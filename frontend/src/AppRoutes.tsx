import { useQueryClient } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router";
import { Metrics } from "./pages/Metrics/Metrics";
import { Home } from "./pages/Home/Home";
import { Plan } from "./pages/Home/Plan";

import gainImg from "./common_imgs/gain.png";
import balanceImg from "./common_imgs/balance.png";
import runImg from "./common_imgs/run.png";
import { Header } from "./components/Header/Header";
import { AddTrainingPage } from "./pages/addPages/AddTrainingPage";
import { AddFoodPage } from "./pages/addPages/AddFoodPage";
import { Nav } from "./components/nav/Nav";
import { ProfilePage } from "./pages/profilePage/ProfilePage";
import { Notifications } from "./components/Notifications/Notifications";
import Wall from "./pages/Wall/Wall";
import { SearchPage } from "./pages/Search/SearchPage";

export interface userInterface {
  username: string;
  weight?: number;
  height?: number;
  age?: number;
  sex?: "male" | "female";
  imt?: number;
  calorieGoal?: number;
  friends?: string[];
}

export interface userPlan {
  title: string;
  img: string;
  text?: string;
}

export const AppRoutes = () => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<{ data: userInterface }>(["authUser"]);
  const user = data?.data;
  const planChoice = (imt: number): userPlan | undefined => {
    if (imt <= 18.5)
      return {
        title: "Набір ваги",
        img: gainImg,
        text: "Ваш індекс маси тіла нижче норми! Встановлена ціль в калоріях для набору маси.",
      };
    if (imt > 18.5 && imt <= 24.9)
      return {
        title: "Підтримання ваги",
        img: balanceImg,
        text: "Ваш індекс маси тіла в нормі! Обрано план для пітримання ваги. ",
      };
    if (imt > 24.9)
      return {
        title: "Схуднення",
        img: runImg,
        text: "Ваш індекс маси тіла вище норми! Встановлена ціль в калоріях для схудення.",
      };
  };
  const plan = planChoice(user?.imt as number);
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            user?.weight ? (
              <Home plan={{ title: plan?.title as string }} />
            ) : (
              <Navigate to={"/metrics"} />
            )
          }
        />
        <Route path="/metrics" element={<Metrics />} />
        <Route
          path="/plan"
          element={<Plan imt={user?.imt as number} plan={plan as userPlan} />}
        />
        <Route path="/add-training" element={<AddTrainingPage />} />
        <Route path="/add-food" element={<AddFoodPage />} />
        <Route path="/user/:username" element={<ProfilePage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <Nav />
    </>
  );
};
