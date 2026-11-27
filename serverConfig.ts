export const Paths = Object.freeze({
    HOME: "/",
    LOGIN: "/login",
    PROFILE: "/profile",
    NOT_FOUND: "/404",
});


export const ErrorMessages = Object.freeze({
    // Authentication & Authorization
    Auth: {
        INVALID_CREDENTIALS: "Incorrect email/password",
        INVALID_SESSION: "Session is invalid. Please log in again.",
        LOGIN_FAILED: "Failed to log in. Please check your credentials and try again.",
        SIGNUP_FAILED: "Failed to create account. Please try again.",
        EMAIL_IN_USE: "An account with this email already exists.",
        ACCOUNT_CREATION_FAILED: "Failed to create your account. Please try again.",
    },

    // Validation Errors (User-facing)
    Validation: {
        NO_USERNAME: "Username is required",
        NO_EMAIL: "Email is required",
        NO_PASSWORD: "Password is required",
        INVALID_EMAIL: "Invalid email",
        USERNAME_TOO_SHORT: "Username must be at least 4 characters",
        USERNAME_INVALID_FORMAT: "Username must contain only letters and numbers",
        USERNAME_TOO_LONG: "Username must be less than 64 characters",
        PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
        PASSWORD_TOO_LONG: "Password cannot be more than 24 characters",
        PASSWORDS_DONT_MATCH: "Passwords must match",
        PASSWORD_NOT_NEW: "New password must be different from old",
        FORM_INCOMPLETE: "Title or URL must be submitted",
    },

    // Recipe Errors
    Recipe: {
        GET_FAILED: "Failed to get recipe.",
        RECOMMEND_FAILED: "Failed to find recipe recommendations. Please try again.",
        NO_RECIPES_FOUND: "No recipes match your selected ingredients.",
    },

    // Pantry Errors
    Pantry: {
        CREATE_FAILED: "Failed to create pantry. Please try again.",
        UPDATE_FAILED: "Failed to update pantry. Please try again.",
        NOT_FOUND: "Pantry not found.",
        DELETE_FAILED: "Failed to delete pantry items. Please try again.",
    },

    // User Update Errors
    User: {
        UPDATE_FAILED: "Unable to update. Please try again later.",
    },

    // Generic/Server Errors (Internal)
    Server: {
        GENERIC: "Something went wrong",
        NO_ROWS_RETURNED: "No rows returned in response",
    },
});

