import { Blob1, Blob2, Blob3, Blob4, BlobField, Particle } from './style';

const PARTICLES = [
  { x: 8,  y: 12, size: 5, delay: 0,   color: 'rgba(196,181,253,0.9)' },
  { x: 18, y: 78, size: 3, delay: 0.6, color: 'rgba(96,184,234,0.8)'  },
  { x: 30, y: 8,  size: 4, delay: 1.1, color: 'rgba(110,220,210,0.8)' },
  { x: 55, y: 5,  size: 3, delay: 0.3, color: 'rgba(255,185,220,0.9)' },
  { x: 72, y: 15, size: 6, delay: 0.9, color: 'rgba(196,181,253,0.7)' },
  { x: 88, y: 30, size: 3, delay: 1.5, color: 'rgba(96,184,234,0.9)'  },
  { x: 92, y: 65, size: 5, delay: 0.4, color: 'rgba(110,220,210,0.7)' },
  { x: 82, y: 88, size: 3, delay: 1.2, color: 'rgba(255,185,220,0.8)' },
  { x: 45, y: 92, size: 4, delay: 0.7, color: 'rgba(196,181,253,0.8)' },
  { x: 12, y: 45, size: 3, delay: 1.8, color: 'rgba(96,184,234,0.7)'  },
  { x: 60, y: 82, size: 5, delay: 0.2, color: 'rgba(110,220,210,0.9)' },
  { x: 25, y: 55, size: 3, delay: 2.1, color: 'rgba(255,185,220,0.7)' },
];

export function Background() {
  return (
    <>
      <BlobField>
        <Blob1 />
        <Blob2 />
        <Blob3 />
        <Blob4 />
      </BlobField>
      {PARTICLES.map((p, i) => (
        <Particle
          key={`particle-${i + 1}`}
          $x={p.x}
          $y={p.y}
          $size={p.size}
          $delay={p.delay}
          $color={p.color}
        />
      ))}
    </>
  );
}
