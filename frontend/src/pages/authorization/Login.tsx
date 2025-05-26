import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import style from "./Register.module.css";
import Button from "../../components/Buttons/Button";
import { NavLink } from "react-router";

export const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const { mutate: login } = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const res = await axios.post(
        "/api/user/login",
        { username, password },
        { withCredentials: true }
      );
      return res;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Вхід виконано!");
    },
    onError: (err: any) => {
      toast.error(err.response.data.message);
    },
  });

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={style.page}>
      <h1>Вхід</h1>
      <div className={style.content}>
        <h2>Логін</h2>
        <input
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
        <Button onClick={() => login(formData)}>Увійти</Button>
        <NavLink to={"/register"}>Ще не зареєстровані?</NavLink>
      </div>
      <Toaster />
    </div>
  );
};
