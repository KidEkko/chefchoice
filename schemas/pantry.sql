CREATE TABLE pantries (
    pantry_id serial primary key,
    user_id integer unique references users,
    created_on timestamptz not null default current_date,
    is_deleted boolean not null default false,
    deleted_on timestamptz
);