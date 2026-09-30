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
