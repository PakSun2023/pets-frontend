import React, { useState } from "react"
import { BiUser } from 'react-icons/bi';
import { GiHollowCat } from 'react-icons/gi';

const Header = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="navbar bg-base-300 fixed top-0">
            <a href="/" className="flex-1 space-x-4">
                <GiHollowCat className="text-2xl" />
                <div className="normal-case text-xl">Pets Shelter</div>
            </a>
            <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                    {isLogin ?
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-fit flex justify-center items-center rounded-full text-2xl">
                                <BiUser />
                            </div>
                        </label> :
                        <div className="navbar-end">
                            <a href="/login" className="btn btn-warning">
                                Login
                            </a>
                        </div>
                    }
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                        <li><a href="/favorites">Favorites</a></li>
                        <li><a href="/setting">Settings</a></li>
                        <li><a href="/">Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header