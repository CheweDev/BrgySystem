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
    sessionStorage.getItem("role") === "Purok Official"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(sessionStorage.getItem("role") === "Purok Official");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <ul
        className={`menu menu-horizontal bg-[#50947d] w-full flex justify-center ${
          isAdmin ? "gap-4" : "gap-0"
        }`}
      >
        <li>
          <NavLink
            to={isAdmin ? "/admin-dashboard" : "/user-dashboard"}
            className={({ isActive }) =>
              isActive ? "text-warning px-2" : "text-white"
            }
          >
            <div className="flex flex-col items-center">
              <FaHome className="h-5 w-5" />
              <span className="text-[9px]">Home</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={isAdmin ? "/attendance-list" : "/attendance"}
            className={({ isActive }) =>
              isActive ? "text-warning px-2" : "text-white"
            }
          >
            <div className="flex flex-col items-center">
              <FaClipboardList className="h-5 w-5" />
              <span className="text-[9px]">Attendance</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink
            to={isAdmin ? "/admin-profile" : "/user-profile"}
            className={({ isActive }) =>
              isActive ? "text-warning px-2" : "text-white"
            }
          >
            <div className="flex flex-col items-center">
              <FaUser className="h-5 w-5" />
              <span className="text-[9px]">Profile</span>
            </div>
          </NavLink>
        </li>
        {!isAdmin && (
          <li>
            <NavLink
              to="/document"
              className={({ isActive }) =>
                isActive ? "text-warning px-2" : "text-white"
              }
            >
              <div className="flex flex-col items-center">
                <FaFileAlt className="h-5 w-5" />
                <span className="text-[9px]">Document</span>
              </div>
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            to={isAdmin ? "/admin-notification" : "/user-notification"}
            className={({ isActive }) =>
              isActive ? "text-warning px-2" : "text-white"
            }
          >
            <div className="flex flex-col items-center">
              <FaBell className="h-5 w-5" />
              <span className="text-[9px]">Notif</span>
            </div>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
