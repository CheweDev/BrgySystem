import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

// Sample user role
const isAdmin = false;

const Menu = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-4">
      <ul className="menu menu-horizontal bg-base-300 rounded-full px-6 gap-2">
        {/* Home */}
        <li>
          <NavLink
            to={isAdmin ? "/admin-dashboard" : "/user-dashboard"}
            className={({ isActive }) =>
              isActive ? "bg-[#25596E] text-white" : "text-gray-500"
            }
          >
            <FaHome className="h-5 w-5" />
          </NavLink>
        </li>

        {/* Bulletin (Attendance) */}
        <li>
          <NavLink
            to={isAdmin ? "/attendance-list" : "/attendance"}
            className={({ isActive }) =>
              isActive ? "bg-[#25596E] text-white" : "text-gray-500"
            }
          >
            <FaClipboardList className="h-5 w-5" />
          </NavLink>
        </li>

        {/* Profile (User Profile) */}
        <li>
          <NavLink
            to={isAdmin ? "/admin-profile" : "/user-profile"}
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
            to="/document"
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
            to={isAdmin ? "/admin-notification" : "/user-notification"}
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

export default Menu;
