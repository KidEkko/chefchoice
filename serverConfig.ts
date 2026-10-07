import "server-only";

export const RoleString = Object.freeze({
    Owner: "chef_owner_user",
    Admin: "chef_admin_user",
    Basic: "only_a_basic_user",
});

export const RoleLevels = Object.freeze({
    Owner: 3,
    Admin: 2,
    Basic: 1,
});

export const RoleMap = new Map([
    [RoleString.Owner, RoleLevels.Owner],
    [RoleString.Admin, RoleLevels.Admin],
    [RoleString.Basic, RoleLevels.Basic],
]);

// not sure if I should be doing this
// making an array doesn't sound good much better than this
export const RoleIntMap = new Map([
    [RoleLevels.Owner, RoleString.Owner],
    [RoleLevels.Admin, RoleString.Admin],
    [RoleLevels.Basic, RoleString.Basic],
]);

export const Paths = Object.freeze({
    HOME: "/",
    ADMIN: "/admin",
    OWNER: "/owner",
    NOT_FOUND: "/404",
});

// TODO: delete or make these useful
export const PathIcons = Object.freeze({
    Basic: [
        {
            id: 0,
            path: Paths.HOME,
            title: "Home",
            icon: "home",
        },
    ],
    Admin: [
        {
            id: 5,
            path: Paths.ADMIN,
            title: "Admin",
            icon: "important",
        },
    ],
    Owner: [
        {
            id: 6,
            path: Paths.OWNER,
            title: "Owner",
            icon: "boss",
        },
    ],
});


// These technically shouldn't be publically facing
// But also they don't mean anything
export const ErrorMessages = Object.freeze({
  NO_ERROR: "",
  FORM_FILL_ERROR: "Title or URL must be submitted",
  DEFAULT_UPDATE_USER_ERROR: "Unable to Update, Please Try Again Later",
  DEFAULT_LOGIN_ERROR: "There was an error, please try again later if this persists",
  NO_USERNAME_ERROR: "Username is Required",
  NO_EMAIL_ERROR: "Email is Required",
  NO_USERNAME_EMAIL_ERROR: "Username/Email is Required",
  USERNAME_TOO_SHORT_ERROR: "Username must be at least 6 characters",
  USERNAME_TOO_LONG_ERROR: "Username must be less than 64 characters",
  NEW_USERNAME_ERROR: "Not a new name ?",
  NO_PASSWORD_ERROR: "Password is Required",
  NO_NEW_PASSWORD_ERROR: "New Password is Required",
  NO_EXTRA_PASSWORD_ERROR: "Confirmation Password is Required",
  PASSWORD_MATCHING_ERROR: "Passwords must Match",
  PASSWORD_LENGTH_ERROR: "Password must be at least 6 characters",
  PASSWORD_TOO_LONG_ERROR: "Password cannot be more than 24 characters",
  NOT_NEW_PASSWORD_ERROR: "New password must be different from old",
  VALID_EMAIL_ERROR: "Invalid Email",
  INHUMAN_MATH_TIME: "Did you really complete it that fast?",
  NO_ROWS_RETURNED: "No rows returned in response",
  GENERIC_ERROR: "Something Went Wrong",
  GENERIC_SUPER_ERROR: "Something Went Very, Very Wrong. Contact Owner Please",
});

