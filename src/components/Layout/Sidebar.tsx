// src/components/Sidebar.tsx - Versión optimizada para transición rápida
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

export default function Sidebar({ user }: SidebarProps) {
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
        'fixed top-0 left-0 z-50 h-screen flex flex-col overflow-x-hidden',
        'bg-secondary',
        'border-r border-secondary-light',
        // Redujo duración y simplificó la transición para enfocarla solo en el width
        // Agregando will-change para mejorar rendimiento
        'will-change-width transition-[width] duration-75 ease-out',
        isSidebarCollapsed ? 'w-16' : 'w-56',
        'hidden md:flex'
      )}
      style={{ contain: 'layout paint' }} // Optimización adicional para navegadores modernos
    >
      {/* Header con logo + toggle */}
      <div
        className={cn(
          'h-16 flex-shrink-0 border-b border-secondary-light flex items-center',
          isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6',
          // No transitions here - instantaneous change
        )}
      >
        {/* Logo siempre en el DOM - aparición/desaparición inmediata */}
        <div
          className={cn(
            'flex items-center h-full overflow-hidden',
            isSidebarCollapsed ? 'w-0' : 'w-auto'
          )}
        >
          <Link href="/dashboard" title="Ir al Dashboard">
            <Image
              src="/assets/logo.png"
              alt="Doctor Antivejez Logo"
              width={156}
              height={42}
              className="object-contain h-[42px] w-auto"
              priority
              // No image transitions
            />
          </Link>
        </div>

        {/* Botón sin transición */}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          title={isSidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          className="p-2 text-primary-light hover:bg-secondary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <FontAwesomeIcon
            icon={isSidebarCollapsed ? faDna : faAngleLeft}
            className="h-6 w-6"
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
                  // Sin transición en los nav items para evitar delays
                  isSidebarCollapsed ? 'justify-center px-1.5' : 'px-3.5',
                  isActive(item.href)
                    ? 'bg-primary/10 text-white border-primary font-semibold'
                    : 'text-gray-300 border-transparent hover:text-white hover:bg-secondary-light hover:border-secondary-light'
                )}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="w-6 h-6 flex-shrink-0"
                  aria-hidden="true"
                />
                {!isSidebarCollapsed && (
                  <span className="text-base font-medium">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Perfil y Logout */}
      <div className="mt-auto flex-shrink-0 border-t border-secondary-light">
        {user && (
          <div
            className={cn(
              'p-4 flex items-center gap-3 cursor-pointer hover:bg-secondary-light',
              // Sin transición aquí
              isSidebarCollapsed ? 'justify-center' : ''
            )}
            title={isSidebarCollapsed ? `${user.name}\n${user.role}` : 'Ver perfil'}
          >
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-base flex-shrink-0">
              <FontAwesomeIcon icon={faUserMd} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="text-base font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {user.name}
                </div>
                <div className="text-xs text-gray-300">{user.role}</div>
              </div>
            )}
          </div>
        )}

        <div className="px-2 pb-2">
          <button
            onClick={handleLogout}
            className={cn(
              'group flex items-center gap-3 py-2.5 rounded-md border-l-[3px] w-full text-left border-transparent',
              // Sin transición aquí
              'text-gray-300 hover:text-danger hover:bg-danger/10',
              isSidebarCollapsed ? 'justify-center px-1.5' : 'px-3.5'
            )}
            title={isSidebarCollapsed ? 'Salir' : 'Cerrar sesión'}
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="w-6 h-6 flex-shrink-0 text-gray-300 group-hover:text-danger"
              aria-hidden="true"
            />
            {!isSidebarCollapsed && (
              <span className="text-base font-medium">Salir</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}