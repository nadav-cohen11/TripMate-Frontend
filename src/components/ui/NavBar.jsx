import { NavLink, useLocation } from "react-router-dom";
import { Home, Star, MapPin, User, MessageCircle } from "lucide-react";

const navItems = [
  { to: "/chat",      icon: MessageCircle },
  { to: "/favorites", icon: Star         },
  { to: "/home",      icon: Home         },
  { to: "/map",       icon: MapPin       },
  { to: "/profile",   icon: User         },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const iconColor    = "#334155";              

  return (
    <nav
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        w-[90%] max-w-md px-4 py-2
        flex items-center justify-between
        rounded-xl shadow-md
        bg-white/50        
        backdrop-blur-lg     
      "
    >
      {navItems.map(({ to, icon: Icon }) => {
        const isActive = pathname === to;
        return (
          <NavLink
            key={to}
            to={to}
            className="group flex flex-col items-center justify-center transition-transform duration-150"
          >
            <Icon
              className="h-7 w-7 mb-0.5 group-hover:scale-110"
              strokeWidth={2.2}
              color={iconColor}
              fill={isActive ? iconColor : "none"}
            />
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navbar;