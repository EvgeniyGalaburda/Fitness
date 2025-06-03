import { useQuery, useQueryClient } from "@tanstack/react-query";
import style from "./Notifications.module.css";
import axios from "axios";
import Button from "../Buttons/Button";
import { useFriendRequest } from "../../hooks/useFriendRequest";

import { IoMdCheckmark } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";

export const Notifications = () => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<{
    data: { friendRequests: string[]; _id: string };
  }>(["authUser"]);
  return (
    <div className={style.page}>
      <h1>Сповіщення</h1>
      {(user?.data.friendRequests.length as number) > 0 ? (
        <div className={style.list}>
          {user?.data.friendRequests.map((f, i) => (
            <FriendRequestRow userId={f} key={i} />
          ))}
        </div>
      ) : (
        <h2>Поки сповіщення відсутні.</h2>
      )}
    </div>
  );
};

const FriendRequestRow = ({ userId }: { userId: string | undefined }) => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["userById", userId],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      try {
        const res = await axios.get(`/api/user/getUserById/${id}`, {
          withCredentials: true,
        });
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    enabled: !!userId,
  });

  const sendFriendRequest = useFriendRequest();

  if (isLoading) return <h1>Loading</h1>;

  return (
    <div className={style.row}>
      <div className={style.left}>
        <FaRegUserCircle />
        <h2>{user.username}</h2>
        <p>надіслав вам запит в друзі</p>
      </div>
      <Button onClick={() => sendFriendRequest({ id: userId as string })}>
        <IoMdCheckmark />
      </Button>
    </div>
  );
};
