import {
  SkeletonButton,
  SkeletonCardRoot,
  SkeletonDescLine1,
  SkeletonDescLine2,
  SkeletonDivider,
  SkeletonImage,
  SkeletonTitle,
  SkeletonTopic,
} from './skeleton.style';

export function DebateCardSkeleton() {
  return (
    <SkeletonCardRoot>
      <SkeletonImage variant="rectangular" />
      <SkeletonTitle variant="rounded" />
      <SkeletonDivider />
      <SkeletonTopic variant="rounded" />
      <SkeletonDescLine1 variant="rounded" />
      <SkeletonDescLine2 variant="rounded" />
      <SkeletonButton variant="rounded" />
    </SkeletonCardRoot>
  );
}
