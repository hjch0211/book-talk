import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { CardSlot, FloatWrapper, RotatingGroup, Scene } from './style';

interface Carousel3DItem {
  id: string;
}

interface Props<T extends Carousel3DItem> {
  items: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  renderCard: (item: T, isSelected: boolean, selectCard: () => void) => React.ReactNode;
  radius?: number;
  cardWidth?: number;
  cardHeight?: number;
  sceneHeight?: number;
}

export function Carousel3D<T extends Carousel3DItem>({
  items,
  selectedId,
  onSelect,
  renderCard,
  radius = 500,
  cardWidth = 450,
  cardHeight = 300,
  sceneHeight = 720,
}: Props<T>) {
  const [rotationDeg, setRotationDeg] = useState(0);
  const currentIndexRef = useRef(0);
  const angleStep = 360 / items.length;

  useEffect(() => {
    if (items.length > 0) {
      currentIndexRef.current = 0;
      setRotationDeg(0);
      onSelect(items[0].id);
    }
  }, [items, onSelect]);

  if (items.length === 0) return null;

  return (
    <Scene $height={sceneHeight}>
      <RotatingGroup $deg={rotationDeg}>
        {items.map((item, i) => {
          const angle = (i / items.length) * 360;
          const isSelected = item.id === selectedId;
          const floatDelay = `${(i * 0.37) % 3}s`;

          const selectCard = () => {
            const diff = i - currentIndexRef.current;
            const N = items.length;
            let steps = diff;
            if (Math.abs(diff) > N / 2) steps = diff > 0 ? diff - N : diff + N;
            currentIndexRef.current = i;
            setRotationDeg((prev) => prev - steps * angleStep);
            onSelect(item.id);
          };

          const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') selectCard();
          };

          return (
            <CardSlot
              key={item.id}
              $angle={angle}
              $radius={radius}
              $w={cardWidth}
              $h={cardHeight}
            >
              <FloatWrapper $delay={floatDelay} role="button" tabIndex={0} onKeyDown={handleKeyDown}>
                {renderCard(item, isSelected, selectCard)}
              </FloatWrapper>
            </CardSlot>
          );
        })}
      </RotatingGroup>
    </Scene>
  );
}