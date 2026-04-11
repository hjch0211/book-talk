import { Box, CircularProgress, Typography } from '@mui/material';
import { CrayonButton } from '@src/components/molecules/CrayonButton';
import { DebateCardSkeleton } from '@src/components/organisms/DebateCard/skeleton.tsx';
import { AiPageRoot } from '@src/components/templates/AiPageRoot';
import { PERSONAS } from '@src/constants/persona.ts';
import { createAiChat } from '@src/externals/aiChat';
import { findAllDebatesQueryOptions } from '@src/externals/debate';
import { useToast } from '@src/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DebateCarousel3D } from './_components/DebateCarousel3D';
import { PersonaCarousel3D } from './_components/PersonaCarousel3D';
import { WelcomeStep } from './_components/WelcomeStep';
import {
  AiChatContainer,
  DebateCardWrapper,
  DebateCarousel,
  LoadingWrapper,
  NameInput,
  NameInputWrapper,
  NavigationRow,
  StepContainer,
  StepTitle,
} from './style';

type Step = 'welcome' | 'debate' | 'name' | 'persona';

export function AiChatPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [debateId, setDebateId] = useState('');
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: debatesData, isLoading: isDebatesLoading } = useQuery(
    findAllDebatesQueryOptions({ page: 0, size: 8 })
  );
  const debates = debatesData?.page.content ?? [];

  const { mutate: handleCreateChat, isPending } = useMutation({
    mutationFn: () => createAiChat({ debateId, persona, name }),
    onSuccess: (data) => {
      navigate(`/ai-chat/${data.chatId}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '채팅방 생성에 실패했습니다.');
    },
  });

  return (
    <AiPageRoot>
      {step === 'welcome' && (
        <AiChatContainer>
          <StepContainer>
            <WelcomeStep onStart={() => setStep('name')} />
          </StepContainer>
        </AiChatContainer>
      )}

      {step === 'name' && (
        <AiChatContainer>
          <StepContainer>
            <StepTitle>이름 입력하기</StepTitle>
            <NameInputWrapper>
              <NameInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="채팅에서 사용할 이름을 입력하세요"
                maxLength={20}
                autoFocus
              />
              <Box sx={{ height: '200px' }} />
              <Typography variant="captionS" color="gray">
                * 개인 정보는 토론 진행 후 삭제되며 추가 목적으로 활용되지 않습니다.
              </Typography>
            </NameInputWrapper>
            <NavigationRow>
              <CrayonButton $variant="secondary" onClick={() => setStep('welcome')}>
                ← 이전
              </CrayonButton>
              <CrayonButton disabled={!name.trim()} onClick={() => setStep('debate')}>
                다음 →
              </CrayonButton>
            </NavigationRow>
          </StepContainer>
        </AiChatContainer>
      )}

      {step === 'debate' && (
        <AiChatContainer>
          <StepContainer>
            <StepTitle>토론 선택하기</StepTitle>
            {isDebatesLoading ? (
              <DebateCarousel>
                {[0, 1, 2, 3].map((i) => (
                  <DebateCardWrapper key={i} sx={{ pointerEvents: 'none' }}>
                    <DebateCardSkeleton />
                  </DebateCardWrapper>
                ))}
              </DebateCarousel>
            ) : debates.length === 0 ? (
              <LoadingWrapper>
                <Typography sx={{ color: '#999', fontFamily: "'S-Core Dream', sans-serif" }}>
                  참여 가능한 토론이 없습니다.
                </Typography>
              </LoadingWrapper>
            ) : (
              <DebateCarousel3D
                key={debates.map((d) => d.id).join(',')}
                debates={debates}
                selectedId={debateId}
                onSelect={setDebateId}
              />
            )}
            <NavigationRow>
              <CrayonButton $variant="secondary" onClick={() => setStep('name')}>
                ← 이전
              </CrayonButton>
              <CrayonButton disabled={!debateId} onClick={() => setStep('persona')}>
                다음 →
              </CrayonButton>
            </NavigationRow>
          </StepContainer>
        </AiChatContainer>
      )}

      {step === 'persona' && (
        <AiChatContainer>
          <StepContainer>
            <StepTitle>페르소나 선택하기</StepTitle>
            <PersonaCarousel3D personas={PERSONAS} selectedValue={persona} onSelect={setPersona} />
            <NavigationRow>
              <CrayonButton $variant="secondary" onClick={() => setStep('debate')}>
                ← 이전
              </CrayonButton>
              <CrayonButton disabled={!persona || isPending} onClick={() => handleCreateChat()}>
                {isPending ? (
                  <CircularProgress size={16} sx={{ color: '#8b7cf8' }} />
                ) : (
                  '채팅방 생성 →'
                )}
              </CrayonButton>
            </NavigationRow>
          </StepContainer>
        </AiChatContainer>
      )}
    </AiPageRoot>
  );
}
