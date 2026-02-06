CREATE TABLE IF NOT EXISTS ai_chat
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debate_id   VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP NOT NULL DEFAULT now(),
    archived_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_chat_message
(
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id     UUID         NOT NULL REFERENCES ai_chat (id),
    role        VARCHAR(20)  NOT NULL,
    content     TEXT         NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT now(),
    archived_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_message_chat_id ON ai_chat_message (chat_id);
