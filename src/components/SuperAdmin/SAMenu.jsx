import { FaHome, FaUser, FaFileAlt, FaBell } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    to: "/super-dashboard",
    icon: <FaHome className="h-5 w-5" />,
    label: "Home",
  },
  { to: "/prof", icon: <FaUser className="h-5 w-5" />, label: "Profile" },
  { to: "/process", icon: <FaFileAlt className="h-5 w-5" />, label: "Process" },
  {
    to: "/manage",
    icon: <TbReportMoney className="h-5 w-5" />,
    label: "Prices",
  },
  { to: "/notif", icon: <FaBell className="h-5 w-5" />, label: "Notif" },
];

const SAMenu = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-60">
      <ul className="menu menu-horizontal bg-[#50947d] w-full flex justify-around text-xs">
        {menuItems.map(({ to, icon, label }) => (
          <li key={to} className="flex flex-col items-center">
            <NavLink
              to={to}
              aria-label={label}
              className={({ isActive }) =>
                `flex flex-col items-center ${
                  isActive ? "text-warning rounded-md px-2" : "text-white"
                }`
              }
            >
              {icon}
              <span className="text-[10px]">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SAMenu;
