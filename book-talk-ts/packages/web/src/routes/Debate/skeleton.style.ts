import styled from '@emotion/styled';
import { Box, Skeleton } from '@mui/material';

/** 전체 스켈레톤 컨테이너 */
export const SkeletonContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: #ffffff;
`;

/** 네비게이션 바 스켈레톤 */
export const SkeletonNavigationBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 80px 127px 40px 120px;
  gap: 10px;
  position: absolute;
  width: 100%;
  height: 180px;
  left: 0;
  top: 0;
  background: linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #ffffff 9.13%);
  z-index: 10;
`;

export const SkeletonNavContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 80px;
  width: 1193px;
  height: 60px;
`;

/** 타이틀 스켈레톤 */
export const SkeletonTitle = styled(Skeleton)`
  width: 400px;
  height: 32px;
  border-radius: 8px;
`;

/** 버튼 그룹 스켈레톤 */
export const SkeletonButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-left: auto;
`;

export const SkeletonButton = styled(Skeleton)`
  width: 85px;
  height: 40px;
  border-radius: 4px;
`;

/** 메인 컨텐츠 영역 스켈레톤 */
export const SkeletonMainContent = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 970px;
  left: 120px;
  top: 200px;
`;

/** 프레젠테이션 영역 스켈레톤 */
export const SkeletonPresentationArea = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 60px 90px 100px 60px;
  gap: 16px;
  width: 970px;
  min-height: 400px;
  background: #ffffff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 24px;
`;

export const SkeletonPresentationTitle = styled(Skeleton)`
  width: 60%;
  height: 32px;
  border-radius: 8px;
`;

export const SkeletonPresentationLine = styled(Skeleton)`
  width: 100%;
  height: 24px;
  border-radius: 4px;
`;

export const SkeletonPresentationLineShort = styled(Skeleton)`
  width: 75%;
  height: 24px;
  border-radius: 4px;
`;

/** 멤버 리스트 스켈레톤 */
export const SkeletonMemberListContainer = styled(Box)`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 15px;
  gap: 24px;
  position: absolute;
  width: 280px;
  height: 472px;
  left: 1117px;
  top: 200px;
  background: #ffffff;
  border-radius: 24px;
`;

export const SkeletonMemberListHeader = styled(Skeleton)`
  width: 100px;
  height: 20px;
  border-radius: 4px;
`;

export const SkeletonMemberItem = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  width: 250px;
  height: 72px;
  padding: 16px 24px;
  background: #f5f5f5;
  border-radius: 2px 50px 50px 2px;
`;

export const SkeletonMemberAvatar = styled(Skeleton)`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  flex-shrink: 0;
`;

export const SkeletonMemberInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const SkeletonMemberName = styled(Skeleton)`
  width: 80px;
  height: 16px;
  border-radius: 4px;
`;

export const SkeletonMemberRole = styled(Skeleton)`
  width: 50px;
  height: 12px;
  border-radius: 4px;
`;

/** 채팅 입력 영역 스켈레톤 */
export const SkeletonChatInputContainer = styled(Box)`
  position: absolute;
  width: 970px;
  left: 120px;
  min-height: 138px;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 22px 0;
  background: linear-gradient(360deg, #ffffff 89.9%, rgba(255, 255, 255, 0) 100%);
`;

export const SkeletonChatInputBox = styled(Skeleton)`
  width: 820px;
  height: 45px;
  border-radius: 16px;
`;

/** 액션 버튼 스켈레톤 */
export const SkeletonActionButtonContainer = styled(Box)`
  position: absolute;
  left: 1167px;
  top: 742px;
`;

export const SkeletonActionButton = styled(Skeleton)`
  width: 193px;
  height: 64px;
  border-radius: 24px;
`;

/** 로딩 오버레이 (연결 중 표시) */
export const LoadingOverlay = styled(Box)`
  position: fixed;
  top: -120px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  z-index: 1000;
  gap: 18px;
`;

export const LoadingText = styled.div`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 18px;
  line-height: 180%;
  letter-spacing: 0.3px;
  color: #262626;
`;

export const LoadingSubText = styled.div`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 200;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.3px;
  color: #7b7b7b;
`;
