import {useState} from 'react';
import type {Article} from '../types';
import {ContentBlockComponent} from './ContentBlock';
import '../styles/ArticleArea.css';

interface ArticleAreaProps {
    article: Article;
    onUpdateBlock: (blockId: string, content: string) => void;
    onDeleteBlock: (blockId: string) => void;
}

export function ArticleArea({article, onUpdateBlock, onDeleteBlock}: ArticleAreaProps) {
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

    const hasContent = article.title || article.blocks.length > 0;

    return (
        <div className="article-area">
            <div className="article-container">
                {article.title && (
                    <div className={`article-title ${article.title ? 'show' : ''}`}>
                        {article.title}
                    </div>
                )}

                <div className="article-content">
                    {!hasContent && (
                        <div className="placeholder-text">
                            채팅에 "/title 제목" 으로 제목을 입력하고,<br/>
                            이어서 내용을 작성해보세요.<br/>
                            <small style={{color: '#95a5a6', marginTop: '10px', display: 'block'}}>
                                💡 이미지는 Ctrl+V로 붙여넣거나 📷 버튼을 이용하세요<br/>
                                📝 이전 내용을 클릭하면 수정/삭제할 수 있습니다
                            </small>
                        </div>
                    )}

                    {article.blocks.map((block) => (
                        <ContentBlockComponent
                            key={block.id}
                            block={block}
                            isEditing={editingBlockId === block.id}
                            onEdit={() => setEditingBlockId(block.id)}
                            onSave={(content) => {
                                onUpdateBlock(block.id, content);
                                setEditingBlockId(null);
                            }}
                            onCancel={() => setEditingBlockId(null)}
                            onDelete={() => onDeleteBlock(block.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}