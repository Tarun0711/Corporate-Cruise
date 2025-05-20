import { apiConnector } from "../apiconnector";
import { endpoints } from "../api";
import { toast } from "react-toastify";
import { setUser, loginSuccess } from "../../store/userReducer";
import { useDispatch } from "react-redux";


const setUserDataWithExpiry = (token, userData) => {
  const expiryTime = new Date().getTime() + (3 * 24 * 60 * 60 * 1000); // 3 days from now
  const dataToStore = {
    token,
    user: userData,
    expiry: expiryTime
  };
  localStorage.setItem('userSession', JSON.stringify(dataToStore));
  document.cookie = `token=${token}; expires=${new Date(expiryTime).toUTCString()}; path=/; SameSite=Strict`;
};

// Function to check and extend session if valid
export const checkAndExtendSession = () => {
  const userSession = localStorage.getItem('userSession');
  if (userSession) {
    const { token, user, expiry } = JSON.parse(userSession);
    const currentTime = new Date().getTime();
    
    // If session exists and not expired, extend it
    if (currentTime < expiry) {
      setUserDataWithExpiry(token, user); // This will reset expiry to 3 days from now
      return { token, user };
    } else {
      clearUserData(); // Clear expired session
      return null;
    }
  }
  return null;
};

const clearUserData = () => {
  localStorage.removeItem('userSession');
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const signUp = async (formData) => {
  const {
    name, 
    email,
    phoneNumber: mobile,
    homeAddress,
    workAddress,
    referralId,
  } = formData;

  try {
    const response = await apiConnector("POST", endpoints.SIGNUP_API, {
      name,
      email,
      mobile,
      homeAddress,
      workAddress, 
      referralId: referralId || null,
    });

    if (response.data) {
      toast.success("Signup successful! Please check your email for verification.");
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Signup error:", error);
    toast.error(error.response?.data?.error || "Something went wrong during signup");
    return null;
  }
};
export function verifyOtp(otp, email) {
  return async (dispatch) => {
    try {
      // Make API call to verify OTP
      const response = await apiConnector("POST", endpoints.VERIFY_SIGNUP_API, { otp, email });
      ("Verify OTP API response:", response);

      // Check response for success
      if (!response.data) {
        throw new Error('Error: Response data is missing.'); // Specific error message
      }
 
      // On success, store user data and update state
      const { token, user } = response.data;
      setUserDataWithExpiry(token, user);
      dispatch(loginSuccess({ token, user, expiry: new Date().getTime() + (3 * 24 * 60 * 60 * 1000) }));
      toast.success("OTP verified successfully!");  // Show success toast
      return response.data;  // Ensure response data is returned
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Failed to verify OTP. Please try again."); // Show error toast
      throw error;  // Ensure the error is thrown to be caught in the calling function
    }
  };
}


export const resendOtp = async (email) => {
  try {
    const response = await apiConnector("POST", endpoints.RESEND_VERIFICATION_EMAIL_API, { email });
    if (response.data) {
      return response.data;
    }
    throw new Error("Failed to resend OTP");
  } catch (error) {
    console.error("Resend OTP error:", error);
    throw error;
  }
};

export const googleSignIn = async () => {
  try {
    // Implement Google Sign In Logic here
    // This will depend on your backend implementation
    toast.info("Google Sign In functionality will be implemented soon!");
  } catch (error) {
    console.error("Google Sign In error:", error);
    toast.error("Failed to sign in with Google");
  }
};

export const signIn = async (loginId) => {

  try {
    const response = await apiConnector("POST", endpoints.SIGNIN_API, { loginId });
    return response.data;
  } catch (error) {
    console.error("Signin error:", error);
    throw error;
  }
};

export const verifySignIn = async (formData, dispatch) => {
  const { loginId, otp } = formData;
  try {
    const response = await apiConnector("POST", endpoints.VERIFY_SIGNIN_API, { loginId, otp });
    if (response.data) {
      const { token, user } = response.data;
      setUserDataWithExpiry(token, user);
      dispatch(loginSuccess({ token, user, expiry: new Date().getTime() + (3 * 24 * 60 * 60 * 1000) }));
      return response.data;
    }
    throw new Error("Signin failed");
  } catch (error) {
    console.error("Signin error:", error);
    toast.error(error.response?.data?.error || "Something went wrong during signin");
    throw error;
  }
};
