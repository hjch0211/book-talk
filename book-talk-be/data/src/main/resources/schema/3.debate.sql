create table if not exists debate
(
    id             uuid         not null primary key,
    host_id        uuid         not null,
    book_image_url varchar(300) not null,
    topic          varchar(100) not null,
    description    varchar(300) null,
    head_count     int          not null,
    started_at     timestamp    not null,
    closed_at      timestamp    null,

    created_at     timestamp    not null,
    updated_at     timestamp    not null,
    archived_at    timestamp    null
);
