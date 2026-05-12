import type { Persona } from '@src/constants/persona.ts';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeChip,
  NameListColumn,
  NameListItem,
  PersonaCircleOuter,
  PersonaDescText,
  PersonaDisplayPanel,
  PersonaFrame,
  PersonaInfoCard,
  PersonaNameText,
  PersonaSelectBody,
} from './style';

interface Props {
  personas: Persona[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

// Image circle center within PersonaFrame (453 × 398)
const IMG_CX = 226.5; // 453 / 2
const IMG_CY = 217.5; // top(105) + radius(112.5)
const BADGE_R = 185; // distance from image center to badge center

function badgeAngleDeg(i: number, total: number): number {
  return total <= 1 ? 0 : (i / total) * 360;
}

function badgePos(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: IMG_CX + BADGE_R * Math.sin(rad),
    y: IMG_CY - BADGE_R * Math.cos(rad),
  };
}

export function PersonaSelect({ personas, selectedValue, onSelect }: Props) {
  const selectedPersona = personas.find((p) => p.id === selectedValue) ?? personas[0];
  const tags = selectedPersona?.tags ?? [];

  return (
    <PersonaSelectBody>
      <PersonaDisplayPanel>
        <PersonaFrame>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPersona?.id}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.2 }}
              transition={{ duration: 0.12 }}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              {tags.map((tag, i) => {
                const pos = badgePos(badgeAngleDeg(i, tags.length));
                return (
                  <BadgeChip key={tag} style={{ left: pos.x, top: pos.y }}>
                    {tag}
                  </BadgeChip>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Circle image with crossfade on selection change */}
          <PersonaCircleOuter>
            <AnimatePresence mode="wait">
              {selectedPersona?.image ? (
                <motion.img
                  key={selectedPersona.id}
                  src={selectedPersona.image}
                  alt={selectedPersona.label}
                  draggable={false}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.3 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                  }}
                />
              ) : (
                <motion.div
                  key={`empty-${selectedPersona?.id}`}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.3 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 60,
                    opacity: 0.4,
                  }}
                >
                  🙂
                </motion.div>
              )}
            </AnimatePresence>
          </PersonaCircleOuter>
        </PersonaFrame>

        {/* Name + description */}
        <PersonaInfoCard>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPersona?.id}
              initial={{ opacity: 0.3, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.3, y: -3 }}
              transition={{ duration: 0.12 }}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <PersonaNameText>{selectedPersona?.label}</PersonaNameText>
              <PersonaDescText>{selectedPersona?.description}</PersonaDescText>
            </motion.div>
          </AnimatePresence>
        </PersonaInfoCard>
      </PersonaDisplayPanel>

      {/* Right panel: name list */}
      <NameListColumn>
        {personas.map((persona) => (
          <NameListItem
            key={persona.id}
            $selected={persona.id === selectedValue}
            onClick={() => onSelect(persona.id)}
          >
            {persona.label}
          </NameListItem>
        ))}
      </NameListColumn>
    </PersonaSelectBody>
  );
}
