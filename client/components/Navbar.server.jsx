import Image from "next/image";
import ClientNavbar from "./ClientNavbar";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-slate-900 z-50">
      {/* SERVER RENDERED LOGO */}
      <div className="flex items-center gap-1 px-4 h-[80px]">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={60}
          height={60}
          priority
        />

        <Image
          src="/images/snsf-text.png"
          alt="SNSF"
          width={160}
          height={60}
          priority
        />
      </div>

      {/* CLIENT PART */}
      <ClientNavbar />
    </nav>
  );
}
