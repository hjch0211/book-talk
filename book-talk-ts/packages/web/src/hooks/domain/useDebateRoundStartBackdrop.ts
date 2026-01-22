import type { RoundType } from '@src/externals/debate';
import { useState } from 'react';

interface RoundStartBackdropState {
  show: boolean;
  type: RoundType | null;
}

/**
 * 라운드 시작 백드롭 UI 상태 관리
 * - 백드롭 표시/숨김
 * - 5초 후 자동 닫힘
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateRoundStartBackdrop = () => {
  const [state, setState] = useState<RoundStartBackdropState>({
    show: false,
    type: null,
  });

  const close = () => {
    setState({ show: false, type: null });
  };

  const open = (roundType: RoundType) => {
    setState({ show: true, type: roundType });
    setTimeout(close, 5000);
  };

  return {
    /** 백드롭 표시 여부 */
    show: state.show,
    /** 현재 라운드 타입 */
    type: state.type,
    /** 백드롭 열기 (5초 후 자동 닫힘) */
    open,
    /** 백드롭 닫기 */
    close,
  };
};
