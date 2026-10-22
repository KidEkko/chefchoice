CREATE TABLE recipes (
  recipe_id serial primary key,
  name text not null,
  user_id integer references users,
  instructions text,
  created_on timestamptz default current_date,
  is_deleted boolean not null default false
);