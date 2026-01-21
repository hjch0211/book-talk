create table if not exists presentation
(
    id          uuid           not null primary key,
    debate_id   uuid           not null,
    account_id  uuid           not null,
    content     varchar(30000) not null,

    created_at  timestamp      not null default now(),
    updated_at  timestamp      not null default now(),
    archived_at timestamp      null
);
