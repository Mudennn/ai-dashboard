"use client"

import { Button } from './ui/button'
import { Wallet, House } from "@phosphor-icons/react";
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Menu = () => {
  const pathname = usePathname()

  const menuItems = [
    { icon: House, path: '/', label: 'Home', iconSize: 50 },
    { icon: Wallet, path: '/wallet', label: 'Wallet', iconSize: 50 },
  ]

  return (
    <div className="h-full flex flex-col items-center justify-center">

    <div className="bg-[#161616] rounded-full w-[48px] h-[184px] border-border border flex flex-col items-center justify-center">
      {/* Menu items */}
      <div className="flex flex-col gap-2 ">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          
          return (
            <Link href={item.path} key={index}>
              <Button 
                variant={isActive ? "default" : "ghost"} 
                className={`relative rounded-2xl w-[32px] h-[32px]  ${
                  isActive ? 'bg-primary text-white' : 'hover:bg-primary/20 hover:text-white'
                }`}
                title={item.label}
              >
                <Icon size={item.iconSize} />
              </Button>
            </Link>
          )
        })}
      </div>
    </div>
    </div>
  )
}

export default Menu