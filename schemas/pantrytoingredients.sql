CREATE TABLE pantry_to_ingredients (
  row_id serial primary key,
  pantry_id integer references pantries,
  ingredient_id integer references ingredients,
  amount text not null default '',
  unit text,
  note text
);