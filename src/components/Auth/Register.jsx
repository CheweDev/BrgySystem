import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="flex justify-center mt-7">
        <img src="logo - Copy.png" alt="logo" />
      </div>
      <div className="p-2 mt-3">
        <div
          className="rounded-tl-[35px] rounded-tr-[35px]  rounded-br-[35px] p-4 sm:p-8 shadow-xl"
          style={{
            background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
          }}
        >
          <form>
            <label className="input input-bordered flex items-center gap-2 mt-4 mb-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input type="text" className="grow" placeholder="Name" />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C8.686 2 6 4.686 6 8c0 4.25 5.4 10.365 5.692 10.715a1 1 0 0 0 1.616 0C12.6 18.365 18 12.25 18 8c0-3.314-2.686-6-6-6Zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
                  clipRule="evenodd"
                />
                <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              </svg>
              <input type="text" className="grow" placeholder="Purok #" />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                type="text"
                className="grow"
                placeholder="Enter an email"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter a password"
                className="grow"
                required
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 mb-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="grow"
                required
              />
            </label>

            <select className="select select-bordered w-full rounded-full mb-4">
              <option>Admin</option>
              <option>User</option>
            </select>

            <label className="flex items-center text-sm mb-4 text-white">
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2 border-gray-300 rounded"
              />
              Show Password
            </label>

            <button className="w-full shadow-xl bg-green-300 font-extrabold py-3 sm:py-4 text-base sm:text-lg rounded-full mb-6 sm:mb-8 mt-3 tracking-wider transition">
              Register
            </button>
          </form>
          <div className="flex justify-center mb-5">
            <p className="text-white text-sm">
              Already have an account?
              <Link to="/login">
                <span className="underline ms-2">Login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
