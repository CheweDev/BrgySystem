import { FaHome, FaUser, FaFileAlt, FaBell } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SAMenu = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0">
      <ul className="menu menu-horizontal bg-[#50947d] w-full gap-3 flex justify-center">
        <li>
          <NavLink
            to="/super-dashboard"
            className={({ isActive }) =>
              isActive ? "text-[#50947d] bg-white" : "text-white"
            }
          >
            <FaHome className="h-5 w-5" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/prof"
            className={({ isActive }) =>
              isActive ? "text-[#50947d] bg-white" : "text-white"
            }
          >
            <FaUser className="h-5 w-5" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/process"
            className={({ isActive }) =>
              isActive ? "text-[#50947d] bg-white" : "text-white"
            }
          >
            <FaFileAlt className="h-5 w-5" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/notif"
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

export default SAMenu;
