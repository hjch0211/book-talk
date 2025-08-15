import {useCallback, useState} from 'react';
import type {Article, ContentBlock, Participant, Room} from '../types';

export function useBookTalk() {
    const [article, setArticle] = useState<Article>({
        title: '',
        blocks: []
    });

    const [participants] = useState<Participant[]>([
        {
            id: '1',
            name: '최범이',
            avatar: '최',
            status: 'preparing'
        },
        {
            id: '2',
            name: '한재찬',
            avatar: '한',
            status: 'ready'
        },
        {
            id: '3',
            name: '김민수',
            avatar: '김',
            status: 'ready'
        },
        {
            id: '4',
            name: '이지현',
            avatar: '이',
            status: 'offline'
        }
    ]);

    const [room] = useState<Room>({
        id: '1',
        name: '가짜뉴스는 사라져야한다',
        topic: '발표 준비 단계 - 채팅으로 발표 자료를 준비하세요',
        countdownText: '1일 2시간 15분',
        currentSpeaker: participants[0],
        participants
    });

    const setTitle = useCallback((title: string) => {
        setArticle(prev => ({...prev, title}));
    }, []);

    const addContentBlock = useCallback((content: string, type: 'text' | 'image' = 'text') => {
        const newBlock: ContentBlock = {
            id: Date.now().toString(),
            type,
            content,
            timestamp: Date.now()
        };

        setArticle(prev => ({
            ...prev,
            blocks: [...prev.blocks, newBlock]
        }));
    }, []);

    const updateContentBlock = useCallback((blockId: string, content: string) => {
        setArticle(prev => ({
            ...prev,
            blocks: prev.blocks.map(block =>
                block.id === blockId ? {...block, content} : block
            )
        }));
    }, []);

    const deleteContentBlock = useCallback((blockId: string) => {
        setArticle(prev => ({
            ...prev,
            blocks: prev.blocks.filter(block => block.id !== blockId)
        }));
    }, []);

    const handleImageUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                addContentBlock(e.target.result as string, 'image');
            }
        };
        reader.readAsDataURL(file);
    }, [addContentBlock]);

    return {
        article,
        room,
        participants,
        setTitle,
        addContentBlock,
        updateContentBlock,
        deleteContentBlock,
        handleImageUpload
    };
}