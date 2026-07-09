import Sidebar from '../Sidebar'
import { FaHeart } from 'react-icons/fa'
import { FiPackage, FiTag, FiHelpCircle, FiShoppingBag } from 'react-icons/fi'
import Link from 'next/link'
import CartAndControls from './CartAndControls'
import HeaderSearchbar from './HeaderSearchbar'

const utilityLinks = [
  { href: '/orders', label: 'My Orders', icon: FiPackage },
  { href: '#', label: 'Amazing Opportunities', icon: FiTag },
  { href: '#', label: 'Customer Services', icon: FiHelpCircle },
  { href: '#', label: 'Become a Seller', icon: FiShoppingBag },
]

const Header = () => {
  return (
    <header className="sticky top-0 z-[10000] text-md max-lg:text-sm">
      {/* Üst yardımcı bar */}
      <div className="hidden md:block bg-blue-950/95 backdrop-blur-sm text-neutral-300">
        <div className="mx-auto flex max-w-screen-2xl justify-end gap-6 px-8 py-1.5 text-[11px] lg:px-16">
          {utilityLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Icon className="text-[13px] opacity-70 group-hover:opacity-100" />
              <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Ana bar */}
      <div className="border-b border-blue-900/40 bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#1e3a8a] text-white shadow-lg shadow-blue-950/20">
        <div className="mx-auto flex max-w-screen-2xl items-center gap-4 px-4 py-3 md:gap-6 md:px-8 lg:px-16">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="BluE-Commerce anasayfa">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
              <FiShoppingBag className="text-lg text-blue-200" />
            </span>
            <h1 className="hidden items-center text-xl font-extrabold tracking-tight lg:flex">
              <span className="text-blue-300">Blu</span>E-Commerce
            </h1>
            <h1 className="flex text-lg font-extrabold lg:hidden">
              <span className="text-blue-300">Blu</span>E
            </h1>
          </Link>

          {/* Arama */}
          <div className="flex-1">
            <HeaderSearchbar />
          </div>

          {/* Sağ kontroller */}
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <CartAndControls />

            <Link
              href="/favorites"
              aria-label="Favoriler"
              className="group inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 font-medium text-blue-600 shadow-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:shadow-md active:scale-95"
            >
              <FaHeart className="transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden lg:inline">Favorites</span>
            </Link>

            <Sidebar />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header