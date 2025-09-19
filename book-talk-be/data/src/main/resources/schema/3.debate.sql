create table if not exists debate
(
    id             uuid         not null primary key,
    host_id        uuid         not null,
    book_image_url varchar(300) not null,
    topic          varchar(100) not null,
    description    varchar(300) null,
    closed_at      timestamp    null,

    created_at     timestamp    not null,
    updated_at     timestamp    not null,
    archived_at    timestamp    null
);

create table if not exists debate_member
(
    id          bigint      not null primary key,
    debate_id   uuid        not null,
    account_id  uuid        not null,
    role        varchar(10) not null, -- HOST, MEMBER

    created_at  timestamp   not null,
    updated_at  timestamp   not null,
    archived_at timestamp   null
);

create table if not exists debate_round
(
    id              bigint      not null primary key,
    debate_id       uuid        not null,
    type            varchar(20) not null, -- PRESENTATION, FREE
    next_speaker_id uuid        null,
    ended_at        timestamp   null,

    created_at      timestamp   not null,
    updated_at      timestamp   not null,
    archived_at     timestamp   null
);

create table if not exists debate_round_speaker
(
    id              bigint    not null primary key,
    debate_round_id bigint    not null,
    account_id      uuid      not null,
    ended_at        timestamp not null,

    created_at      timestamp not null,
    updated_at      timestamp not null,
    archived_at     timestamp null
);