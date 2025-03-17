import { NavLink } from "react-router-dom";
import {
  PlusCircle,
  Link,
  Package,
  MessageSquare,
  Settings,
  Tag,
  Wallet,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/add"
        >
          <PlusCircle className="w-5 h-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/list"
        >
          <Link className="w-5 h-5" />
          <p className="hidden md:block">Link Items</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/orders"
        >
          <Package className="w-5 h-5" />
          <p className="hidden md:block">Orders</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/contacts"
        >
          <MessageSquare className="w-5 h-5" />
          <p className="hidden md:block">Contact</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/site-settings"
        >
          <Settings className="w-5 h-5" />
          <p className="hidden md:block">Site Settings</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/coupons"
        >
          <Tag className="w-5 h-5" />
          <p className="hidden md:block">Coupons</p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l"
          to="/crypto-wallets"
        >
          <Wallet className="w-5 h-5" />
          <p className="hidden md:block">Crypto Wallets</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
