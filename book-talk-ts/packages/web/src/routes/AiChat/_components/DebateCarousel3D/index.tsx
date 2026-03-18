import { Carousel3D } from '@src/components/templates/Carousel3D';
import type { FindAllDebateInfo } from '@src/externals/debate';
import {
  Card,
  CardBody,
  CardBookImage,
  CardDescription,
  CardImageArea,
  CardTopic,
} from './style';

interface Props {
  debates: FindAllDebateInfo[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function DebateCarousel3D({ debates, selectedId, onSelect }: Props) {
  return (
    <Carousel3D
      items={debates}
      selectedId={selectedId}
      onSelect={onSelect}
      radius={500}
      cardWidth={450}
      cardHeight={300}
      sceneHeight={720}
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
    />
  );
}
