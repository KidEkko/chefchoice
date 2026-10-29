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

export const RoleMap = new Map<string, number>([
    [RoleString.Owner, RoleLevels.Owner],
    [RoleString.Admin, RoleLevels.Admin],
    [RoleString.Basic, RoleLevels.Basic],
]);

export function GetRoleNum(arg: string): number {
    return RoleMap.get(arg) || RoleLevels.Basic;
}

export const RoleIntMap = new Map<number, string>([
    [RoleLevels.Owner, RoleString.Owner],
    [RoleLevels.Admin, RoleString.Admin],
    [RoleLevels.Basic, RoleString.Basic],
]);

// Currently not caring about an owner role since this project is very unlikely to want to distinguish the two
// Leaving the owner stuff in because why not
export function GetRoleString(isAdmin: boolean): string {
    return isAdmin ? RoleString.Admin : RoleString.Basic;
}

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
    INVALID_PASSWORD_ERROR: "Incorrect Password",
    INVALID_EMAIL_PASSWORD_ERROR: "Incorrect email/password",
    VALID_EMAIL_ERROR: "Invalid Email",
    NO_ROWS_RETURNED: "No rows returned in response",
    GENERIC_ERROR: "Something Went Wrong",
    INVALID_SESSION_ERROR: "Session is Invalid. Please try resetting login.",
    RECIPE_GET_FAIL_ERROR: "Failed to Get Recipe.",
    
});

