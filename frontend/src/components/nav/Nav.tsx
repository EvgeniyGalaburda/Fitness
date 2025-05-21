
import { NavLink, useLocation } from 'react-router'

import { MdHomeFilled } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { GiThreeFriends } from "react-icons/gi";

import style from './Nav.module.css'

export const Nav = () => {

    const location = useLocation();
    const hideNav = location.pathname === '/metrics' || location.pathname === '/plan';
    if (hideNav) return null;

  return (
    <nav className={style.nav}>
        <NavLink className={({ isActive }) => isActive ? style.active : ''} to={'/'}><MdHomeFilled /></NavLink>
        <NavLink className={({ isActive }) => isActive ? style.active : ''} to={'/wall'}><GiThreeFriends /></NavLink>
        <NavLink className={({ isActive }) => isActive ? style.active : ''} to={'/search'}><FaSearch /></NavLink>
    </nav>
  )
}
