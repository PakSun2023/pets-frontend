import React, { useContext } from "react"
import { BiUser } from 'react-icons/bi';
import { GiHollowCat } from 'react-icons/gi';
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Header = () => {
    let location = useLocation();
    const { isAuthenticated, isLoading, user, logout } = useContext(AuthContext);

    return (
        <div className="navbar bg-base-300 fixed top-0 z-50">
            <a href="/" className="flex-1 space-x-4">
                <GiHollowCat className="text-2xl" />
                <div className="normal-case text-xl">Pets Shelter</div>
            </a>
            {isLoading ?
                <></> :
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        {isAuthenticated ?
                            <>
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-fit flex justify-center items-center rounded-full text-2xl">
                                        <BiUser />
                                    </div>
                                </label>
                                <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                                    {user && user.email && <li className="border-b-2 text-xl text-center">{user.email}</li>}
                                    {user && user.role === "staff" && <li><a href="/pet/add">Add Pet</a></li>}
                                    <li><a href="/favorites">Favorites</a></li>
                                    <li><a href="/setting">Settings</a></li>
                                    <li>
                                        <span onClick={logout}>Logout</span>
                                    </li>
                                </ul>
                            </>
                            :
                            location?.pathname === "/login" || location?.pathname === "/register" ?
                                <></> :
                                <div className="navbar-end">
                                    <a href="/login" className="btn btn-warning w-32">
                                        Login
                                    </a>
                                </div>
                        }

                    </div>
                </div>
            }
        </div>
    )
}

export default Header