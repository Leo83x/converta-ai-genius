

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-gray-50">
      {!isMobile && <Sidebar />}
      <main className="flex-1 overflow-auto w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;

