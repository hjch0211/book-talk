create table if not exists app_config
(
    key           varchar(255) not null,
    value         text         not null,
    cache_seconds bigint       null default null
);
