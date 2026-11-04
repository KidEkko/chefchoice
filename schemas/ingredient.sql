CREATE TABLE ingredients (
  ingredient_id serial primary key,
  name text unique not null,
  cost money not null,
  base_unit text not null
);