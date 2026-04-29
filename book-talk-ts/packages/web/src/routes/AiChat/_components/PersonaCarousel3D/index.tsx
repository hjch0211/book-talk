import { Carousel3D } from '@src/components/templates/Carousel3D';
import type { Persona } from '@src/constants/persona.ts';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import {
  Card,
  ChipInner,
  GraphSvgWrapper,
  ImageCircle,
  PersonaDesc,
  PersonaImage,
  PersonaName,
} from './style';

interface Props {
  personas: Persona[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

// Card slot: 260 × 400 px
// Image: 150px diameter (radius 75), Card padding-top: 80px → center y = 155
const IMG_CX = 130;
const IMG_CY = 155;
const NODE_R = 130;

const LINE_STAGGER = 0.09;  // delay between each edge
const LINE_DURATION = 0.32; // time for one edge to fully draw

// Evenly distribute nodes across full 360°, starting from 12 o'clock
function nodeAngleDeg(i: number, total: number): number {
  return total <= 1 ? 0 : (i / total) * 360;
}

function nodePos(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: IMG_CX + NODE_R * Math.sin(rad),
    y: IMG_CY - NODE_R * Math.cos(rad),
  };
}

export function PersonaCarousel3D({ personas, selectedValue, onSelect }: Props) {
  const items = useMemo(() => personas.map((p) => ({ ...p, id: p.id })), [personas]);

  return (
    <Carousel3D
      items={items}
      selectedId={selectedValue}
      onSelect={onSelect}
      radius={400}
      cardWidth={260}
      cardHeight={400}
      sceneHeight={720}
      renderCard={(item, isSelected, selectCard) => {
        const tags = item.tags ?? [];

        return (
          <Card onClick={selectCard}>
            {/*
             * SVG layer: pulsing halo + edges (pathLength draw) + node dots (burst appear)
             *
             * Halo: breathing opacity ring around image when selected.
             * Edges: pathLength 0→1 draws each line FROM image center TOWARD the chip.
             * Dots: scale keyframe burst [0→1.6→0.75→1] appears as line arrives.
             * Exit: lines retract (pathLength→0), dots/halo fade quickly.
             */}
            <GraphSvgWrapper viewBox="0 0 260 400">
              {/*
               * Skeleton edges — always visible, even before selection.
               * Faint (opacity 0.14) when not selected; fade to 0 when selected
               * as the animated pathLength lines draw over the same positions.
               */}
              {tags.map((tag, i) => {
                const pos = nodePos(nodeAngleDeg(i, tags.length));
                return (
                  <motion.line
                    key={`sk-${tag}`}
                    x1={IMG_CX}
                    y1={IMG_CY}
                    x2={pos.x}
                    y2={pos.y}
                    stroke="rgba(255,255,255,1)"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                    animate={{ opacity: isSelected ? 0 : 0.14 }}
                    transition={{ duration: 0.28 }}
                  />
                );
              })}

              <AnimatePresence>
                {/* Pulsing halo ring around selected image */}
                {isSelected && (
                  <motion.circle
                    key="halo"
                    cx={IMG_CX}
                    cy={IMG_CY}
                    r={80}
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: [0, 0.6, 0.3, 0.6],
                    }}
                    transition={{
                      scale: { duration: 0.5, type: 'spring', stiffness: 180, damping: 18 },
                      opacity: {
                        duration: 2.2,
                        times: [0, 0.25, 0.6, 1],
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      },
                    }}
                    exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.18 } }}
                  />
                )}
              </AnimatePresence>

