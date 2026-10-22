CREATE TABLE ratings (
  row_id serial primary key,
  user_id integer references users,
  recipe_id integer references recipes,
  unique (user_id, recipe_id), -- we only want one user rating per recipe. make sure to update on insert conflict
  rating integer not null check (rating > 0 and rating < 6), -- check can be done on this end
  created_on timestamptz default current_date
);