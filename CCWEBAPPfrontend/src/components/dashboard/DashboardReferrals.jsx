import React, { useState } from 'react';
import { FiShare2, FiTriangle, FiGift, FiCopy, FiUsers } from "react-icons/fi";
import { Triangle } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon
} from "react-share";

const DashboardReferrals = ({ shareUrl, referralCount }) => {
  const [activeTab, setActiveTab] = useState('share'); // 'share' or 'history'
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Link copied to clipboard!");
      },
      () => {
        toast("Failed to copy to clipboard.");
      }
    );
  };

  const referralBenefits = [
    {
      tier: 1,
      required: 1,
      reward: "75 KM Free Ride",
      progress: Math.min(referralCount, 1),
      earned: Math.min(referralCount, 1) * 75,
    },
    {
      tier: 2,
      required: 1,
      reward: "Another 75 KM Free",
      progress: Math.max(0, Math.min(referralCount - 1, 1)),
      earned: Math.min(Math.max(referralCount - 1, 0), 1) * 75,
    },
    {
      tier: 3,
      required: 1,
      reward: "100 KM Free + Priority Support",
      progress: Math.max(0, referralCount - 2),
      earned: Math.max(referralCount - 2, 0) * 100,
    },
  ];
  
  const totalEarnedKm = referralBenefits.reduce((total, benefit) => total + benefit.earned, 0);
  
  // Sample referral history for demonstration
  const referralHistory = [
    { name: "Arun Kumar", date: "15 Aug 2024", status: "Completed", reward: "75 KM" },
    { name: "Priya Singh", date: "10 Aug 2024", status: "Completed", reward: "75 KM" },
    { name: "Rajesh Shah", date: "2 Aug 2024", status: "Pending", reward: "100 KM" },
  ];

  return (
    <div className="space-y-6">
      {/* Header with tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4 md:mb-0">
          <FiShare2 className="text-primary" />
          Refer & Earn Rewards
        </h2>
        
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'share' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('share')}
          >
            Share & Earn
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'history' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>
      
      {activeTab === 'share' && (
        <>
          {/* Triangle visualization and stats */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className="md:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Referral Triangle</h3>
              <div className="flex justify-center">
                <div className="relative">
                  {/* Triangle visualization showing referral tiers */}
                  <svg width="280" height="220" viewBox="0 0 280 220" className="mx-auto">
                    {/* Bottom tier - First 75 KM */}
                    <polygon 
                      points="30,180 250,180 140,40" 
                      fill={referralCount >= 1 ? "rgba(74, 222, 128, 0.6)" : "#e2e8f0"} 
                      stroke="#94a3b8" 
                      strokeWidth="1"
                    />
                    
                    {/* Middle tier - Second 75 KM */}
                    <polygon 
                      points="70,140 210,140 140,40" 
                      fill={referralCount >= 2 ? "rgba(96, 165, 250, 0.6)" : "#e2e8f0"} 
                      stroke="#94a3b8" 
                      strokeWidth="1" 
                    />
                    
                    {/* Top tier - Final 100 KM */}
                    <polygon 
                      points="100,100 180,100 140,40" 
                      fill={referralCount >= 3 ? "rgba(139, 92, 246, 0.6)" : "#e2e8f0"} 
                      stroke="#94a3b8" 
                      strokeWidth="1" 
                    />
                    
                    {/* Tier labels */}
                    <text x="140" y="160" textAnchor="middle" fill="#4b5563" fontSize="12" fontWeight="500">75 KM</text>
                    <text x="140" y="120" textAnchor="middle" fill="#4b5563" fontSize="12" fontWeight="500">75 KM</text>
                    <text x="140" y="80" textAnchor="middle" fill="#4b5563" fontSize="12" fontWeight="500">100 KM</text>
                    
                    {/* Top indicator */}
                    <circle cx="140" cy="40" r="8" fill={referralCount >= 3 ? "#8b5cf6" : "#e2e8f0"} />
                    <text x="140" y="43" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">3</text>
                    
                    {/* Referral icons */}
                    {referralCount >= 1 && (
                      <circle cx="40" cy="170" r="10" fill="#10b981" />
                    )}
                    {referralCount >= 2 && (
                      <circle cx="240" cy="170" r="10" fill="#10b981" />
                    )}
                    {referralCount >= 3 && (
                      <circle cx="140" cy="70" r="10" fill="#8b5cf6" />
                    )}
                  </svg>
                </div>
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold mb-1">Referrals: {referralCount}/3</p>
                <p className="text-xs text-gray-500">Invite 3 friends to complete your triangle</p>
              </div>
            </div>
            
            <div className="md:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Your Rewards</h3>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg mb-4">
                <div className="flex items-center">
                  <FiGift className="text-purple-600 text-2xl mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Earned</p>
                    <p className="text-xs text-gray-500">From all your referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{totalEarnedKm} KM</p>
                  <p className="text-xs text-gray-500">Free Rides</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {referralBenefits.map((benefit) => (
                  <div key={benefit.tier} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Tier {benefit.tier}</span>
                      <span className="text-sm text-gray-600">
                        {benefit.progress}/{benefit.required}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r transition-all duration-500 ${
                          benefit.tier === 1 ? 'from-green-400 to-green-500' :
                          benefit.tier === 2 ? 'from-blue-400 to-blue-500' :
                          'from-purple-400 to-purple-500'
                        }`}
                        style={{
                          width: `${(benefit.progress / benefit.required) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Reward</span>
                      <span className="text-xs font-medium">
                        {benefit.reward}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Share section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4">Share Your Referral Link</h3>
            
            <div className="flex gap-3 items-center mb-6 md:flex-row flex-col">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full p-3 pr-10 border rounded-lg bg-gray-50 font-mono text-sm"
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                  onClick={() => copyToClipboard(shareUrl)}
                >
                  <FiCopy />
                </button>
              </div>
              
              <div className="flex gap-3">
                <FacebookShareButton url={shareUrl} className="hover:scale-110 transition-transform">
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <WhatsappShareButton url={shareUrl} className="hover:scale-110 transition-transform">
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <TelegramShareButton url={shareUrl} className="hover:scale-110 transition-transform">
                  <TelegramIcon size={40} round />
                </TelegramShareButton>
                <LinkedinShareButton url={shareUrl} className="hover:scale-110 transition-transform">
                  <LinkedinIcon size={40} round />
                </LinkedinShareButton>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium flex items-center text-blue-800 mb-2">
                <FiUsers className="mr-2" /> How it works
              </h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
                <li>Share your unique referral link with friends and colleagues</li>
                <li>They sign up using your link and complete their first ride</li>
                <li>You both get rewards - it's a win-win!</li>
                <li>Earn up to 250 KM in free rides by completing your triangle</li>
              </ul>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4">Your Referral History</h3>
          
          {referralHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reward
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referralHistory.map((referral, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {referral.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {referral.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          referral.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {referral.reward}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FiUsers className="mx-auto text-gray-400 text-4xl mb-2" />
              <p className="text-gray-600">You haven't referred anyone yet</p>
              <p className="text-sm text-gray-500 mt-1">Share your link to start earning rewards</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardReferrals; 