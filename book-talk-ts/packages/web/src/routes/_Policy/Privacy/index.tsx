import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import {
  BodyText,
  BulletItem,
  BulletList,
  PolicyDate,
  PolicyDivider,
  PolicyTitle,
  PolicyWrapper,
  SectionTitle,
  SectionWrapper,
  SubSectionTitle,
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

export function PrivacyPage() {
  return (
    <PageContainer>
      <AppHeader />
      <PolicyWrapper>
        <PolicyTitle>Booktalk 개인정보 처리방침</PolicyTitle>
        <PolicyDate>시행일자: 2026년 2월 27일</PolicyDate>

        <BodyText>
          Innovarium은 「개인정보보호법」 제30조에 따라 정보주체의 개인정보를 보호하고, 이와 관련한
          고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을
          수립·공개합니다.
        </BodyText>

        <PolicyDivider />

        <Section title="제1조 (개인정보의 처리목적)">
          <BodyText>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:</BodyText>
          <Bullets
            items={[
              '회원가입 및 서비스 제공: 본인 인증, 회원 관리, 서비스 부정이용 방지',
              'Booktalk 서비스 제공: 콘텐츠 이용 및 서비스 운영',
              '고객 지원: 문의 응답, 기술 지원, 공지사항 전달',
            ]}
          />
        </Section>

        <Section title="제2조 (개인정보의 처리 및 보유기간)">
          <BodyText>회사는 다음과 같은 기간 동안 개인정보를 보유합니다:</BodyText>
          <Bullets
            items={['회원 정보: 회원 탈퇴 시까지', '서비스 이용 기록 및 콘텐츠 이용 정보: 1년']}
          />
          <BodyText>
            관련 법령에 따라 일정 기간 보관이 필요한 경우에는 해당 기간 동안 안전하게 보관 후
            파기합니다.
          </BodyText>
        </Section>

        <Section title="제3조 (개인정보의 수집항목 및 수집방법)">
          <SubSectionTitle>1. 회원가입 시 수집하는 정보</SubSectionTitle>
          <Bullets items={['필수항목: 이메일 주소, 비밀번호, 닉네임']} />
          <SubSectionTitle>2. 서비스 이용 중 수집하는 정보</SubSectionTitle>
          <Bullets
            items={['자동 수집: IP 주소, 쿠키, 접속 기록', '서비스 이용 정보: 콘텐츠 이용 정보']}
          />
          <SubSectionTitle>3. 수집 방법</SubSectionTitle>
          <BodyText>
            웹사이트 회원가입 및 서비스 이용 과정에서 이용자가 직접 입력하거나 자동으로 수집됩니다.
          </BodyText>
        </Section>

        <Section title="제4조 (데이터 보호 정책)">
          <SubSectionTitle>1. 데이터 보호 원칙</SubSectionTitle>
          <Bullets
            items={[
              '수집된 개인정보는 서비스 제공 목적 외의 용도로 사용되지 않습니다.',
              '사용자의 명시적 동의 없이는 개인정보에 접근하지 않습니다.',
            ]}
          />
          <SubSectionTitle>2. 고객 지원을 위한 예외적 접근</SubSectionTitle>
          <Bullets
            items={[
              '사용자가 고객 지원을 요청하고 이에 동의한 경우에만 제한적으로 접근합니다.',
              '접근 범위는 문제 해결에 필요한 최소한으로 제한됩니다.',
            ]}
          />
          <SubSectionTitle>3. 데이터 삭제 권한</SubSectionTitle>
          <Bullets
            items={[
              '사용자는 언제든지 본인의 개인정보 삭제를 요청할 수 있습니다.',
              '회원 탈퇴 시 개인정보는 관련 법령에 따라 처리 후 삭제됩니다.',
            ]}
          />
        </Section>

        <Section title="제5조 (개인정보의 제3자 제공)">
          <BodyText>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.</BodyText>
          <BodyText>다만, 다음의 경우에는 예외로 합니다:</BodyText>
          <Bullets
            items={[
              '이용자가 사전에 동의한 경우',
              '법령에 의해 제공이 요구되는 경우',
              '결제 처리를 위한 경우 (결제 대행업체)',
              '서비스 운영을 위한 인프라 제공의 경우',
            ]}
          />
        </Section>

        <Section title="제6조 (개인정보 처리 위탁)">
          <BodyText>
            회사는 원활한 서비스 제공을 위하여 다음과 같이 개인정보 처리업무를 위탁할 수 있습니다:
          </BodyText>
          <Bullets items={['클라우드 인프라 제공업체: 서버 호스팅 및 시스템 운영']} />
          <BodyText>
            위탁업체는 개인정보 보호 관련 법령을 준수하며, 위탁 목적 외로 개인정보를 처리하지
            않습니다.
          </BodyText>
        </Section>

        <Section title="제7조 (개인정보의 안전성 확보조치)">
          <BodyText>
            회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
          </BodyText>
          <Bullets
            items={[
              '접근 권한 관리: 개인정보 접근 권한 최소화',
              '보안 관리: 시스템 보안 점검 및 관리',
              '내부 관리: 개인정보 보호 관련 내부 기준 수립',
            ]}
          />
        </Section>

        <Section title="제8조 (정보주체의 권리·의무 및 행사방법)">
          <BodyText>이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</BodyText>
          <Bullets
            items={[
              '개인정보 열람 요청',
              '개인정보 수정 또는 삭제 요청',
              '개인정보 처리 정지 요청',
              '회원 탈퇴',
            ]}
          />
          <BodyText>
            권리 행사는 웹사이트 내 설정 또는 고객 지원 채널을 통해 요청할 수 있습니다.
          </BodyText>
        </Section>

        <Section title="제9조 (개인정보의 파기)">
          <BodyText>
            회사는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.
          </BodyText>
          <Bullets
            items={[
              '전자적 파일 형태: 복구 불가능한 방법으로 삭제',
              '법령에 따라 보관이 필요한 정보: 별도 보관 후 기간 만료 시 파기',
            ]}
          />
        </Section>

        <Section title="제10조 (개인정보 보호책임자)">
          <BodyText>개인정보 보호 업무를 총괄하는 책임자는 다음과 같습니다:</BodyText>
          <Bullets
            items={[
              '이름: 한재찬',
              '직책: 비밀취급자',
              '연락처: 010-4240-4054 / jchandev0211@gmail.com',
            ]}
          />
          <BodyText>개인정보 보호 관련 문의는 위 연락처를 통해 접수하실 수 있습니다.</BodyText>
          <SubSectionTitle>기타 개인정보 침해 신고 기관</SubSectionTitle>
          <Bullets
            items={[
              '개인정보침해신고센터: privacy.kisa.or.kr / 국번없이 118',
              '개인정보 분쟁조정위원회: www.kopico.go.kr / 국번없이 1833-6972',
            ]}
          />
        </Section>

        <Section title="제11조 (개인정보 처리방침 변경)">
          <BodyText>이 개인정보 처리방침은 2026년 02월 27일 시행됩니다.</BodyText>
          <BodyText>
            변경 사항이 있을 경우 웹사이트 공지사항을 통해 사전에 안내하며, 중요한 변경 사항은
            별도의 고지 방법을 통해 안내합니다.
          </BodyText>
          <Bullets items={['웹사이트 공지: Booktalk 서비스 공지사항']} />
        </Section>
      </PolicyWrapper>
    </PageContainer>
  );
}
