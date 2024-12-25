import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "../components/ui/navigation-menu"
import corvette from '../assets/corvette.png'

function MyNavMenu() {
  return (
    <div>
    <NavigationMenu>
      <NavigationMenuList className="gap-10">
        <NavigationMenuItem>
          <NavigationMenuLink className='hover:border-white text-base hover:text-red-500 cursor-pointer'>Privacy</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className='hover:border-white text-base hover:text-red-500 cursor-pointer'>Contact</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className='hover:border-white text-base hover:text-red-500 cursor-pointer'>Careers</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
   </div>
  )
}

export default MyNavMenu;
