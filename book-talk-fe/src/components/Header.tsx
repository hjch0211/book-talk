import type {Room} from '../types';
import '../styles/Header.css';

interface HeaderProps {
    room: Room;
}

export function Header({room}: HeaderProps) {
    return (
        <div className="header">
            <div className="header-left">
                <div className="room-info">토론방: {room.name}</div>
                <div className="topic">{room.topic}</div>
            </div>
            <div className="header-right">
                <div className="countdown-label">발표 시작까지</div>
                <div className="countdown-timer">{room.countdownText}</div>
            </div>
        </div>
    );
}