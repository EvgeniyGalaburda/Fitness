import style from './Header.module.css'
import logoImg from '../../common_imgs/logo.png'
import { IoLogOutOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { NavLink, useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<{data: {username: string, friendRequests: string[]}}>(['authUser']);
  const {mutate: logout} = useMutation({
    mutationFn: async () => {
        const res = await axios.post("http://localhost:5000/api/user/logout",{},{withCredentials: true});
        return res;
    },
    onError: (error) => {
        toast.error(error.message);
    },
    onSuccess: async () => {
        await queryClient.invalidateQueries({queryKey: ['authUser']});
        toast.success("Вихід з облікового запису");
        navigate('/');
    }
  })
  return (
    <header className={style.header}>
        <div onClick={() => navigate('/')} className={style.logo}>
            <div className={style.imgHolder}>
                <img src={logoImg} alt="" />
            </div>
            <h1>FortisFit</h1>
        </div>
        <nav>
          <NavLink to={'/notifications'}>
            <FaBell />
            {user?.data.friendRequests.length as number > 0 && <span>{user?.data.friendRequests.length}</span>}
          </NavLink>
          <NavLink to={`/user/${user?.data.username}`}>
            <FaUser />
          </NavLink>
          <IoLogOutOutline onClick={() => logout()} />
        </nav>
    </header>
  )
}
