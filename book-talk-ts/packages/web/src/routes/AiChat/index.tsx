import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, CircularProgress, Typography } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
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
import { DebateCreateStep } from './_components/DebateCreateStep';
import { PersonaSelect } from './_components/PersonaSelect';
import { WelcomeStep } from './_components/WelcomeStep';
import {
  AiChatContainer,
  ButtonRow,
  DebateCardWrapper,
  DebateCarousel,
  DebateStepWrapper,
  LoadingWrapper,
  NameContentCard,
  NameInput,
  NameInputBody,
  NameStepTitle,
  PrivacyNotice,
  StepContainer,
} from './style';

type Step = 'welcome' | 'name' | 'debate' | 'create' | 'persona';

export function AiChatPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [debateId, setDebateId] = useState('');
  const [name, setName] = useState('');
  const [persona, setPersona] = useState(PERSONAS[0].id);
  const [personaBackStep, setPersonaBackStep] = useState<'debate' | 'create'>('debate');

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
          <Box sx={{ height: '200px' }} />
          <StepContainer>
            <WelcomeStep onStart={() => setStep('name')} />
          </StepContainer>
        </AiChatContainer>
      )}

      {step === 'name' && (
        <AiChatContainer>
          <StepContainer>
            <NameStepTitle>토론에서 불리고 싶은 이름을 써주세요</NameStepTitle>
            <NameContentCard>
              <NameInputBody>
                <NameInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="최대 10자"
                  maxLength={10}
                  autoFocus
                />
                <AppButton
                  fullWidth={false}
                  disabled={!name.trim()}
                  sx={{ borderRadius: '18px' }}
                  onClick={() => setStep('debate')}
                >
                  토론주제 선택하기 <ArrowForwardIcon sx={{ width: 16, height: 16 }} />
                </AppButton>
              </NameInputBody>
            </NameContentCard>
          </StepContainer>
          <PrivacyNotice sx={{ position: 'absolute', bottom: 35, right: 80, m: 0 }}>
            * 개인 정보는 토론 진행 후 삭제되며 추가 목적으로 활용되지 않습니다.
          </PrivacyNotice>
        </AiChatContainer>
      )}

      {step === 'debate' && (
        <AiChatContainer>
          <StepContainer>
            <NameStepTitle>토론주제 선택하기</NameStepTitle>
            <DebateStepWrapper>
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
                  onCreateDebate={() => setStep('create')}
                />
              )}
            </DebateStepWrapper>
          </StepContainer>
          <ButtonRow>
            <AppButton appVariant="white" fullWidth={false} onClick={() => setStep('name')}>
              <ArrowBackIcon sx={{ width: 16, height: 16 }} /> 이름 수정하기
            </AppButton>
            <AppButton
              fullWidth={false}
              disabled={!debateId}
              sx={{ width: 194, height: 52, borderRadius: '18px' }}
              onClick={() => {
                setPersonaBackStep('debate');
                setStep('persona');
              }}
            >
              토론상대 선택하기 <ArrowForwardIcon sx={{ width: 16, height: 16 }} />
            </AppButton>
          </ButtonRow>
        </AiChatContainer>
      )}

      {step === 'create' && (
        <AiChatContainer>
          <StepContainer>
            <DebateCreateStep
              onBack={() => setStep('debate')}
              onSuccess={(id) => {
                setDebateId(id);
                setPersonaBackStep('create');
                setStep('persona');
              }}
            />
          </StepContainer>
        </AiChatContainer>
      )}

      {step === 'persona' && (
        <AiChatContainer>
          <StepContainer>
            <NameStepTitle>토론상대 선택하기</NameStepTitle>
            <PersonaSelect personas={PERSONAS} selectedValue={persona} onSelect={setPersona} />
          </StepContainer>
          <ButtonRow>
            <AppButton
              appVariant="white"
              fullWidth={false}
              onClick={() => setStep(personaBackStep)}
            >
              <ArrowBackIcon sx={{ width: 16, height: 16 }} />
              토론주제 선택하기
            </AppButton>
            <AppButton
              fullWidth={false}
              disabled={!persona || isPending}
              sx={{ borderRadius: '18px' }}
              onClick={() => handleCreateChat()}
            >
              {isPending ? (
                <CircularProgress size={16} sx={{ color: '#8b7cf8' }} />
              ) : (
                <>
                  채팅방 생성하기
                  <ArrowForwardIcon sx={{ width: 16, height: 16 }} />
                </>
              )}
            </AppButton>
          </ButtonRow>
        </AiChatContainer>
      )}
    </AiPageRoot>
  );
}
