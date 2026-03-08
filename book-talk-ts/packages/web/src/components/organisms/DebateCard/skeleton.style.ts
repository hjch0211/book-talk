import { Box, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SkeletonCardRoot = styled(Box)({
  boxSizing: 'border-box',
  position: 'relative',
  width: 281,
  height: 390,
  background: '#FFFFFF',
  border: '1px solid #D9D9D9',
  borderRadius: '18px',
  flexShrink: 0,
  overflow: 'hidden',
});

const AbsoluteSkeleton = styled(Skeleton)({
  position: 'absolute',
  transform: 'none',
});

export const SkeletonImage = styled(AbsoluteSkeleton)({
  width: 282,
  height: 163,
  left: -1,
  top: 0,
  borderRadius: 0,
});

export const SkeletonTitle = styled(AbsoluteSkeleton)({
  width: 86,
  height: 20,
  left: 19,
  top: 171,
  borderRadius: '8px',
});

export const SkeletonDivider = styled(Box)({
  position: 'absolute',
  width: 246,
  left: 19,
  top: 195,
  borderBottom: '1px solid #E9E9E9',
});

export const SkeletonTopic = styled(AbsoluteSkeleton)({
  width: 246,
  height: 23,
  left: 19,
  top: 203,
  borderRadius: '8px',
});

export const SkeletonDescLine1 = styled(AbsoluteSkeleton)({
  width: 246,
  height: 15,
  left: 19,
  top: 242,
  borderRadius: '8px',
});

export const SkeletonDescLine2 = styled(AbsoluteSkeleton)({
  width: 149,
  height: 15,
  left: 19,
  top: 261,
  borderRadius: '8px',
});

export const SkeletonButton = styled(AbsoluteSkeleton)({
  width: 251,
  height: 34,
  left: 'calc(50% - 125.5px)',
  top: 338,
  borderRadius: '7px',
});
