import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";

const Menu = () => {
  const [isAdmin, setIsAdmin] = useState(
    sessionStorage.getItem("role") === "Admin"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(sessionStorage.getItem("role") === "Admin");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <ul className="menu menu-horizontal bg-[#50947d] w-full gap-3 flex justify-center">
        <li>
          <NavLink
            to={isAdmin ? "/admin-dashboard" : "/user-dashboard"}
            className={({ isActive }) =>
              isActive ? "text-[#50947d] bg-white" : "text-white"
            }
          >
            <FaHome className="h-5 w-5" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to={isAdmin ? "/attendance-list" : "/attendance"}
            className={({ isActive }) =>
              isActive ? "text-[#50947d] bg-white" : "text-white"
            }
          >
            <FaClipboardList className="h-5 w-5" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to={isAdmin ? "/admin-profile" : "/user-profile"}
            className={({ isActive }) =>
              isActive ? "text-[#50947d] bg-white" : "text-white"
            }
          >
            <FaUser className="h-5 w-5" />
          </NavLink>
        </li>
        {!isAdmin && (
          <li>
            <NavLink
              to="/document"
              className={({ isActive }) =>
                isActive ? "text-[#50947d] bg-white" : "text-white"
              }
            >
              <FaFileAlt className="h-5 w-5" />
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to={isAdmin ? "/admin-notification" : "/user-notification"}
            className={({ isActive }) =>
              isActive ? "text-[#50947d] bg-white" : "text-white"
            }
          >
            <FaBell className="h-5 w-5" />
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
