create table if not exists account
(
    id            uuid         not null primary key,
    provider      varchar(20)  null, -- GOOGLE
    email         varchar(255) not null unique,
    name          varchar(50)  not null unique,
    password      varchar(255) null, -- 소셜 유저는 x
    refresh_token varchar(300) null,

    created_at    timestamp    not null default now(),
    updated_at    timestamp    not null default now(),
    archived_at   timestamp    null
);

CREATE INDEX IF NOT EXISTS idx_account_email ON account (email);