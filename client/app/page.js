import Slider from "@/components/Slider";
import New from "@/components/New";
import Shopbycat from "@/components/Shopbycat"
import Bestsellers from "@/components/Bestsellers";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <section className="flex justify-center">
        <Slider />
      </section>

      <section className="flex justify-center">
        <Shopbycat />
      </section>

      <section className="flex justify-center">
        <Bestsellers />
      </section>


      <section className="flex justify-center">
        <New />
      </section>

      <Link href="/account/profile">
        <button>Go to Profile</button>
      </Link>

    </div>
  );
}
