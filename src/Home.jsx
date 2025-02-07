import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex-grow flex items-center justify-center">
          <img
            src="home.png"
            alt="logo"
            className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain px-4"
          />
        </div>

        {/* Main Content Section */}
        <div className="w-full font-bold">
          <div
            className="rounded-tl-[40px] rounded-tr-[40px] p-6 sm:p-8 shadow-xl"
            style={{
              background: "linear-gradient(180deg, #89C6A7 0%, #25596E 100%)",
            }}
          >
            {/* Sign-up Button */}
            <Link to="/register">
              <button className="w-full shadow-xl bg-white text-linear-gradient(180deg, #89C6A7 0%, #25596E 50%) py-3 sm:py-4 text-base sm:text-lg rounded-full mb-6 sm:mb-8 mt-5 tracking-wider transition">
                Sign Up
              </button>
            </Link>
            {/* Login Prompt */}
            <p className="text-center text-sm sm:text-base text-white mb-4 sm:mb-5">
              Already have an account? <br />
              <a
                href="/login"
                className="text-white underline hover:text-gray-200 transition"
              >
                Login
              </a>{" "}
              instead
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
