import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

/** 전체 스켈레톤 컨테이너 */
export const SkeletonContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100vh',
  background: '#ffffff',
});

/** 네비게이션 바 스켈레톤 */
export const SkeletonNavigationBar = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  padding: '80px 127px 40px 120px',
  gap: '10px',
  position: 'absolute',
  width: '100%',
  height: '180px',
  left: 0,
  top: 0,
  background: 'linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #ffffff 9.13%)',
  zIndex: 10,
  [theme.breakpoints.down('md')]: {
    height: '64px',
    padding: '0 16px',
    justifyContent: 'center',
    background: '#ffffff',
    boxShadow: '0px 1px 0px #E8EBFF',
  },
}));

export const SkeletonNavContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '80px',
  width: '1193px',
  height: '60px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    gap: '12px',
    height: '100%',
  },
}));

/** 타이틀 스켈레톤 */
export const SkeletonTitle = styled(Skeleton)(({ theme }) => ({
  width: '400px',
  height: '32px',
  borderRadius: '8px',
  [theme.breakpoints.down('md')]: {
    width: '160px',
    height: '20px',
  },
}));

/** 버튼 그룹 스켈레톤 */
export const SkeletonButtonGroup = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  marginLeft: 'auto',
});

export const SkeletonButton = styled(Skeleton)(({ theme }) => ({
  width: '85px',
  height: '40px',
  borderRadius: '4px',
  [theme.breakpoints.down('md')]: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
  },
}));

/** 메인 컨텐츠 영역 스켈레톤 */
export const SkeletonMainContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  width: '970px',
  left: '120px',
  top: '200px',
  [theme.breakpoints.down('md')]: {
    left: 0,
    right: 0,
    top: '64px',
    width: '100%',
    bottom: '80px',
  },
}));

/** 프레젠테이션 영역 스켈레톤 */
export const SkeletonPresentationArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '60px 90px 100px 60px',
  gap: '16px',
  width: '970px',
  minHeight: '400px',
  background: '#ffffff',
  boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '24px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '100%',
    minHeight: 'unset',
    borderRadius: 0,
    boxShadow: 'none',
    padding: '24px 20px',
    boxSizing: 'border-box',
  },
}));

export const SkeletonPresentationTitle = styled(Skeleton)({
  width: '60%',
  height: '32px',
  borderRadius: '8px',
});

export const SkeletonPresentationLine = styled(Skeleton)({
  width: '100%',
  height: '24px',
  borderRadius: '4px',
});

export const SkeletonPresentationLineShort = styled(Skeleton)({
  width: '75%',
  height: '24px',
  borderRadius: '4px',
});

/** 멤버 리스트 스켈레톤 */
export const SkeletonMemberListContainer = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '16px 15px',
  gap: '24px',
  position: 'absolute',
  width: '280px',
  height: '472px',
  left: '1117px',
  top: '200px',
  background: '#ffffff',
  borderRadius: '24px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const SkeletonMemberListHeader = styled(Skeleton)({
  width: '100px',
  height: '20px',
  borderRadius: '4px',
});

export const SkeletonMemberItem = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '14px',
  width: '250px',
  height: '72px',
  padding: '16px 24px',
  background: '#f5f5f5',
  borderRadius: '2px 50px 50px 2px',
});

export const SkeletonMemberAvatar = styled(Skeleton)({
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  flexShrink: 0,
});

export const SkeletonMemberInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
});

export const SkeletonMemberName = styled(Skeleton)({
  width: '80px',
  height: '16px',
  borderRadius: '4px',
});

export const SkeletonMemberRole = styled(Skeleton)({
  width: '50px',
  height: '12px',
  borderRadius: '4px',
});

/** 채팅 입력 영역 스켈레톤 */
export const SkeletonChatInputContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: '970px',
  left: '120px',
  minHeight: '138px',
  bottom: 0,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  padding: '22px 0',
  background: 'linear-gradient(360deg, #ffffff 89.9%, rgba(255, 255, 255, 0) 100%)',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const SkeletonChatInputBox = styled(Skeleton)({
  width: '820px',
  height: '45px',
  borderRadius: '16px',
});

/** 액션 버튼 스켈레톤 */
export const SkeletonActionButtonContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '1167px',
  top: '742px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const SkeletonActionButton = styled(Skeleton)({
  width: '193px',
  height: '64px',
  borderRadius: '24px',
});

/** 모바일 바텀바 스켈레톤 */
export const SkeletonMobileBottomBar = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: '80px',
    background: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0px -2px 10px #E8EBFF',
    borderRadius: '24px 24px 0 0',
    padding: '0 24px',
  },
}));

export const SkeletonMobileBarButton = styled(Skeleton)({
  width: '80px',
  height: '48px',
  borderRadius: '24px',
});

/** 로딩 오버레이 (연결 중 표시) */
export const LoadingOverlay = styled(Box)({
  position: 'fixed',
  top: '-120px',
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.5)',
  zIndex: 1000,
  gap: '18px',
});

export const LoadingText = styled('div')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 300,
  fontSize: '18px',
  lineHeight: '180%',
  letterSpacing: '0.3px',
  color: '#262626',
});

export const LoadingSubText = styled('div')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#7b7b7b',
});
