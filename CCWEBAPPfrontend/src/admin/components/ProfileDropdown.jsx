import React from 'react'
import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useOnClickOutside from '../components/OnClickOutside'
import { logout } from '../../store/userReducer'
import { useNavigate } from 'react-router-dom'
import { 
    FaClipboardList, 
    FaUsers, 
    FaQuestionCircle, 
    FaChartLine, 
    FaCar, 
    FaFileAlt, 
    FaUserTie, 
    FaCog, 
    FaSignOutAlt 
} from 'react-icons/fa'

function ProfileDropdown() {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useOnClickOutside(ref, () => setOpen(false))
    const { user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const menuItems = [
        { id: 1, label: 'Dashboard', icon: <FaClipboardList className="text-xl" />, type: 'grid' },
        { id: 2, label: 'Users', icon: <FaUsers className="text-xl" />, type: 'grid' },
        { id: 3, label: 'Complaints', icon: <FaQuestionCircle className="text-xl" />, type: 'grid' },
        { id: 4, label: 'Team', icon: <FaChartLine className="text-xl" />, type: 'grid' },
        { id: 5, label: 'Ride', icon: <FaCar className="text-xl" />, type: 'grid', badge: '●' },
        { id: 6, label: 'Plans', icon: <FaFileAlt className="text-xl" />, type: 'grid', onClick: handleLogout },
        { id: 7, label: 'Drivers', icon: <FaUserTie className="text-xl" />, type: 'list' },
        { id: 8, label: 'Settings', icon: <FaCog className="text-xl" />, type: 'list' },
        { id: 9, label: 'Sign out', icon: <FaSignOutAlt className="text-xl" />, type: 'list', onClick: handleLogout },
    ]

    return (
        <div className="relative" ref={ref}>
            <div 
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setOpen(!open)}
            >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">{user.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
            </div>

            {open && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100">
                    {/* User Profile Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-bold text-lg">{user.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</h3>
                                <p className="text-xs text-primary">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Grid Menu Items */}
                    <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100">
                        {menuItems.filter(item => item.type === 'grid').map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    navigate(`/${item.label.toLowerCase().replace(/\s+/g, '-')}`)
                                    setOpen(false)
                                }}
                                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <span className="text-primary group-hover:scale-110 transition-transform mb-1">{item.icon}</span>
                                <span className="text-xs text-gray-600 group-hover:text-primary">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* List Menu Items */}
                    <div className="py-2">
                        {menuItems.filter(item => item.type === 'list').map(item => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.onClick) {
                                        item.onClick()
                                    } else {
                                        navigate(`/${item.label.toLowerCase().replace(/\s+/g, '-')}`)
                                    }
                                    setOpen(false)
                                }}
                                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                            >
                                <span className="text-primary group-hover:scale-110 transition-transform mr-3">{item.icon}</span>
                                <span className="group-hover:text-primary">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto text-xs text-red-500">{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileDropdown