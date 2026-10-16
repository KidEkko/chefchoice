CREATE TABLE meal_prep (
  row_id serial primary key,
  user_id references users,
  recipe_id references recipes,
  date_for timestamptz not null, 
  meal_type text not null,
  created_on timestamptz default current_date,
  is_deleted boolean not null default false,
)