              {/* Edges and node dots — rendered as flat list for AnimatePresence tracking */}
              <AnimatePresence>
                {isSelected &&
                  tags.flatMap((tag, i) => {
                    const pos = nodePos(nodeAngleDeg(i, tags.length));
                    const lineDelay = i * LINE_STAGGER;
                    const dotDelay = lineDelay + LINE_DURATION - 0.04;

                    return [
                      /* Edge: drawn with pathLength from center → node */
                      <motion.path
                        key={`line-${tag}`}
                        d={`M ${IMG_CX} ${IMG_CY} L ${pos.x} ${pos.y}`}
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1.2"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                          pathLength: 1,
                          opacity: 1,
                          transition: {
                            pathLength: { delay: lineDelay, duration: LINE_DURATION, ease: [0.22, 1, 0.36, 1] },
                            opacity: { delay: lineDelay, duration: 0.06 },
                          },
                        }}
                        exit={{
                          pathLength: 0,
                          opacity: 0,
                          transition: { duration: 0.2, ease: 'easeIn' },
                        }}
                      />,

                      /* Node dot: burst scale then settle */
                      <motion.circle
                        key={`dot-${tag}`}
                        cx={pos.x}
                        cy={pos.y}
                        r={3.5}
                        fill="rgba(255,255,255,0.85)"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: [0, 1.7, 0.75, 1.1, 1],
                          opacity: [0, 1, 1, 1, 1],
                          transition: {
                            scale: {
                              delay: dotDelay,
                              duration: 0.55,
                              times: [0, 0.3, 0.55, 0.8, 1],
                              ease: 'easeOut',
                            },
                            opacity: { delay: dotDelay, duration: 0.08 },
                          },
                        }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.12 } }}
                      />,
                    ];
                  })}
              </AnimatePresence>
            </GraphSvgWrapper>

            {/* Circular persona image — z-index 2 covers edge origins */}
            <ImageCircle $isSelected={isSelected}>
              {item.image ? (
                <PersonaImage src={item.image} alt={item.label} draggable={false} />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    opacity: 0.4,
                  }}
                >
                  🙂
                </div>
              )}
            </ImageCircle>

            <PersonaName>{item.label}</PersonaName>
            <PersonaDesc>{item.description}</PersonaDesc>

            {/*
             * Knowledge-graph chip nodes.
             *
             * Anchor: zero-size div at image center (IMG_CX, IMG_CY).
             * motion.div: `position: relative; width: 0; height: 0` so transform-origin (0,0)
             *   aligns with the chip's visual center (ChipInner is position:absolute + translate(-50%,-50%)).
             * Animation: x/y spring from (0,0)→(dx,dy) + bounce scale + rotate wobble.
             * Timing: chip fires just as its edge arrives at the node.
             */}
            {tags.map((tag, i) => {
              const pos = nodePos(nodeAngleDeg(i, tags.length));
              const dx = pos.x - IMG_CX;
              const dy = pos.y - IMG_CY;
              const chipDelay = i * LINE_STAGGER + LINE_DURATION - 0.04;

              return (
                <div
                  key={tag}
                  style={{
                    position: 'absolute',
                    left: IMG_CX,
                    top: IMG_CY,
                    width: 0,
                    height: 0,
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        /* position: relative + zero size → transform-origin (0,0) = chip visual center */
                        style={{ position: 'relative', width: 0, height: 0 }}
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                        animate={{
                          x: dx,
                          y: dy,
                          opacity: 1,
                          /* Bouncy scale: overshoot → undershoot → settle */
                          scale: [0, 1.25, 0.88, 1.06, 1],
                          /* Micro-wobble settle */
                          rotate: [0, -8, 5, -2, 0],
                          transition: {
                            x: { delay: chipDelay, type: 'spring', stiffness: 500, damping: 18 },
                            y: { delay: chipDelay, type: 'spring', stiffness: 500, damping: 18 },
                            opacity: { delay: chipDelay, duration: 0.1 },
                            scale: {
                              delay: chipDelay,
                              duration: 0.55,
                              times: [0, 0.28, 0.52, 0.78, 1],
                              ease: 'easeOut',
                            },
                            rotate: {
                              delay: chipDelay,
                              duration: 0.55,
                              times: [0, 0.25, 0.5, 0.75, 1],
                              ease: 'easeOut',
                            },
                          },
                        }}
                        exit={{
                          x: 0,
                          y: 0,
                          opacity: 0,
                          scale: 0,
                          rotate: 0,
                          transition: { duration: 0.18, ease: 'easeIn' },
                        }}
                      >
                        <ChipInner>{tag}</ChipInner>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </Card>
        );
      }}
    />
  );
}
