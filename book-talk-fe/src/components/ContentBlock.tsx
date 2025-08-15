import {useEffect, useRef, useState} from 'react';
import type {ContentBlock} from '../types';
import {DeleteModal} from './ui/DeleteModal';
import '../styles/ContentBlock.css';

interface ContentBlockProps {
    block: ContentBlock;
    isEditing: boolean;
    onEdit: () => void;
    onSave: (content: string) => void;
    onCancel: () => void;
    onDelete: () => void;
}

export function ContentBlockComponent({
                                          block,
                                          isEditing,
                                          onEdit,
                                          onSave,
                                          onCancel,
                                          onDelete
                                      }: ContentBlockProps) {
    const [editContent, setEditContent] = useState(block.content);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(
                textareaRef.current.value.length,
                textareaRef.current.value.length
            );
        }
    }, [isEditing]);

    useEffect(() => {
        setEditContent(block.content);
    }, [block.content]);

    const handleSave = () => {
        const trimmedContent = editContent.trim();
        if (trimmedContent) {
            onSave(trimmedContent);
        } else {
            onDelete();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
    };

    const formatContent = (content: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content
            .replace(urlRegex, '<a href="$1" target="_blank">$1</a>')
            .replace(/\n/g, '<br>');
    };

    if (isEditing) {
        return (
            <div className="content-block editing">
                <div className="block-controls">
                    <button
                        className="control-btn save"
                        title="저장 (Ctrl+Enter)"
                        onClick={handleSave}
                    >
                        💾
                    </button>
                    <button
                        className="control-btn cancel"
                        title="취소 (ESC)"
                        onClick={onCancel}
                    >
                        ❌
                    </button>
                </div>
                <textarea
                    ref={textareaRef}
                    className="content-edit"
                    placeholder="내용을 입력하세요..."
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
        );
    }

    return (
        <div
            className={`content-block show ${block.type === 'text' ? 'clickable' : ''}`}
            data-type={block.type}
            onClick={block.type === 'text' ? onEdit : undefined}
        >
            <div className="block-controls">
                {block.type === 'text' && (
                    <button
                        className="control-btn edit"
                        title="편집"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    >
                        ✏️
                    </button>
                )}
                <button
                    className="control-btn delete"
                    title="삭제"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal(true);
                    }}
                >
                    🗑️
                </button>
            </div>
            <div className="content-display">
                {block.type === 'text' ? (
                    <p dangerouslySetInnerHTML={{__html: formatContent(block.content)}}/>
                ) : (
                    <img src={block.content} alt="업로드된 이미지"/>
                )}
            </div>

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={onDelete}
            />
        </div>
    );
}