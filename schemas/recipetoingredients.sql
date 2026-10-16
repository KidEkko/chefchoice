CREATE TABLE recipe_to_ingredients (
  row_id serial primary key,
  recipe_id references recipes,
  ingredient_id references ingredients,
  amount integer not null,
  unit text not null,
  notes text,
)