import {RoundStartBackdrop} from './RoundStartBackdrop';

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface RoundStartBackdropContainerProps {
    show: boolean;
    roundType: RoundType | null;
    onClose: () => void;
}

/** 라운드 시작할 때마다 Guide back drop */
export function RoundStartBackdropContainer({show, roundType, onClose}: RoundStartBackdropContainerProps) {
    if (!show || !roundType) return null;

    const content = {
        PRESENTATION: {
            title: "1 라운드 시작",
            subtitle: "발표지를 활용해 자신의 생각이나 의견을 말해주세요!",
            description: (
                <>
                    우측 프로필의 순서대로 발표가 진행됩니다.<br/>
                    시간 내 발표가 끝나면 발표끝내기 버튼을 눌러 다음사람에게 넘겨주세요.
                </>
            )
        },
        FREE: {
            title: "2 라운드 시작",
            subtitle: "다양한 자료를 공유하며 자유롭게 토론해주세요!",
            description: (
                <>
                    프로필 메뉴기능을 통해 다른 사람의 발표지를 확인하거나 발언권을 넘겨줄 수 있어요.<br/>
                    손들기 버튼으로 발언권을 주장하고 발표자를 넘겨받으세요.
                </>
            )
        },
        PREPARATION: {
            title: "준비 중",
            subtitle: "토론 시작을 기다리는 중입니다.",
            description: "호스트가 토론을 시작할 때까지 기다려주세요."
        }
    };

    const currentContent = content[roundType];

    return (
        <RoundStartBackdrop open={show} onClose={onClose}>
            <RoundStartBackdrop.Title>{currentContent.title}</RoundStartBackdrop.Title>
            <RoundStartBackdrop.Subtitle>{currentContent.subtitle}</RoundStartBackdrop.Subtitle>
            <RoundStartBackdrop.Description>{currentContent.description}</RoundStartBackdrop.Description>
        </RoundStartBackdrop>
    );
}