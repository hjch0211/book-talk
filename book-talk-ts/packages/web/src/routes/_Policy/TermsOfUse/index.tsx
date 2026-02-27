import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import {
  BodyText,
  BulletItem,
  BulletList,
  ChapterTitle,
  OrderedList,
  PolicyDate,
  PolicyDivider,
  PolicyTitle,
  PolicyWrapper,
  SectionTitle,
  SectionWrapper,
} from '../style';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <SectionWrapper>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </SectionWrapper>
);

const Bullets = ({ items }: { items: string[] }) => (
  <BulletList component="ul">
    {items.map((item, i) => (
      <BulletItem key={`${i + 1}`} component="li">
        {item}
      </BulletItem>
    ))}
  </BulletList>
);

const Ordered = ({ items }: { items: string[] }) => (
  <OrderedList component="ol">
    {items.map((item, i) => (
      <BulletItem key={`${i + 1}`} component="li">
        {item}
      </BulletItem>
    ))}
  </OrderedList>
);

export function TermsOfUsePage() {
  return (
    <PageContainer isRelative>
      <AppHeader />
      <PolicyWrapper>
        <PolicyTitle>Booktalk 서비스 이용약관</PolicyTitle>
        <PolicyDate>시행일자: 2025년 02월 27일</PolicyDate>
        <PolicyDivider />

        <ChapterTitle>제1장 총칙</ChapterTitle>

        <Section title="제1조 (목적)">
          <BodyText>
            이 약관은 Innovarium(이하 "회사"라 함)이 운영하는 Booktalk 서비스 및 이에 부수하는 제반
            서비스(통칭하여 이하 "서비스")의 이용조건 및 절차, 회사와 회원 간의 권리·의무 및
            책임사항을 규정함을 목적으로 합니다.
          </BodyText>
          <BodyText>
            회원은 본 약관에 동의함으로써 회사와 서비스 이용 계약을 체결하게 되며, 이에 따라
            서비스를 이용할 수 있습니다.
          </BodyText>
        </Section>

        <Section title="제2조 (용어의 정의)">
          <BodyText>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</BodyText>
          <Ordered
            items={[
              '회원: 이 약관에 따라 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자',
              '아이디(ID): 회원 식별과 서비스 이용을 위해 회원이 설정하고 회사가 승인한 이메일 계정',
              '비밀번호(Password): 회원의 개인정보 보호를 위해 회원이 설정한 문자와 숫자의 조합',
              '콘텐츠: 서비스 이용 과정에서 회원이 활용하거나 작성하는 토론 정보, AI 생성 결과물 및 이에 부수되는 정보 일체',
            ]}
          />
        </Section>

        <Section title="제3조 (약관의 공시 및 효력과 변경)">
          <Ordered
            items={[
              '회사는 본 약관의 내용을 회원이 쉽게 확인할 수 있도록 서비스 웹사이트에 게시합니다.',
              '회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있습니다.',
              '약관을 개정할 경우, 적용일자 및 개정 사유를 명시하여 적용일자 7일 전부터 공지합니다. 다만, 회원에게 불리한 변경의 경우 30일 이상의 사전 유예기간을 둡니다.',
              '회원이 개정 약관의 적용일자까지 명시적으로 거부 의사를 표시하지 않을 경우, 개정 약관에 동의한 것으로 봅니다.',
              '본 약관에 명시되지 않은 사항은 관련 법령 및 상관례에 따릅니다.',
            ]}
          />
        </Section>

        <PolicyDivider />
        <ChapterTitle>제2장 이용계약</ChapterTitle>

        <Section title="제4조 (회원가입 및 관리)">
          <Ordered
            items={[
              '이용계약은 회원이 본 약관에 동의하고 회원가입 절차를 완료한 후 회사가 이를 승인함으로써 체결됩니다.',
              '회원은 정확한 정보를 제공해야 하며, 1인 1계정만 생성할 수 있습니다.',
              '허위 정보를 제공한 경우 서비스 이용이 제한될 수 있으며, 법적 보호를 받을 수 없습니다.',
              '회원 정보 변경 시 회원은 이를 즉시 수정하거나 회사에 통지해야 합니다.',
              '만 14세 미만의 아동은 법정대리인의 동의를 받아야 합니다.',
            ]}
          />
        </Section>

        <Section title="제5조 (이용신청의 승낙)">
          <BodyText>1. 회사는 다음의 경우 승낙을 유보할 수 있습니다.</BodyText>
          <Bullets
            items={[
              '설비 여유가 없는 경우',
              '기술적 또는 운영상 문제가 있는 경우',
              '기타 회사가 필요하다고 판단한 경우',
            ]}
          />
          <BodyText>2. 다음에 해당하는 경우 승낙을 거절할 수 있습니다.</BodyText>
          <Bullets
            items={[
              '타인의 정보를 이용한 경우',
              '허위 정보를 기재한 경우',
              '법령 또는 약관을 위반한 경우',
            ]}
          />
        </Section>

        <PolicyDivider />
        <ChapterTitle>제3장 계약 당사자의 의무</ChapterTitle>

        <Section title="제6조 (회사의 의무)">
          <Ordered
            items={[
              '회사는 관련 법령과 본 약관을 준수하며 안정적인 서비스 제공을 위해 노력합니다.',
              '회사는 개인정보 보호를 위해 보안 시스템을 갖추고 개인정보 처리방침을 준수합니다.',
              '회원의 정당한 문의나 불만에 대해 성실히 처리합니다.',
            ]}
          />
        </Section>

        <Section title="제7조 (회원의 의무)">
          <BodyText>1. 회원은 다음 행위를 해서는 안됩니다.</BodyText>
          <Bullets
            items={[
              '허위 정보 기재',
              '타인의 계정 또는 결제수단 도용',
              '서비스 운영 방해 행위',
              '불법 콘텐츠 게시',
              '서비스의 역설계, 복제, 변형',
              '영리 목적의 무단 이용',
              '크레딧의 부정 사용',
            ]}
          />
          <BodyText>2. 회원은 계정 및 결제 정보 관리에 대한 책임을 부담합니다.</BodyText>
        </Section>

        <PolicyDivider />
        <ChapterTitle>제4장 서비스의 제공 및 이용</ChapterTitle>

        <Section title="제8조 (서비스 제공)">
          <BodyText>1. 회사는 다음 서비스를 제공합니다.</BodyText>
          <Bullets items={['독서 토론 콘텐츠 이용 기능', '기타 회사가 정하는 부가 서비스']} />
          <BodyText>
            2. 서비스는 원칙적으로 연중무휴 제공되며, 기술적 사유로 중단될 수 있습니다.
          </BodyText>
        </Section>

        <Section title="제9조 (서비스 이용 제한)">
          <Ordered
            items={[
              '계정 공유 및 과도한 사용은 금지됩니다.',
              '비정상적인 이용이 확인될 경우 사전 통지 없이 이용이 제한될 수 있습니다.',
            ]}
          />
        </Section>

        <Section title="제10조 (유료서비스)">
          <Ordered
            items={[
              '서비스는 유료 또는 무료로 제공될 수 있습니다.',
              '유료서비스는 구독형으로 운영되며 자동 갱신됩니다.',
              '크레딧은 회사 정책에 따라 제공·소멸됩니다.',
            ]}
          />
        </Section>

        <PolicyDivider />
        <ChapterTitle>제5장 결제 및 환불</ChapterTitle>

        <Section title="제11조 (대금결제)">
          <Ordered
            items={[
              '회원의 결제 행위로 유료서비스 계약이 성립됩니다.',
              '결제수단 및 자동결제 방식은 서비스 정책에 따릅니다.',
              '회원은 다음 결제일 이전에 구독을 해지할 수 있습니다.',
            ]}
          />
        </Section>

        <Section title="제12조 (청약철회)">
          <Ordered
            items={[
              '유료서비스 미사용 시 결제일로부터 7일 이내 청약철회가 가능합니다.',
              '서비스 이용 개시 후에는 청약철회가 제한됩니다.',
            ]}
          />
        </Section>

        <PolicyDivider />
        <ChapterTitle>제6장 콘텐츠 및 권리</ChapterTitle>

        <Section title="제13조 (콘텐츠 관리)">
          <Ordered
            items={[
              '회원의 콘텐츠 및 이용 정보는 서비스 제공 목적으로만 사용됩니다.',
              '회사는 서비스 품질 개선을 위해 개인정보가 포함되지 않은 이용 통계 정보를 수집할 수 있습니다.',
              '고객 지원 목적의 데이터 접근은 회원 동의 하에 최소한으로 이루어집니다.',
            ]}
          />
        </Section>

        <Section title="제14조 (저작권)">
          <Ordered
            items={[
              '회원이 생성한 콘텐츠의 권리는 회원에게 귀속됩니다.',
              '서비스 구조, UI, 템플릿에 대한 권리는 회사에 귀속됩니다.',
            ]}
          />
        </Section>

        <PolicyDivider />
        <ChapterTitle>제7장 면책 및 손해배상</ChapterTitle>

        <Section title="제15조 (면책)">
          <BodyText>회사는 다음 사항에 대해 책임을 지지 않습니다.</BodyText>
          <Ordered
            items={[
              '불가항력으로 인한 서비스 장애',
              '회원 과실로 인한 손해',
              '콘텐츠 결과의 정확성 및 활용 결과',
              '외부 서비스 장애',
            ]}
          />
        </Section>

        <Section title="제16조 (손해배상)">
          <Ordered
            items={[
              '회원의 약관 위반으로 발생한 손해는 회원이 배상합니다.',
              '회사의 책임은 고의 또는 중과실에 한하며, 이용요금을 초과하지 않습니다.',
            ]}
          />
        </Section>

        <PolicyDivider />
        <ChapterTitle>제8장 기타</ChapterTitle>

        <Section title="제17조 (서비스 중단)">
          <BodyText>
            회사는 불가피한 사유로 서비스를 중단할 수 있으며, 사전 공지를 원칙으로 합니다.
          </BodyText>
        </Section>

        <Section title="제18조 (회원탈퇴 및 자격 상실)">
          <Ordered
            items={[
              '회원은 언제든지 탈퇴할 수 있습니다.',
              '약관 위반 시 회사는 이용을 제한하거나 계약을 해지할 수 있습니다.',
            ]}
          />
        </Section>

        <Section title="제19조 (준거법 및 관할)">
          <BodyText>본 약관은 대한민국 법률을 따르며, 분쟁은 관할 법원에 제기합니다.</BodyText>
        </Section>

        <Section title="제20조 (통지)">
          <Ordered
            items={[
              '회사는 전자적 수단을 통해 회원에게 통지할 수 있습니다.',
              '공지사항 게시로 개별 통지를 갈음할 수 있습니다.',
            ]}
          />
        </Section>
      </PolicyWrapper>
    </PageContainer>
  );
}
