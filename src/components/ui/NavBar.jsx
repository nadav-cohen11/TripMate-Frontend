import { Link } from "react-router-dom";
import { Home as HomeIcon, Star, MapPin, User, MessageCircle } from "lucide-react";

const Navbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#7f99a5a0] rounded-t-3xl shadow-md">
      <div className="flex justify-between border-t border-[#2D4A53] rounded-t-3xl shadow-md" >
        <Link to="/chat" className="flex-1 flex justify-center items-center py-3  border-r border-[#2D4A53]">
          <MessageCircle className="h-6 w-6" color="#2D4A53" />
        </Link>
        <Link to="/favorites" className="flex-1 flex justify-center items-center py-3 border-r border-[#2D4A53]">
          <Star className="h-6 w-6" color="#2D4A53" />
        </Link>
        <Link to="/home" className="flex-1 flex justify-center items-center py-3 border-r border-[#2D4A53]">
          <HomeIcon className="h-6 w-6" color="#2D4A53" />
        </Link>
        <Link to="/map" className="flex-1 flex justify-center items-center py-3 border-r border-[#2D4A53]">
          <MapPin className="h-6 w-6" color="#2D4A53" />
        </Link>
        <Link to="/profile" className="flex-1 flex justify-center items-center py-3 ">
          <User className="h-6 w-6" color="#2D4A53" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
