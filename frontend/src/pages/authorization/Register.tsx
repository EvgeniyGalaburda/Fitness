import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { NavLink } from "react-router";

import style from "./Register.module.css";
import Button from "../../components/Buttons/Button";

export const Register = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });

  const {
    mutate: signUp,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      try {
        const res = await axios.post(
          "/api/user/register",
          { username, password },
          { withCredentials: true }
        );
        if (res.data) queryClient.invalidateQueries({ queryKey: ["authUser"] });
        return res;
      } catch (error: any) {
        toast.error(error.response.data.error);
      }
    },
  });

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const register = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword)
      return toast.error("Паролі не співпадають");
    signUp(formData);
  };
  return (
    <div className={style.page}>
      <h1>Реєстрація</h1>
      <div className={style.content}>
        <h2>Логін</h2>
        <input
          placeholder="Arnold Schwarzenegger"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <h2>Пароль</h2>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <h2>Повторний пароль</h2>
        <input
          type="password"
          name="repeatPassword"
          value={formData.repeatPassword}
          onChange={handleInputChange}
        />
        {isError && error.message}
        <Button onClick={register}>Зареєструватись</Button>
        <NavLink to={"/login"}>Вже маєте аккаунт?</NavLink>
      </div>
      <Toaster />
    </div>
  );
};
