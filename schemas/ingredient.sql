CREATE TABLE ingredients (
  ingredient_id serial primary key,
  name text unique not null,
  cost money,
  base_unit text
);