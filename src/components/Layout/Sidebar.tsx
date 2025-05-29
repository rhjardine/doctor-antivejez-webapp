// src/components/Layout/Sidebar.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserMd,
  faSignOutAlt,
  faDna,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/utils/helpers';
import { NAV_ITEMS } from '@/utils/constants';
import { useAppState } from '@/contexts/AppStateProvider';

interface SidebarProps {
  user?: {
    name: string;
    role: string;
  };
}

export default function Sidebar({ user = { name: 'Dr. Juan C. Mendez', role: 'Médico Antienvejecimiento' } }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAppState();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    console.log('Logout presionado!');
  };

  return (
    <aside
      id="sidebar"
      aria-label="Barra lateral principal"
      className={cn(
        // Base styles
        'fixed top-0 left-0 z-50 h-screen flex flex-col',
        'bg-[#293B64] text-white',
        'border-r border-[#3D5895]',
        // Hardware acceleration for smoother transitions
        'transform-gpu',
        // Optimized transition with less properties
        'transition-[width] duration-200 ease-in-out',
        // Width based on state
        isSidebarCollapsed ? 'w-16' : 'w-56',
        // Hide on mobile, show on medium screens and up
        'hidden md:flex'
      )}
      style={{ willChange: 'width' }}
    >
      {/* Header con logo + toggle */}
      <div
        className={cn(
          'h-16 flex-shrink-0 border-b border-[#3D5895] flex items-center',
          isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center h-full overflow-hidden',
            isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
            'transition-[width,opacity] duration-200 ease-in-out'
          )}
        >
          <Link href="/dashboard" title="Ir al Dashboard" className="h-full flex items-center">
            <Image
              src="/assets/logo.png"
              alt="Doctor Antivejez Logo"
              width={156}
              height={42}
              className="object-contain h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Botón de toggle */}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          title={isSidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          className="p-2 text-[#23BCEF] hover:bg-[#3D5895]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#23BCEF]/50"
        >
          <FontAwesomeIcon
            icon={isSidebarCollapsed ? faDna : faAngleLeft}
            className="h-5 w-5"
          />
        </button>
      </div>

      {/* Navegación */}
      <nav
        className="flex-grow overflow-y-auto overflow-x-hidden py-4 scrollbar-thin"
        aria-label="Navegación principal"
      >
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.name} title={isSidebarCollapsed ? item.name : undefined}>
              <Link
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 py-2.5 rounded-md border-l-[3px]',
                  isSidebarCollapsed ? 'justify-center px-1.5' : 'px-3',
                  isActive(item.href)
                    ? 'bg-[#23BCEF]/10 text-white border-[#23BCEF] font-semibold'
                    : 'text-gray-300 border-transparent hover:text-white hover:bg-[#3D5895]/50 hover:border-[#3D5895]'
                )}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="w-5 h-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span 
                  className={cn(
                    "text-base font-medium whitespace-nowrap",
                    isSidebarCollapsed ? 'hidden' : 'block',
                    'transition-opacity duration-150'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Perfil y Logout */}
      <div className="mt-auto flex-shrink-0 border-t border-[#3D5895]">
        {user && (
          <div
            className={cn(
              'p-4 flex items-center gap-3 cursor-pointer hover:bg-[#3D5895]/50',
              isSidebarCollapsed ? 'justify-center' : ''
            )}
            title={isSidebarCollapsed ? `${user.name}\n${user.role}` : 'Ver perfil'}
          >
            <div className="w-10 h-10 bg-[#23BCEF] text-white rounded-full flex items-center justify-center font-semibold text-base flex-shrink-0">
              <FontAwesomeIcon icon={faUserMd} />
            </div>
            <div 
              className={cn(
                "flex-1 overflow-hidden",
                isSidebarCollapsed ? 'hidden' : 'block',
                'transition-opacity duration-150'
              )}
            >
              <div className="text-base font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                {user.name}
              </div>
              <div className="text-xs text-gray-300">{user.role}</div>
            </div>
          </div>
        )}
        <div className="px-2 pb-2">
          <button
            onClick={handleLogout}
            className={cn(
              'group flex items-center gap-3 py-2.5 rounded-md border-l-[3px] w-full text-left border-transparent',
              'text-gray-300 hover:text-[#EF4444] hover:bg-[#EF4444]/10',
              isSidebarCollapsed ? 'justify-center px-1.5' : 'px-3'
            )}
            title={isSidebarCollapsed ? 'Salir' : 'Cerrar sesión'}
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="w-5 h-5 flex-shrink-0 text-gray-300 group-hover:text-[#EF4444]"
              aria-hidden="true"
            />
            <span 
              className={cn(
                "text-base font-medium",
                isSidebarCollapsed ? 'hidden' : 'block',
                'transition-opacity duration-150'
              )}
            >
              Salir
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}