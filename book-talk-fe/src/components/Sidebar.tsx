import type {Participant} from '../types';
import '../styles/Sidebar.css';

interface SidebarProps {
    participants: Participant[];
}

export function Sidebar({participants}: SidebarProps) {
    const getStatusIcon = (status: Participant['status']) => {
        switch (status) {
            case 'preparing':
                return '⏳';
            case 'ready':
                return '✅';
            case 'offline':
                return '❌';
        }
    };

    const getStatusText = (status: Participant['status']) => {
        switch (status) {
            case 'preparing':
                return '준비중...';
            case 'ready':
                return '준비 완료';
            case 'offline':
                return '오프라인';
        }
    };

    const getStatusColor = (status: Participant['status']) => {
        switch (status) {
            case 'preparing':
                return '#ffc107';
            case 'ready':
                return '#28a745';
            case 'offline':
                return '#dc3545';
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">준비 현황</div>

            <div className="participants-section">
                <div className="section-title">
                    👥 참여자 ({participants.length}명)
                </div>

                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        className={`participant-item ${participant.status}`}
                    >
                        <div
                            className="participant-avatar"
                            style={{background: getStatusColor(participant.status)}}
                        >
                            {participant.avatar}
                        </div>
                        <div className="participant-info">
                            <div className="participant-name">{participant.name}</div>
                            <div className="participant-status">{getStatusText(participant.status)}</div>
                        </div>
                        <div className="status-indicator">{getStatusIcon(participant.status)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}