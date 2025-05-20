import React from 'react'
import logo from '../../assets/logo/c.svg'
import ProfileDropdown from './ProfileDropdown'
function Navbar() {
  return (
    <div className='flex fixed top-0 left-0 justify-between w-full items-center p-2 bg-white'>
        <div className='flex items-center gap-x-2'>
            <img src={logo} alt="logo" className='w-10 h-10' />
            <h1 className='md:text-2xl font-bold'>Admin Dashboard</h1>
        </div>
        <ProfileDropdown/>
    </div>
  )
}

export default Navbar