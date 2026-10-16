CREATE TABLE ingredients (
  ingredient_id serial primary key,
  name text unique not null,
)