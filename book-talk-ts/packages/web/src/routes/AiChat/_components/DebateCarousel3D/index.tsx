import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Carousel3D } from '@src/components/templates/Carousel3D';
import type { FindAllDebateInfo } from '@src/externals/debate';
import {
  Card,
  CardBody,
  CardBookImage,
  CardDescription,
  CardImageArea,
  CardTopic,
  CarouselControls,
  CarouselHintText,
  CarouselNavPill,
  NavNextBtn,
  NavPrevBtn,
} from './style';

interface Props {
  debates: FindAllDebateInfo[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateDebate: () => void;
}

export function DebateCarousel3D({ debates, selectedId, onSelect, onCreateDebate }: Props) {
  return (
    <Carousel3D
      items={debates}
      selectedId={selectedId}
      onSelect={onSelect}
      radius={480}
      cardWidth={420}
      cardHeight={280}
      sceneHeight={480}
      renderCard={(debate, isSelected, selectCard) => (
        <Card $isSelected={isSelected} onClick={selectCard}>
          <CardImageArea>
            {debate.bookInfo.imageUrl ? (
              <CardBookImage src={debate.bookInfo.imageUrl} draggable={false} />
            ) : (
              <div style={{ fontSize: 30, opacity: 0.4 }}>📚</div>
            )}
          </CardImageArea>
          <CardBody>
            <CardTopic>{debate.topic}</CardTopic>
            <CardDescription>{debate.description ?? ''}</CardDescription>
          </CardBody>
        </Card>
      )}
      renderNavigation={(onPrev, onNext) => (
        <CarouselControls>
          <CarouselHintText onClick={onCreateDebate}>
            마음에 드는 토론 주제가 없다면 직접 만들어보세요!
          </CarouselHintText>
          <CarouselNavPill>
            <NavPrevBtn onClick={onPrev} aria-label="이전 토론">
              <ChevronLeftIcon sx={{ color: '#434343', fontSize: 24 }} />
            </NavPrevBtn>
            <NavNextBtn onClick={onNext} aria-label="다음 토론">
              <ChevronRightIcon sx={{ color: '#434343', fontSize: 24 }} />
            </NavNextBtn>
          </CarouselNavPill>
        </CarouselControls>
      )}
    />
  );
}
