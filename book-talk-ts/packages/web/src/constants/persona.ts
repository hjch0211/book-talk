import PersonaAImg from '@src/assets/persona/persona-a.png';
import PersonaBImg from '@src/assets/persona/persona-b.png';
import PersonaCImg from '@src/assets/persona/persona-c.png';
import PersonaDImg from '@src/assets/persona/persona-d.png';
import PersonaEImg from '@src/assets/persona/persona-e.png';
import PersonaFImg from '@src/assets/persona/persona-f.png';
import PersonaGImg from '@src/assets/persona/persona-g.png';

export interface Persona {
  id: string;
  label: string;
  description: string;
  image?: string;
}

export const PERSONAS: Persona[] = [
  {
    id: 'a',
    label: '박명수',
    description: '솔직하고 직설적으로 이야기합니다',
    image: PersonaAImg,
  },
  {
    id: 'b',
    label: '카니',
    description: '에너지 넘치는 감각으로 파헤칩니다.',
    image: PersonaBImg,
  },
  {
    id: 'c',
    label: '송하영',
    description: '밝고 귀여운 말투로 대화를 이어갑니다.',
    image: PersonaCImg,
  },
  {
    id: 'd',
    label: '원우',
    description: '지적이고 차분한 대화로 이끌어갑니다.',
    image: PersonaDImg,
  },
  {
    id: 'e',
    label: '마크',
    description: '넘치는 에너지와 밝은 대화를 진행합니다.',
    image: PersonaEImg,
  },
  {
    id: 'f',
    label: '박정민',
    description: '생각이 깊고 솔직한 대화를 진행합니다.',
    image: PersonaFImg,
  },
  {
    id: 'g',
    label: '한효주',
    description: '차분하고 진실된 토론을 합니다.',
    image: PersonaGImg,
  },
];
