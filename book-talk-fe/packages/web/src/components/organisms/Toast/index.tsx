import type {SxProps, Theme} from '@mui/material';
import {Alert, Snackbar} from '@mui/material';
import {alertStyle} from './style.ts';

export interface ToastProps {
    /** 토스트 표시 여부 */
    open: boolean;
    /** 토스트 메시지 */
    message: string;
    /** 자동 숨김 시간 (ms), 미지정 시 영구 표시 */
    duration?: number;
    /** 추가 액션 버튼 */
    action?: React.ReactNode;
    /** 커스텀 아이콘 */
    icon?: React.ReactNode;
    /** 닫기 콜백 */
    onClose?: () => void;
    /** 클릭 콜백 */
    onClick?: () => void;
    /** 추가 스타일 */
    sx?: SxProps<Theme>;
}

/**
 * 토스트 알림 컴포넌트
 * - 상단 중앙에 표시
 * - duration 지정 시 자동 숨김
 */
export function Toast({open, message, duration, action, icon, onClose, onClick, sx}: ToastProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <Alert
                icon={icon}
                onClose={onClose}
                severity="info"
                variant="filled"
                action={action}
                onClick={onClick}
                sx={{...alertStyle, ...sx}}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
