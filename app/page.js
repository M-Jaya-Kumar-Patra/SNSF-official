import Image from "next/image";
import Slider from "@/components/Slider";
import New from "@/components/New";
import Link from "next/link";
import Navbar from "@/components/Navbar"

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

      {/* Corrected navigation to Account Profile */}
      <Link href="/account/profile">
  <button>Go to Profile</button>
</Link>


    </div>
  );
}
