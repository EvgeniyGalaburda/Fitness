import React from "react";
import style from "./UserRow.module.css";
import type { userInterface } from "../../AppRoutes";
import { FaRegUserCircle } from "react-icons/fa";
import { FaGripfire } from "react-icons/fa";
import { FaBowlFood } from "react-icons/fa6";
import { FaDumbbell } from "react-icons/fa6";

export const UserRow: React.FC<{
  user: userInterface;
  tCalories?: number;
  fCalories?: number;
  plan?: string;
}> = ({ user, tCalories, fCalories, plan }) => {
  return (
    <div className={style.row}>
      <div className={style.left}>
        <FaRegUserCircle />
        <div className={style.info}>
          <h3>{user.username}</h3>
          <p>
            IMT: {user.imt?.toFixed(2)} {plan && <>- {plan}</>}
          </p>
        </div>
      </div>
      {typeof tCalories === "number" && typeof fCalories === "number" && (
        <div className={style.calories}>
          <div className={style.details}>
            <h5 className={style.detail}>
              + {fCalories.toFixed()} <FaBowlFood />
            </h5>
            <h5 className={style.detail}>
              - {tCalories.toFixed()} <FaDumbbell />
            </h5>
          </div>
          <div className={style.general}>
            <p>
              {(fCalories - tCalories).toFixed()} /{" "}
              {user.calorieGoal?.toFixed()}
            </p>{" "}
            <FaGripfire />
          </div>
        </div>
      )}
    </div>
  );
};
