'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Crown, User, Coins } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Cari', href: '/search', icon: Search },
  { label: 'VIP', href: '/vip', icon: Crown },
  { label: 'Profil', href: '/profile', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-60 flex-col border-r border-neutral-800 bg-[#141414]">
      {/* Logo Section */}
      <div className="border-b border-neutral-800 p-6">
        <h1 className="text-2xl font-bold text-white">Dramaflex</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-neutral-800/50"
            >
              <Icon
                className={`h-6 w-6 transition-colors ${
                  isActive ? 'text-[#E50914]' : 'text-white/60 group-hover:text-white'
                }`}
              />
              <span
                className={`text-base font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User Coins Section */}
      <div className="border-t border-neutral-800 p-4">
        <div className="flex items-center gap-2 text-white/80">
          <Coins className="h-5 w-5 text-[#E50914]" />
          <div>
            <p className="text-sm font-semibold">Koin Anda</p>
            <p className="text-xs">0 Koin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
