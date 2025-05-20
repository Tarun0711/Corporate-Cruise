// import { useEffect } from 'react';
// import { checkAndExtendSession } from '../services/operations/Auth';

// const SessionManager = () => {
//   useEffect(() => {
//     // Check and extend session on component mount
//     checkAndExtendSession();

//     // Set up interval to check session every minute
//     const intervalId = setInterval(() => {
//       checkAndExtendSession();
//     }, 60000); // Check every minute

//     return () => clearInterval(intervalId);
//   }, []);

//   return null; // This component doesn't render anything
// };

// export default SessionManager;
