import React, { useState } from "react";

import style from "./TodayLists.module.css";

import { FaGripfire } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

export interface Training {
  type: string;
  calories: number;
  duration: number;
  MET: number;
  createdAt?: string;
}

export interface Food {
  title: string;
  calories: number;
  weight: number;
}

export const TodayLists: React.FC<{ trainings: Training[]; food: Food[] }> = ({
  trainings,
  food,
}) => {
  const [category, setCategory] = useState("training");
  const navigate = useNavigate();
  const handleClickCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCategory((e.target as HTMLButtonElement).value);
  };
  return (
    <div className={style.container}>
      <nav>
        <button
          className={
            category === "training"
              ? `${style.button} ${style.activeButton}  `
              : style.button
          }
          onClick={handleClickCategory}
          value="training"
        >
          Тренування
        </button>
        <button
          className={
            category === "food"
              ? `${style.button} ${style.activeButton} `
              : style.button
          }
          onClick={handleClickCategory}
          value="food"
        >
          Їжа
        </button>
      </nav>
      {category === "training" && (
        <div className={style.list}>
          <div
            onClick={() => navigate("/add-training")}
            id={style.plus}
            className={style.row}
          >
            <CiCirclePlus />
            <h2>Додати тренування</h2>
          </div>
          {trainings.map((t, i) => (
            <TrainingRow t={t} key={i} />
          ))}
        </div>
      )}
      {category === "food" && (
        <div className={style.list}>
          <div
            onClick={() => navigate("/add-food")}
            id={style.plus}
            className={style.row}
          >
            <CiCirclePlus />
            <h2>Додати прийом їжі</h2>
          </div>
          {food.map((f, i) => (
            <div key={i} className={style.row}>
              <div className={style.info}>
                <h2>{f.title}</h2>
                <p>Вага: {f.weight} г</p>
              </div>
              <div className={style.calories}>
                <h2>{f.calories.toFixed()}</h2>
                <FaGripfire id={style.foodC} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const TrainingRow: React.FC<{ t: Training }> = ({ t }) => {
  return (
    <div className={style.row}>
      <div className={style.info}>
        <h2>{t.type}</h2>
        <p>Тривалість: {t.duration} хв</p>
      </div>
      <div className={style.calories}>
        <h2>{t.calories.toFixed()}</h2>
        <FaGripfire id={style.trainingC} />
      </div>
    </div>
  );
};
