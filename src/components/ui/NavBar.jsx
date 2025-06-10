import { NavLink, useLocation } from "react-router-dom";
import { Home, Sparkles, MapPin, User, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, loading } = useAuth();

  const navItems = [
    { to: "/chat", icon: MessageCircle },
    { to: "/reels", icon: Sparkles },
    { to: "/home", icon: Home },
    { to: "/map", icon: MapPin },
    { to: `/profile/${user}`, icon: User },
  ];

  if (loading) return null;

  return (
    <nav
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        w-[90%] max-w-md px-4 py-2.5
        flex items-center justify-between
        rounded-2xl
        bg-gradient-to-r from-blue-50/90 via-white/90 to-blue-50/90
        backdrop-blur-xl
        border border-blue-100/50
        shadow-[0_4px_20px_0_rgba(59,130,246,0.1)]
        transition-all duration-300 ease-in-out
      "
    >
      {navItems.map(({ to, icon: Icon }) => {
        const isActive = location.pathname === to;
        return (
          <NavLink
            key={to}
            to={to}
            className="group flex flex-col items-center justify-center transition-transform duration-150"
          >
            <div className={`
              p-2 rounded-xl
              transition-all duration-300 ease-in-out
              ${isActive 
                ? 'bg-blue-100/50' 
                : 'hover:bg-blue-50/50'
              }
            `}>
              <Icon
                className={`
                  h-6 w-6
                  transition-all duration-300 ease-in-out
                  ${isActive 
                    ? 'text-blue-500 fill-blue-500' 
                    : 'text-blue-400/70 group-hover:text-blue-400'
                  }
                  group-hover:scale-110
                `}
                strokeWidth={2}
              />
            </div>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navbar;