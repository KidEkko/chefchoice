CREATE TABLE pantry_to_ingredients (
  row_id serial primary key,
  pantry_id integer references pantries,
  ingredient_id integer references ingredients,
  amount numeric not null,
  unit text not null,
  note text
);