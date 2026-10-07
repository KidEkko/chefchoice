const HOUR_IN_SECONDS = 60 * 60;
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24;
const SIX_DAYS_IN_SECONDS = HOUR_IN_SECONDS * 24 * 6;
const WEEK_IN_SECONDS = HOUR_IN_SECONDS * 24 * 7;
const MONTH_IN_SECONDS = DAY_IN_SECONDS * 31;
const YEAR_IN_SECONDS = DAY_IN_SECONDS * 365;

export const Seconds = Object.freeze({
  Hour: HOUR_IN_SECONDS,
  Day: DAY_IN_SECONDS,
  SixDays: SIX_DAYS_IN_SECONDS,
  Week: WEEK_IN_SECONDS,
  Month: MONTH_IN_SECONDS,
  Year: YEAR_IN_SECONDS,
});

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
    // TODO: original used Paths.ME, which doesn't exist (so path was undefined).
    // Assumed PROFILE was intended.
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