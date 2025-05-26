import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { UserRow } from "../../components/UserRow/UserRow";
import type { userInterface } from "../../AppRoutes";
import Button from "../../components/Buttons/Button";
import {
  TrainingRow,
  type Training,
} from "../../components/TodayLists/TodayLists";
import { groupByDate } from "../../util/groupByDate";
import { CaloriesBarChart } from "../../components/CaloriesBarChart/CaloriesBarChart";

import style from "./ProfilePage.module.css";
import { Toaster } from "react-hot-toast";
import { useFriendRequest } from "../../hooks/useFriendRequest";

export const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const sendFriendRequest = useFriendRequest();

  //Користувач
  const {
    data: user,
    isLoading: isLoadingU,
    isError,
  } = useQuery({
    queryKey: ["someUser", username],
    queryFn: async ({ queryKey }) => {
      const [_, userToFetch] = queryKey;
      try {
        const res = await axios.get(`/api/user/getUser/${userToFetch}`, {
          withCredentials: true,
        });
        return res.data;
      } catch (error) {
        console.error("Користувача не знайдено!");
      }
    },
    retry: false,
  });

  //Тренування користувача
  const { data: userTrainings, isLoading: isLoadingT } = useQuery({
    queryKey: ["userTrainings", username],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/api/trainings/all-trainings?username=${username}`,
          { withCredentials: true }
        );
        return res.data || [];
      } catch (error) {
        console.error("Виникла помилка в пошуку тренувань");
      }
    },
    retry: false,
  });

  //Статистика користувача
  const { data: statisticT } = useQuery({
    queryKey: ["statistic", username],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `/api/trainings/statistic?username=${username}`,
          { withCredentials: true }
        );
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });

  //Авторизований коричтувач
  const me = queryClient.getQueryData<{
    data: { username: string; _id: string; friendRequests: string[] };
  }>(["authUser"]);

  if (isError)
    return <h1 style={{ color: "#fff" }}>Користувача не знайдено</h1>;
  if (isLoadingU || isLoadingT)
    return <h1 style={{ color: "#fff" }}>Завантаження...</h1>;

  const groupedTraining = groupByDate(userTrainings);

  const isFriend = user.friends.some(
    (f: string | undefined) => f === me?.data._id
  );
  const isFriendRequest = me?.data.friendRequests.some(
    (r: string | undefined) => r === user._id
  );
  const isFriendRequestReverse = user.friendRequests.some(
    (r: string | undefined) => r === me?.data._id
  );

  return (
    <div className={style.page}>
      <UserRow user={user as userInterface} />

      {isFriend || username === me?.data.username ? (
        <>
          <div className={style.mainContent}>
            <div className={style.bio}>
              <div className={style.bioRow}>
                <h3>Ріст</h3> <h3>{user.height}см</h3>{" "}
              </div>
              <div className={style.bioRow}>
                <h3>Вага</h3> <h3>{user.weight}кг</h3>{" "}
              </div>
              <div className={style.bioRow}>
                <h3>Вік</h3> <h3>{user.age}</h3>{" "}
              </div>
              <div className={style.bioRow}>
                <h3>Стать</h3>{" "}
                {(user.sex === "male" && <h3>Чоловік</h3>) ||
                  (user.sex === "female" && <h3>Жінка</h3>)}{" "}
              </div>
              {me?.data.username === user.username && (
                <Button onClick={() => navigate("/metrics")}>
                  Змінити дані
                </Button>
              )}
            </div>
            <div className={style.history}>
              <h2>Історія тренувань</h2>
              <div className={style.historyContent}>
                {Object.keys(groupedTraining).map((k, i) => (
                  <div key={i}>
                    <h2>{k}</h2>
                    {groupedTraining[k].map((t, i) => (
                      <TrainingRow t={t as unknown as Training} key={i} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={style.chart}>
            <h1>Графік тренувань</h1>
            <CaloriesBarChart data={statisticT} />
          </div>
        </>
      ) : (
        <div className={style.friends}>
          {isFriendRequestReverse ? (
            <h1>Запит в друзі надіслано</h1>
          ) : (
            <Button onClick={() => sendFriendRequest({ id: user._id })}>
              {isFriendRequest ? "Прийняти запит в друзі" : "Додати в друзі"}
            </Button>
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
};
