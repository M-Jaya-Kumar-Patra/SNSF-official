import { BsPCircle, BsFillPeopleFill } from "react-icons/bs";
import { AiFillProduct } from "react-icons/ai";
import KpiCard from "./KpiCard";

export default function KpiCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <KpiCard title="Total Visits" value={stats.visits} icon={BsPCircle} color="blue" />
      <KpiCard title="Total Users" value={stats.users} icon={BsFillPeopleFill} color="orange" />
      <KpiCard title="Enquiries" value={stats.enquiries} icon={BsPCircle} color="green" />
      <KpiCard title="Products" value={stats.products} icon={AiFillProduct} color="violet" />
    </div>
  );
}
