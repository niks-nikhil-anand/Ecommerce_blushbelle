import 'tailwindcss/tailwind.css';
import '@/app/globals.css';
import SidebarAdmin from '@/components/adminPanel/SidebarAdmin';
import NavbarAdmin from '@/components/adminPanel/NavbarAdmin';


const Layout = ({ children }) => {
  return (
    <div className="flex w-full min-h-screen overflow-hidden">
    <SidebarAdmin className="w-1/4 h-screen bg-gray-800" />
    <div className="flex-1 overflow-hidden ">
      <NavbarAdmin className="w-full" />
      {children}
    </div>
  </div>
  );
};

export default Layout;
