import {Header} from '../../components/Header.tsx';
import {ArticleArea} from '../../components/ArticleArea.tsx';
import {ChatArea} from '../../components/ChatArea.tsx';
import {Sidebar} from '../../components/Sidebar.tsx';
import {useBookTalk} from '../../hooks/useBookTalk.ts';
import '../../App.css';

export function MainPage() {
    const {
        article,
        room,
        participants,
        setTitle,
        addContentBlock,
        updateContentBlock,
        deleteContentBlock,
        handleImageUpload
    } = useBookTalk();

    return (
        <div className="main-container">
            <div className="container">
                <Header room={room}/>
                <ArticleArea
                    article={article}
                    onUpdateBlock={updateContentBlock}
                    onDeleteBlock={deleteContentBlock}
                />
                <ChatArea
                    currentSpeaker={room.currentSpeaker}
                    onSendMessage={addContentBlock}
                    onSendTitle={setTitle}
                    onUploadImage={handleImageUpload}
                    hasTitle={!!article.title}
                />
            </div>
            <Sidebar participants={participants}/>
        </div>
    );
}