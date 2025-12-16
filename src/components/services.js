import { TbSunElectricity } from "react-icons/tb";
import { LuTvMinimalPlay } from "react-icons/lu";
import { FiShoppingBag } from "react-icons/fi";
import { LuFuel } from "react-icons/lu";
import { FaHouseMedicalFlag, FaHotel } from "react-icons/fa6";

export const utilityServices = [
  {
    name: "Electricity",
    category: "electricity",
    icon: TbSunElectricity ,
    providers: ["PHCN", "Ikeja Electric", "Eko Electric"]
  },
  {
    name: "TV",
    category: "tv",
    icon: LuTvMinimalPlay ,
    providers: ["DSTV", "GOTV", "Startimes"]
  },
  {
    name: "Shopping",
    category: "shopping",
    icon: FiShoppingBag ,
    providers: ["Amazon", "Jumia", "Konga"]
  },
  {
    name: "Transport",
    category: "transport",
    icon: LuFuel,
    providers: ["Uber", "Bolt", "Fuel Voucher"]
  },
  {
    name: "Embassies",
    category: "embassy",
    icon: FaHouseMedicalFlag ,
    providers: ["Visa Fee", "Passport Processing"]
  },
  {
    name: "Travel & Hotel",
    category: "travel",
    icon: FaHotel ,
    providers: ["Booking.com", "Airbnb", "Hotels.ng"]
  }
];
