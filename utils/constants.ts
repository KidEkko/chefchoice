export const CookieString = Object.freeze({
  UserToken: "user_token",
  Settings: "settings",
});

export const Paths = Object.freeze({
  HOME: "/",
  PROFILE: "/profile",
  NOT_FOUND: "/404",
});

export const PublicRoutes: readonly string[] = [Paths.HOME, Paths.NOT_FOUND];

export interface Tab {
  id: number;
  path: string;
  title: string;
  icon: string;
}

export const DefaultPaths: Tab[] = [
  {
    id: 0,
    path: Paths.HOME,
    title: "Home",
    icon: "home",
  },
  {
    id: 1,
    path: Paths.PROFILE,
    title: "Me",
    icon: "me",
  },
];

export const monthStrings: readonly string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];