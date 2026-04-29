import styled from '@emotion/styled';

export const Card = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  overflow: visible;
  user-select: none;
  font-family: 'S-Core Dream', sans-serif;
`;

export const GraphSvgWrapper = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 1;
`;

export const ImageCircle = styled.div<{ $isSelected: boolean }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  border: 2.5px solid
    ${({ $isSelected }) =>
      $isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'};
  box-shadow: ${({ $isSelected }) =>
    $isSelected
      ? '0 0 0 6px rgba(120,170,255,0.2), 0 8px 28px rgba(0,0,0,0.25)'
      : '0 4px 16px rgba(0,0,0,0.2)'};
  transition: border-color 0.35s, box-shadow 0.35s;
`;

export const PersonaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
`;

export const PersonaName = styled.div`
  margin-top: 55px;
  font-weight: 700;
  font-size: 15px;
  color: #1a1a1a;
  text-align: center;
  position: relative;
  z-index: 2;
  letter-spacing: 0.3px;
`;

export const PersonaDesc = styled.div`
  margin-top: 6px;
  font-weight: 300;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.55);
  text-align: center;
  line-height: 1.65;
  padding: 0 18px;
  position: relative;
  z-index: 2;
`;

/*
 * ChipInner — positioned absolutely inside a zero-size motion.div wrapper.
 * `position: absolute` + `translate(-50%, -50%)` correctly centers the chip
 * because the translate is relative to ChipInner's own content-sized dimensions,
 * not the zero-size parent. `display: inline-flex` ensures intrinsic width.
 */
export const ChipInner = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 5px 12px;
  font-family: 'S-Core Dream', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #1a1a1a;
  letter-spacing: 0.15px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
