import SharedDesign from "@/components/design/SharedDesign";
export const metadata = { title: "Custom furniture concept | SNSF", robots: { index: false, follow: false }, alternates: { canonical: null } };
export default async function Page({ params }) { const { token } = await params; return <SharedDesign token={token} />; }
