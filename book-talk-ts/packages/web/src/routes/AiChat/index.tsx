import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { createAiChat } from '@src/externals/aiChat';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/templates/PageContainer';
import { AiChatContainer, AiChatHeader, SetupCard, SetupRow } from './style';

const PERSONA_OPTIONS = [{ value: 'a', label: 'A' }];

export function AiChatPage() {
  const [debateId, setDebateId] = useState('');
  const [persona, setPersona] = useState('');
  const navigate = useNavigate();

  /** 채팅방 생성 */
  const createMutation = useMutation({
    mutationFn: () => createAiChat({ debateId, persona }),
    onSuccess: (data) => {
      navigate(`/ai-chat/${data.chatId}`);
    },
  });

  const handleCreateChat = () => {
    if (!debateId || !persona) return;
    createMutation.mutate();
  };

  return (
    <PageContainer>
      <AiChatContainer>
        <AiChatHeader>AI Chat</AiChatHeader>

        <SetupCard>
          <SetupRow>
            <TextField
              size="small"
              label="Debate ID"
              value={debateId}
              onChange={(e) => setDebateId(e.target.value)}
              sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <FormControl
              size="small"
              sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            >
              <InputLabel>Persona</InputLabel>
              <Select value={persona} label="Persona" onChange={(e) => setPersona(e.target.value)}>
                {PERSONA_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={handleCreateChat}
              disabled={createMutation.isPending || !debateId || !persona}
              sx={{ borderRadius: '8px', textTransform: 'none' }}
            >
              {createMutation.isPending ? '생성중...' : '채팅방 생성'}
            </Button>
          </SetupRow>
        </SetupCard>
      </AiChatContainer>
    </PageContainer>
  );
}
