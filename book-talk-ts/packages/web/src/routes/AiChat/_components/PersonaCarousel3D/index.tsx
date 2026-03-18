import { Carousel3D } from '@src/components/templates/Carousel3D';
import type { Persona } from '@src/constants/persona.ts';
import { useMemo } from 'react';
import {
  Card,
  CardBody,
  CardDescription,
  CardImageArea,
  CardName,
  CardPersonaImage,
} from './style';

interface Props {
  personas: Persona[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function PersonaCarousel3D({ personas, selectedValue, onSelect }: Props) {
  const items = useMemo(() => personas.map((p) => ({ ...p, id: p.id })), [personas]);

  return (
    <Carousel3D
      items={items}
      selectedId={selectedValue}
      onSelect={onSelect}
      radius={400}
      cardWidth={240}
      cardHeight={380}
      sceneHeight={720}
      renderCard={(item, isSelected, selectCard) => (
        <Card $isSelected={isSelected} onClick={selectCard}>
          <CardImageArea>
            {item.image ? (
              <CardPersonaImage src={item.image} alt={item.label} draggable={false} />
            ) : (
              <div style={{ fontSize: 40, opacity: 0.4 }}>🙂</div>
            )}
          </CardImageArea>
          <CardBody>
            <CardName>{item.label}</CardName>
            <CardDescription>{item.description}</CardDescription>
          </CardBody>
        </Card>
      )}
    />
  );
}
