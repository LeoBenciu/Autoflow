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
import { useNavigate, useLocation } from 'react-router'
import { useEffect } from 'react'

function MyNavMenu() {
  const navigate = useNavigate('/cars');
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        
        const offset = -150; // Adjust this value to scroll more or less (in pixels)
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [location]);

  const handleSectionNavigation = (path, section)=>{
    navigate(path+section);
  };
  
  return (
    <div>
    <NavigationMenu>
      <NavigationMenuList className="gap-10">
        <NavigationMenuItem>
          <NavigationMenuLink className='hover:border-white text-base hover:text-red-500 cursor-pointer' onClick={()=>navigate('/cars')}>Buy</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className='hover:border-white text-base hover:text-red-500 cursor-pointer'
          onClick={()=>navigate('/posts')}>Sell</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='hover:border-white text-base hover:text-red-500'>Services</NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-96">
          <NavigationMenuIndicator/>
          <div className="grid gap-3 p-6 w-[600px] md:w-[400px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
            <div className="row-span-3">
              <NavigationMenuLink asChild>
                <a 
                  href="/cars"
                  className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md relative overflow-hidden hover:opacity-95 transition-opacity"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center z-0" 
                    style={{
                      backgroundImage: `url(${corvette})`, 
                    }}
                  />

                  <div className="absolute inset-0 bg-black/50 z-0"></div>
                  
                  
                  <div className="relative z-10">
                    <svg
                      width="38"
                      height="38"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M21.7 13.35L20.7 10.35C20.41 9.55 19.64 9 18.78 9H5.22C4.36 9 3.59 9.55 3.3 10.35L2.3 13.35C2.11 13.91 2 14.5 2 15.09V19C2 19.55 2.45 20 3 20H4C4.55 20 5 19.55 5 19V18H19V19C19 19.55 19.45 20 20 20H21C21.55 20 22 19.55 22 19V15.09C22 14.5 21.89 13.91 21.7 13.35ZM6.5 16C5.67 16 5 15.33 5 14.5C5 13.67 5.67 13 6.5 13C7.33 13 8 13.67 8 14.5C8 15.33 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5C16 13.67 16.67 13 17.5 13C18.33 13 19 13.67 19 14.5C19 15.33 18.33 16 17.5 16ZM5 11.5H19L20 14.5H4L5 11.5Z"/>
                    </svg>
                    <div className="mt-4 text-lg font-medium text-white ">
                      Find Your Dream Car
                    </div>
                    <p className="mt-2 text-sm leading-tight text-white/80">
                      Browse through our extensive collection of premium vehicles. From luxury to economy, find the perfect match for your needs.
                    </p>
                  </div>
                </a>
              </NavigationMenuLink>
            </div>

            <NavigationMenuLink asChild className='group'>
              <a className="block p-3 space-y-1 no-underline rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={(e)=>{
                e.preventDefault();
                handleSectionNavigation('/about-us', '#car-audit')
              }}>
                <div className="text-sm font-medium group-hover:text-red-500">Car Audit</div>
                <p className="text-sm leading-snug text-slate-500">
                  Comprehensive vehicle inspection and verification service by certified experts.
                </p>
              </a>
            </NavigationMenuLink>

            <NavigationMenuLink asChild className='group'>
              <a className="block p-3 space-y-1 no-underline rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" 
              onClick={(e) => {
                    e.preventDefault();
                    handleSectionNavigation('/about-us', '#car-delivery');
                  }}>
                <div className="text-sm font-medium group-hover:text-red-500">Delivery</div>
                <p className="text-sm leading-snug text-slate-500">
                  Safe and timely delivery of your vehicle to your preferred location nationwide.
                </p>
              </a>
            </NavigationMenuLink>

            <NavigationMenuLink asChild className='group'>
              <a className="block p-3 space-y-1 no-underline rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" 
              onClick={(e)=>{
                e.preventDefault();
                handleSectionNavigation('/about-us', '#car-financing');
              }}>
                <div className="text-sm font-medium group-hover:text-red-500">Financing</div>
                <p className="text-sm leading-snug text-slate-500">
                Flexible car financing options with competitive rates and quick approval process.
                </p>
              </a>
            </NavigationMenuLink>
          </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
   </div>
  )
}

export default MyNavMenu;
