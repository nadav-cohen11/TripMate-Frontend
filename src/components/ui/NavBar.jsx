import { NavLink, useLocation } from "react-router-dom";
import { Home, Star, MapPin, User, MessageCircle } from "lucide-react";

const navItems = [
  { to: "/chat", icon: MessageCircle },
  { to: "/favorites", icon: Star },
  { to: "/home", icon: Home },
  { to: "/map", icon: MapPin },
  { to: "/profile", icon: User },
];

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 flex items-center justify-between gap-4 z-50 max-w-md w-[95%] ">
      {navItems.map(({ to, icon: Icon }) => {
        const isActive = location.pathname === to;

        return (
          <NavLink
            key={to}
            to={to}
            className="group flex flex-col items-center justify-center transition-all duration-200 ease-in-out"
          >
            <Icon
              className="h-7 w-7 mb-0.5 transition-transform group-hover:scale-110"
              strokeWidth={2.2}
              color="black"
              fill={isActive ? "black" : "none"}
            />
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navbar;
