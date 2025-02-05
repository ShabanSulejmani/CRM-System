import { NavLink, Outlet } from "react-router";
import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";

export default function Layout(){

    return <>
        <header>
            <nav>
                <NavLink></NavLink>
                <NavLink></NavLink>
                <NavLink></NavLink>
                <NavLink></NavLink>
                <NavLink></NavLink>
                <NavLink></NavLink>
                <NavLink></NavLink>
                <NavLink></NavLink>
                <NavLink></NavLink>
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
    </>
}