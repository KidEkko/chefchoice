CREATE TABLE recipe_to_ingredients (
  row_id serial primary key,
  recipe_id integer references recipes,
  ingredient_id integer references ingredients,
  amount text not null default '',
  unit text,
  note text
);