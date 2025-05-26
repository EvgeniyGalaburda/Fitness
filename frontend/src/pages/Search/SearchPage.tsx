import { useState } from "react";
import style from "./SearchPage.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { FaSearch } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { NavLink } from "react-router";

export const SearchPage = () => {
  const [query, setQuery] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchUsers", searchValue],
    queryFn: async ({ queryKey }) => {
      const [_, query] = queryKey;
      try {
        const res = await axios.get(`/api/user/search?username=${query}`, {
          withCredentials: true,
        });
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    enabled: false,
  });
  const handleButton = async () => {
    await setSearchValue(query);
    refetch();
  };
  return (
    <div className={style.page}>
      <div className={style.inputHolder}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук користувача"
        />
        <button onClick={handleButton}>
          Пошук <FaSearch />
        </button>
      </div>
      {isLoading && <h1>Завантаження</h1>}
      {users && users.length > 0 && (
        <div className={style.list}>
          <h1>Найдені користувачі</h1>
          {users.map((u: { _id: string; username: string }) => (
            <NavLink to={`/user/${u.username}`} key={u._id}>
              <FaRegUserCircle />
              <h1>{u.username}</h1>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
