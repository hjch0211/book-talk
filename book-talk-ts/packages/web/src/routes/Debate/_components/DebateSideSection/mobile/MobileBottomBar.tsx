import type { CurrentRoundInfo, PresentationInfo, RoundType } from '@src/externals/debate';
import type { RaisedHandInfo } from '@src/externals/websocket';
import type { OnlineMember } from '@src/hooks/domain/useDebateRealtimeConnection';
import { useRef, useState } from 'react';
import {
  MobileBottomBarHandle,
  MobileBottomBarShadowWrapper,
  MobileBottomBarStyled,
  MobileTabBar,
} from '../style.ts';
import { MobileDebateCTASection } from './MobileDebateCTASection.tsx';
import { MobilePartyList } from './MobilePartyList.tsx';

const EXPAND_TRIGGER = 5;       // px — 이 이상 위로 움직이면 즉시 펼침
const COLLAPSE_THRESHOLD = 60;  // px — 이 이상 아래로 드래그하면 접힘
const VELOCITY_THRESHOLD = 0.4; // px/ms — 빠른 아래 flick에 접힘
const MAX_DRAG = 582 - 120;     // 최대 아래 드래그 범위 (expanded - collapsed)

interface Props {
  roundType: RoundType;
  myRole: string;
  isCurrentSpeaker: boolean;
  onStartDebate: () => void;
  onEndPresentation: () => void;
  isVoiceChatJoined: boolean;
  isVoiceMuted: boolean;
  onToggleMute: () => void;
  isMyHandRaised: boolean;
  onToggleHand: () => void;
  members: OnlineMember[];
  myAccountId?: string;
  currentSpeaker: CurrentRoundInfo['currentSpeaker'];
  nextSpeaker: CurrentRoundInfo['nextSpeaker'];
  raisedHands: RaisedHandInfo[];
  realTimeRemainingSeconds: number;
  onPassSpeaker: (memberId: string) => void;
  presentations: PresentationInfo[];
}

export function MobileBottomBar({
  roundType,
  myRole,
  isCurrentSpeaker,
  onStartDebate,
  onEndPresentation,
  isVoiceChatJoined,
  isVoiceMuted,
  onToggleMute,
  isMyHandRaised,
  onToggleHand,
  members,
  myAccountId,
  currentSpeaker,
  nextSpeaker,
  raisedHands,
  realTimeRemainingSeconds,
  onPassSpeaker,
  presentations,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  // 축소 방향 드래그 offset (양수 = 아래로 내려감)
  const [collapseOffset, setCollapseOffset] = useState(0);
  const [isCollapseDragging, setIsCollapseDragging] = useState(false);

  const dragStartY = useRef<number | null>(null);
  const lastMoveY = useRef<number>(0);
  const lastMoveTime = useRef<number>(0);
  const velocityRef = useRef<number>(0); // px/ms, 양수 = 아래

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartY.current = e.clientY;
    lastMoveY.current = e.clientY;
    lastMoveTime.current = Date.now();
    velocityRef.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;

    const now = Date.now();
    const dt = now - lastMoveTime.current;
    if (dt > 0) {
      velocityRef.current = (e.clientY - lastMoveY.current) / dt;
    }
    lastMoveY.current = e.clientY;
    lastMoveTime.current = now;

    const rawDelta = e.clientY - dragStartY.current; // 양수 = 아래, 음수 = 위

    if (!isExpanded) {
      // 축소 상태: 위로 EXPAND_TRIGGER px 이상 → 즉시 펼침
      if (rawDelta < -EXPAND_TRIGGER) {
        setIsExpanded(true);
        // 이후 같은 제스처에서 아래 드래그로 다시 닫을 수 있도록 기준점 리셋
        dragStartY.current = e.clientY;
      }
    } else {
      // 확장 상태: 아래 드래그 → 슬라이드 피드백
      if (rawDelta > 0) {
        setIsCollapseDragging(true);
        setCollapseOffset(Math.min(rawDelta, MAX_DRAG));
      } else {
        setCollapseOffset(0);
      }
    }
  };

  const handlePointerUp = () => {
    if (dragStartY.current === null) return;

    if (isExpanded && collapseOffset > 0) {
      const vel = velocityRef.current;
      if (collapseOffset > COLLAPSE_THRESHOLD || vel > VELOCITY_THRESHOLD) {
        setIsExpanded(false);
      }
    }

    dragStartY.current = null;
    setCollapseOffset(0);
    setIsCollapseDragging(false);
  };

  return (
    <MobileTabBar
      $expanded={isExpanded}
      style={{
        // 축소 드래그 중에만 아래로 translateY 적용
        transform: collapseOffset > 0 ? `translateY(${collapseOffset}px)` : undefined,
        transition: isCollapseDragging
          ? 'none'
          : 'height 0.25s ease, transform 0.25s ease',
      }}
    >
      <MobileBottomBarShadowWrapper>
        <MobileBottomBarStyled
          $expanded={isExpanded}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {isExpanded && <MobileBottomBarHandle />}
          <MobileDebateCTASection
            roundType={roundType}
            myRole={myRole}
            isCurrentSpeaker={isCurrentSpeaker}
            onStartDebate={onStartDebate}
            onEndPresentation={onEndPresentation}
            isVoiceChatJoined={isVoiceChatJoined}
            isVoiceMuted={isVoiceMuted}
            onToggleMute={onToggleMute}
            isMyHandRaised={isMyHandRaised}
            onToggleHand={onToggleHand}
            isExpanded={isExpanded}
            onToggleExpanded={() => setIsExpanded((prev) => !prev)}
          />
        </MobileBottomBarStyled>
      </MobileBottomBarShadowWrapper>

      {isExpanded && (
        <MobilePartyList
          members={members}
          myAccountId={myAccountId}
          currentSpeaker={currentSpeaker}
          nextSpeaker={nextSpeaker}
          raisedHands={raisedHands}
          realTimeRemainingSeconds={realTimeRemainingSeconds}
          onPassSpeaker={onPassSpeaker}
          presentations={presentations}
          roundType={roundType}
        />
      )}
    </MobileTabBar>
  );
}
