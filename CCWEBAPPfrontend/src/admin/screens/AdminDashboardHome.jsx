import React, { useEffect, useRef } from 'react'
import { 
    Users,
    ShoppingCart,
    Car,
    TrendingUp,
    TrendingDown,
    Clock,
    DollarSign,
    UserPlus,
    MapPin
} from 'lucide-react'
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';

const Wish = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
}

function AdminDashboardHome() {
    const { user } = useSelector((state) => state.auth);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const recentActivities = [
        {
            icon: <Clock className="w-5 h-5" />,
            title: "New ride completed",
            description: "John Doe completed ride #1234",
            time: "5 minutes ago",
            color: "text-blue-600 bg-blue-100"
        },
        {
            icon: <DollarSign className="w-5 h-5" />,
            title: "Payment received",
            description: "$125.00 received from Sarah Smith",
            time: "2 hours ago",
            color: "text-green-600 bg-green-100"
        },
        {
            icon: <UserPlus className="w-5 h-5" />,
            title: "New user registration",
            description: "Mike Johnson joined the platform",
            time: "4 hours ago",
            color: "text-purple-600 bg-purple-100"
        },
        {
            icon: <MapPin className="w-5 h-5" />,
            title: "New ride request",
            description: "Pending ride request from Downtown",
            time: "5 hours ago",
            color: "text-orange-600 bg-orange-100"
        }
    ];

    useEffect(() => {
        if (chartRef.current) {
            // Destroy existing chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'Revenue Trend',
                            data: [6500, 5900, 8000, 8100, 5600, 12345],
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y',
                        },
                        {
                            label: 'User Count',
                            data: [800, 700, 1100, 100, 1400, 1500],
                            borderColor: 'rgb(16, 185, 129)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true,
                            yAxisID: 'y1',
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Revenue ($)'
                            },
                            beginAtZero: true,
                            grid: {
                                display: false
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Users'
                            },
                            beginAtZero: true,
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    const stats = [
        {
            title: "Total Users",
            value: "1,234",
            change: "-12%",
            icon: <Users className="w-6 h-6" />
        },
        {
            title: "Total Orders",
            value: "845",
            change: "+18%",
            icon: <ShoppingCart className="w-6 h-6" />
        },
        {
            title: "Active Rides",
            value: "42",
            change: "+7%",
            icon: <Car className="w-6 h-6" />
        },
        {
            title: "Revenue",
            value: "$12,345",
            change: "+23%",
            icon: <TrendingUp className="w-6 h-6" />
        }
    ]

    return (
        <div className="p-6 bg-gray-100 overflow-y-hidden w-full h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-sans font-light text-gray-800 italic">{Wish()}{", "}{user?.name}{"👋"}</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`rounded-xl shadow-sm p-6 border border-gray-100 ${
                            index === 0 ? 'bg-gradient-to-br from-blue-50 to-blue-100' :
                            index === 1 ? 'bg-gradient-to-br from-purple-50 to-purple-100' :
                            index === 2 ? 'bg-gradient-to-br from-green-50 to-green-100' :
                            'bg-gradient-to-br from-orange-50 to-orange-100'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${
                                index === 0 ? 'bg-blue-200/50' :
                                index === 1 ? 'bg-purple-200/50' :
                                index === 2 ? 'bg-green-200/50' :
                                'bg-orange-200/50'
                            }`}>
                                <span className={`${
                                    index === 0 ? 'text-blue-600' :
                                    index === 1 ? 'text-purple-600' :
                                    index === 2 ? 'text-green-600' :
                                    'text-orange-600'
                                }`}>
                                    {stat.icon}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {stat.change.startsWith('+') ? (
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${
                                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {stat.title}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className={`p-2 rounded-lg ${activity.color}`}>
                                    {activity.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                                    <p className="text-sm text-gray-500">{activity.description}</p>
                                    <span className="text-xs text-gray-400">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h2>
                    <div className="h-[300px]">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardHome