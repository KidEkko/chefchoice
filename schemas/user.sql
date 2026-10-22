CREATE TABLE users (
  user_id serial primary key,
  email text unique not null,
  username text,
  password text not null,
  created_on timestamptz not null default current_date,
  is_deleted boolean not null default false,
  deleted_on timestamptz,
  is_admin boolean not null default false
);