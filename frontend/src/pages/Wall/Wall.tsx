import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  TrainingRow,
  type Training,
} from "../../components/TodayLists/TodayLists";

import style from "./Wall.module.css";
import { NavLink } from "react-router";

export default function Wall() {
  const { data: friendsTrainings, isLoading } = useQuery({
    queryKey: ["friendsTrainings"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/trainings/wall",
          { withCredentials: true }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    retry: false,
  });

  if (isLoading) return null;

  const posts: { username: string; training: Training }[] = [
    ...(friendsTrainings ?? []),
  ].reverse();

  return (
    <div className={style.page}>
      <h1>Тренування друзів</h1>
      {posts.length > 0 ? (
        <div className={style.list}>
          {posts.map((t, i) => (
            <div key={i} className={style.row}>
              <NavLink to={`/user/${t.username}`}>
                <h1>
                  {t.username}{" "}
                  <>
                    -{" "}
                    {new Date(t.training.createdAt ?? "").toLocaleDateString()}
                  </>
                </h1>
              </NavLink>
              <TrainingRow t={t.training} key={i} />
            </div>
          ))}
        </div>
      ) : (
        <h1 className={style.none}>Поки тренування відсутні.</h1>
      )}
    </div>
  );
}
