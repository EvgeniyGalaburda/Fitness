import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

import { FaPlus } from "react-icons/fa";

import style from "./AddPages.module.css";
import { foodData } from "../../info_templates/Food";
import Button from "../../components/Buttons/Button";
import axios from "axios";
import toast from "react-hot-toast";

export const AddFoodPage = () => {
  const [formData, setFormData] = useState({
    title: "Куряче філе (приготоване)",
    energyValue: 1.65,
    weight: 0,
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: addFood } = useMutation({
    mutationFn: async ({
      title,
      energyValue,
      weight,
    }: {
      title: string;
      energyValue: number;
      weight: number;
    }) => {
      const res = await axios.post(
        "/api/food/add",
        { title, energyValue, weight },
        { withCredentials: true }
      );
      return res;
    },
    onSuccess: async () => {
      toast.success("Прийом їжі додано!");
      await queryClient.invalidateQueries({ queryKey: ["todayFood"] });
      navigate("/");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error);
    },
  });

  const handleSelect = (e: { target: { value: string } }) => {
    setFormData({
      ...formData,
      title: JSON.parse(e.target.value).title,
      energyValue: JSON.parse(e.target.value).energyValue,
    });
    console.log(formData);
  };

  const setWeight = (e: { target: { value: any } }) => {
    setFormData({ ...formData, weight: e.target.value });
  };
  return (
    <div className={style.page}>
      <h1>Додати прийом їжі</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h2>Продукт</h2>
        <select onChange={handleSelect} name="title">
          {foodData.map((f, i) => (
            <option
              key={i}
              value={JSON.stringify({
                title: f.title,
                energyValue: f.energyValue,
              })}
            >
              {f.title}
            </option>
          ))}
        </select>
        <h2>Вага продукту (г)</h2>
        <input onChange={setWeight} type="number" value={formData.weight} />
        <Button onClick={() => addFood(formData)}>
          Додати
          <FaPlus />
        </Button>
      </form>
    </div>
  );
};
