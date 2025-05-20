const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/verify-email",
    SIGNUP_API: BASE_URL + "/users/signup",
    SIGNIN_API: BASE_URL + "/users/login",
    VERIFY_SIGNIN_API: BASE_URL + "/users/verify-signin",
    VERIFY_SIGNUP_API: BASE_URL + "/users/verify-email",
    RESEND_VERIFICATION_EMAIL_API: BASE_URL + "/users/resend-verification",
    LOGOUT_API: BASE_URL + "/users/logout",
};

export const onboardingEndpoints = {
    ONBOARDING_API: BASE_URL + "/users/onboarding",
    GET_ONBOARDING_API: BASE_URL + "/users/onboarding/:id",
    UPDATE_ONBOARDING_API: BASE_URL + "/users/onboarding/:id",
};

export const profileEndpoints = {
    CREATE_PROFILE_API: BASE_URL + "/profile",
    GET_PROFILE_API: BASE_URL + "/profile",
    UPDATE_PROFILE_API: BASE_URL + "/profile",
    CHECK_PROFILE_COMPLETION_API: BASE_URL + "/profile/check-completion",
};

