create table if not exists account
(
    id          uuid         not null primary key,
    name        varchar(50)  not null unique,

    created_at  timestamp    not null,
    updated_at  timestamp    not null,
    archived_at timestamp    null
    );
