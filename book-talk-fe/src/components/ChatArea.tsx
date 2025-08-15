import {useCallback, useRef, useState} from 'react';
import type {Participant} from '../types';
import '../styles/ChatArea.css';

interface ChatAreaProps {
    currentSpeaker: Participant;
    onSendMessage: (message: string) => void;
    onSendTitle: (title: string) => void;
    onUploadImage: (file: File) => void;
    hasTitle: boolean;
}

export function ChatArea({
                             currentSpeaker,
                             onSendMessage,
                             onSendTitle,
                             onUploadImage,
                             hasTitle
                         }: ChatAreaProps) {
    const [message, setMessage] = useState('');
    const [showPasteIndicator, setShowPasteIndicator] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const autoResize = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        autoResize();
    };

    const processMessage = () => {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        if (trimmedMessage.startsWith('/title ')) {
            const title = trimmedMessage.substring(7).trim();
            if (title) {
                onSendTitle(title);
            }
        } else {
            if (!hasTitle) {
                alert('먼저 /title 명령어로 제목을 입력해주세요.');
                return;
            }
            onSendMessage(trimmedMessage);
        }

        setMessage('');
        autoResize();
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            processMessage();
        }
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!hasTitle) {
                alert('먼저 /title 명령어로 제목을 입력해주세요.');
                return;
            }
            onUploadImage(file);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();
                if (file) {
                    if (!hasTitle) {
                        alert('먼저 /title 명령어로 제목을 입력해주세요.');
                        return;
                    }
                    onUploadImage(file);
                    setShowPasteIndicator(true);
                    setTimeout(() => setShowPasteIndicator(false), 2000);
                }
                break;
            }
        }
    };

    return (
        <div className="chat-area">
            <div className="current-speaker">
                <div className="speaker-avatar">{currentSpeaker.avatar}</div>
                <div className="speaker-info">
                    {currentSpeaker.name}가 발표 자료를 준비하고 있습니다
                </div>
            </div>

            <div className="chat-input-container">
        <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="여기에 내용을 입력하세요... (/title 제목 으로 시작)"
            rows={1}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
        />
                <div className="chat-actions">
                    <button
                        className="action-btn"
                        title="이미지 업로드"
                        onClick={handleImageButtonClick}
                    >
                        📷
                    </button>
                    <button
                        className="action-btn send-btn"
                        title="전송"
                        onClick={processMessage}
                    >
                        ▶
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            {showPasteIndicator && (
                <div className="paste-indicator show">
                    이미지가 붙여넣어졌습니다!
                </div>
            )}
        </div>
    );
}