import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SAMenu = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-4">
      <ul className="menu menu-horizontal bg-base-300 rounded-full px-10 gap-2">
        {/* Home */}
        <li>
          <NavLink
            to="/super-dashboard"
            className={({ isActive }) =>
              isActive ? "bg-[#25596E] text-white" : "text-gray-500"
            }
          >
            <FaHome className="h-5 w-5" />
          </NavLink>
        </li>

        {/* Profile (User Profile) */}
        <li>
          <NavLink
            to="/prof"
            className={({ isActive }) =>
              isActive ? "bg-[#25596E] text-white" : "text-gray-500"
            }
          >
            <FaUser className="h-5 w-5" />
          </NavLink>
        </li>

        {/* Document */}
        <li>
          <NavLink
            to="/process"
            className={({ isActive }) =>
              isActive ? "bg-[#25596E] text-white" : "text-gray-500"
            }
          >
            <FaFileAlt className="h-5 w-5" />
          </NavLink>
        </li>

        {/* Notification */}
        <li>
          <NavLink
            to="/notif"
            className={({ isActive }) =>
              isActive ? "bg-[#25596E] text-white" : "text-gray-500"
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
