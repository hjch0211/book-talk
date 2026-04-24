import { CrayonButton } from '@src/components/molecules/CrayonButton';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { CardSlot, FloatWrapper, RotatingGroup, Scene, Wrapper } from './style';

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
  ariaLabel?: string;
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
  ariaLabel = 'Carousel',
}: Props<T>) {
  const [rotationDeg, setRotationDeg] = useState(0);
  const currentIndexRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const angleStep = 360 / items.length;

  useEffect(() => {
    if (items.length > 0) {
      currentIndexRef.current = 0;
      setRotationDeg(0);
      onSelect(items[0].id);
    }
  }, [items, onSelect]);

  if (items.length === 0) return null;

  const selectByIndex = (nextIndex: number) => {
    const N = items.length;
    const i = ((nextIndex % N) + N) % N;
    const diff = i - currentIndexRef.current;
    let steps = diff;
    if (Math.abs(diff) > N / 2) steps = diff > 0 ? diff - N : diff + N;
    currentIndexRef.current = i;
    setRotationDeg((prev) => prev - steps * angleStep);
    onSelect(items[i].id);
    cardRefs.current[i]?.focus();
  };

  const handleSceneKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectByIndex(currentIndexRef.current + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectByIndex(currentIndexRef.current - 1);
    }
  };

  return (
    <Wrapper role="group" aria-label={ariaLabel} onKeyDown={handleSceneKeyDown}>
      <CrayonButton
        aria-label="Previous card"
        onClick={() => selectByIndex(currentIndexRef.current - 1)}
        style={{ fontSize: '60px' }}
        underline={false}
      >
        ‹
      </CrayonButton>
      <Scene $height={sceneHeight}>
        <RotatingGroup $deg={rotationDeg}>
          {items.map((item, i) => {
            const angle = (i / items.length) * 360;
            const isSelected = item.id === selectedId;
            const floatDelay = `${(i * 0.37) % 3}s`;

            const selectCard = () => selectByIndex(i);

            const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectCard();
              }
            };

            return (
              <CardSlot
                key={item.id}
                $angle={angle}
                $radius={radius}
                $w={cardWidth}
                $h={cardHeight}
              >
                <FloatWrapper
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  $delay={floatDelay}
                  role="button"
                  tabIndex={isSelected ? 0 : -1}
                  aria-pressed={isSelected}
                  onKeyDown={handleCardKeyDown}
                >
                  {renderCard(item, isSelected, selectCard)}
                </FloatWrapper>
              </CardSlot>
            );
          })}
        </RotatingGroup>
      </Scene>
      <CrayonButton
        aria-label="Next card"
        onClick={() => selectByIndex(currentIndexRef.current + 1)}
        style={{ fontSize: '60px' }}
        underline={false}
      >
        ›
      </CrayonButton>
    </Wrapper>
  );
}
