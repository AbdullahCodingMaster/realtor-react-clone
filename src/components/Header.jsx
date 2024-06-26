import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
const Header = () => {
  const [pageState, setPageState] = useState("Sign in");
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else setPageState("Sign in");
    });
  }, [auth]);

  const pathMatchRoute = (route) => {
    if (route === location.pathname) return true;
  };
  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
      <header className="flex justify-between align-items-center  px-3 max-w-6xl mx-auto">
        <div className="py-3">
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="realtor logo"
            className="h-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div>
          <ul className="flex space-x-10 ">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-transparent ${
                pathMatchRoute("/") ? "text-gray-950 border-b-red-500" : ""
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-transparent ${
                pathMatchRoute("/offers")
                  ? "text-gray-950 border-b-red-500"
                  : ""
              }`}
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-transparent ${
                pathMatchRoute("/sign-in") ||
                (pathMatchRoute("/profile") && "text-gray-950 border-b-red-500")
              }`}
              onClick={() => navigate("/profile")}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
