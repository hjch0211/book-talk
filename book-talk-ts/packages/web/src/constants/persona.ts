import PersonaAImg from '@src/assets/persona/persona-a.png';
import PersonaBImg from '@src/assets/persona/persona-b.png';
import PersonaCImg from '@src/assets/persona/persona-c.png';

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
];
