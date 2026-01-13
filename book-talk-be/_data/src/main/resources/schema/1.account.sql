create table if not exists account
(
    id            uuid         not null primary key,
    name          varchar(50)  not null unique,
    refresh_token varchar(255) null,

    created_at    timestamp    not null,
    updated_at    timestamp    not null,
    archived_at   timestamp    null
);
