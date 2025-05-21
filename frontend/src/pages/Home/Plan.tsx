import React from 'react'
import type { userPlan } from '../../AppRoutes'

import style from './Home.module.css'
import Button from '../../components/Buttons/Button'

import { GrLinkNext } from "react-icons/gr";
import { useNavigate } from 'react-router';

export const Plan: React.FC<{plan: userPlan, imt: number}> = ({plan, imt}) => {
  const navigate = useNavigate();
  return (
    <div className={style.plan}>
        <h1>{plan.title}</h1>
        <div className={style.planContent}>
            <div className={style.imgHolder}>
              <img src={plan.img} alt="" />
              </div>
            <h2>IMT - {imt.toFixed(2)}</h2>
            <p>{plan.text}</p>
            <Button onClick={() => navigate('/')}>Далі<GrLinkNext /></Button>
        </div>
    </div>
  )
}
