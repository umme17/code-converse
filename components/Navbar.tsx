import React from 'react'
import { ModeToggle } from './ModeToggleButton'
import  Link  from 'next/link'
import { CodeIcon } from 'lucide-react'
import { SignedIn, UserButton } from '@clerk/nextjs'
import DasboardBtn from './DasboardBtn'

const Navbar = () => {
  return (
    <nav className='border-b'>
        <div className='flex h-16 items-center px-4 container mx-auto '>
           {/* left side*/}
           <Link
           href = "/"
           className='flex items-center gap-2 font-semibold mr-6 font-mono hover:opacity-80 transition-opacity'
           >
            <CodeIcon className='size-8 text-purple-500'/>
            <span className='bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent'>CodeConverse</span>
           </Link>

           {/*right side*/}
           <SignedIn>
            <div className='flex items-center space-x-4 ml-auto'>
                <DasboardBtn />
                <ModeToggle/>
                <UserButton/>
            </div>
           </SignedIn>
        </div>
    </nav>
  );
}

export default Navbar;
