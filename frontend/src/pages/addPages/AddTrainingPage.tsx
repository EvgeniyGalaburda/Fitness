import { useState } from "react";
import { trainings } from "../../info_templates/Trainings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";

import { FaPlus } from "react-icons/fa";

import style from "./AddPages.module.css";
import Button from "../../components/Buttons/Button";

export const AddTrainingPage = () => {
  const [formData, setFormData] = useState({
    type: "Силове тренування",
    duration: 0,
    MET: 5,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: addTraining } = useMutation({
    mutationFn: async ({
      type,
      duration,
      MET,
    }: {
      type: string;
      duration: number;
      MET: number;
    }) => {
      const res = await axios.post(
        "/api/trainings/add",
        { type, duration, MET },
        { withCredentials: true }
      );
      return res;
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error);
    },
    onSuccess: async () => {
      toast.success("Тренування додано");
      await queryClient.invalidateQueries({ queryKey: ["todayTrainings"] });
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  const handleSelect = (e: { target: { value: string } }) => {
    setFormData({
      ...formData,
      type: JSON.parse(e.target.value).type,
      MET: JSON.parse(e.target.value).MET,
    });
  };

  const setDuration = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={style.page}>
      <h1>Додати тренування</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h2>Тип тренування</h2>
        <select onChange={handleSelect} name="type">
          {trainings.map((t, i) => (
            <option
              key={i}
              value={JSON.stringify({ type: t.type, MET: t.MET })}
            >
              {t.type}
            </option>
          ))}
        </select>
        <h2>Тривалість (хв)</h2>
        <input
          type="number"
          value={formData.duration}
          onChange={setDuration}
          name="duration"
        />
        <Button onClick={() => addTraining(formData)}>
          Додати
          <FaPlus />
        </Button>
      </form>
      <Toaster />
    </div>
  );
};
