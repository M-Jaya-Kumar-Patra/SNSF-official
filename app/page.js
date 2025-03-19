import Image from "next/image";
import Slider from "@/components/Slider";
import New from "@/components/New";
import Link from "next/link";
import Account from "./account/page";
import Navbar from "@/components/Navbar";







export default function Home() {
  return (
    <div>
      <Navbar />
      <section className="flex justify-center">
        <Slider />
      </section>
      <section className="flex justify-center">
        <New />
      </section>
      <Link href="/account">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Go to Account</button>
      </Link>
    </div>
  );
}
