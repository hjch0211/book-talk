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
  tags?: string[];
}

export const PERSONAS: Persona[] = [
  {
    id: 'a',
    label: '박명수',
    description: '솔직하고 직설적으로 이야기합니다',
    image: PersonaAImg,
    tags: ['직설적', '솔직함', '유머', '날카로움', '현실적'],
  },
  {
    id: 'b',
    label: '카니',
    description: '에너지 넘치는 감각으로 파헤칩니다.',
    image: PersonaBImg,
    tags: ['에너지', '감각적', '열정', '창의성', '트렌디'],
  },
  {
    id: 'c',
    label: '송하영',
    description: '밝고 귀여운 말투로 대화를 이어갑니다.',
    image: PersonaCImg,
    tags: ['밝음', '귀여움', '공감력', '긍정적', '친근함'],
  },
  {
    id: 'd',
    label: '원우',
    description: '지적이고 차분한 대화로 이끌어갑니다.',
    image: PersonaDImg,
    tags: ['지적', '차분함', '논리적', '통찰력', '섬세함'],
  },
  {
    id: 'e',
    label: '마크',
    description: '넘치는 에너지와 밝은 대화를 진행합니다.',
    image: PersonaEImg,
    tags: ['에너지', '활발함', '밝음', '도전적', '긍정적'],
  },
  {
    id: 'f',
    label: '박정민',
    description: '생각이 깊고 솔직한 대화를 진행합니다.',
    image: PersonaFImg,
    tags: ['진중함', '솔직함', '깊은사고', '공감력', '진정성'],
  },
  {
    id: 'g',
    label: '한효주',
    description: '차분하고 진실된 토론을 합니다.',
    image: PersonaGImg,
    tags: ['차분함', '진실됨', '우아함', '지혜', '배려'],
  },
];
