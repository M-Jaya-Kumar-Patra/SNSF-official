'use client';
import dynamic from 'next/dynamic';

// ✅ Dynamically import Sidebar to disable SSR
const Sidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });

const SidebarWrapper = (props) => {
  return <Sidebar {...props} />;
};

export default SidebarWrapper;
