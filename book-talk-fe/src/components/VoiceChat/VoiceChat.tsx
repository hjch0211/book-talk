import React, {useEffect, useRef, useState} from 'react';
import {Box, Typography, IconButton, Collapse} from '@mui/material';
import {Mic, MicOff, VolumeUp, VolumeOff, KeyboardArrowDown, KeyboardArrowUp, Phone, PhoneDisabled} from '@mui/icons-material';
import {useVoiceChat} from '../../hooks/useVoiceChat';
import {
    VoiceChatContainer,
    VoiceChatHeader,
    ParticipantsList,
    ParticipantItem,
    ParticipantInfo,
    ParticipantName,
    VoiceChatControls,
    MuteButton,
    VolumeControl,
    CustomSlider
} from './VoiceChat.style';

interface VoiceChatProps {
    isVisible: boolean;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({isVisible}) => {
    const {
        participants,
        isJoined,
        isMuted,
        isConnecting,
        joinVoiceChat,
        leaveVoiceChat,
        toggleMute,
        setParticipantVolume,
        getRemoteStream,
        getLocalStream
    } = useVoiceChat();

    const [isExpanded, setIsExpanded] = useState(true);
    const [participantVolumes, setParticipantVolumes] = useState<Record<string, number>>({});
    const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

    useEffect(() => {
        participants.forEach(participant => {
            const stream = getRemoteStream(participant.accountId);
            let audioElement = audioElementsRef.current.get(participant.accountId);

            if (stream && !audioElement) {
                audioElement = new Audio();
                audioElement.srcObject = stream;
                audioElement.autoplay = true;
                audioElement.volume = participantVolumes[participant.accountId] || 1.0;
                audioElementsRef.current.set(participant.accountId, audioElement);
            } else if (!stream && audioElement) {
                audioElement.pause();
                audioElement.srcObject = null;
                audioElementsRef.current.delete(participant.accountId);
            } else if (audioElement) {
                audioElement.volume = participantVolumes[participant.accountId] || 1.0;
            }
        });

        audioElementsRef.current.forEach((audioElement, accountId) => {
            const participantExists = participants.some(p => p.accountId === accountId);
            if (!participantExists) {
                audioElement.pause();
                audioElement.srcObject = null;
                audioElementsRef.current.delete(accountId);
            }
        });
    }, [participants, participantVolumes, getRemoteStream]);

    useEffect(() => {
        return () => {
            audioElementsRef.current.forEach(audioElement => {
                audioElement.pause();
                audioElement.srcObject = null;
            });
            audioElementsRef.current.clear();
        };
    }, []);

    const handleVolumeChange = (participantId: string, volume: number) => {
        setParticipantVolumes(prev => ({
            ...prev,
            [participantId]: volume
        }));
        setParticipantVolume(participantId, volume);
    };

    const handleJoinLeave = async () => {
        if (isJoined) {
            await leaveVoiceChat();
        } else {
            await joinVoiceChat();
        }
    };

    if (!isVisible) return null;

    return (
        <VoiceChatContainer>
            <VoiceChatHeader>
                <Typography variant="h6" component="div">
                    음성 채팅 ({participants.length})
                </Typography>
                <IconButton
                    size="small"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}
                </IconButton>
            </VoiceChatHeader>

            <Collapse in={isExpanded}>
                <ParticipantsList>
                    {participants.map(participant => (
                        <ParticipantItem
                            key={participant.accountId}
                            isSpeaking={participant.isSpeaking}
                        >
                            <ParticipantInfo>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    {participant.isMuted ? <MicOff fontSize="small"/> : <Mic fontSize="small"/>}
                                    <ParticipantName>
                                        {participant.accountName}
                                    </ParticipantName>
                                </Box>
                            </ParticipantInfo>

                            <VolumeControl>
                                <VolumeOff fontSize="small"/>
                                <CustomSlider
                                    size="small"
                                    value={participantVolumes[participant.accountId] || 1.0}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    onChange={(_, value) => handleVolumeChange(participant.accountId, value as number)}
                                />
                                <VolumeUp fontSize="small"/>
                            </VolumeControl>
                        </ParticipantItem>
                    ))}

                    {participants.length === 0 && (
                        <Box sx={{textAlign: 'center', py: 2, color: 'text.secondary'}}>
                            참여자가 없습니다
                        </Box>
                    )}
                </ParticipantsList>

                <VoiceChatControls>
                    <IconButton
                        color={isJoined ? 'error' : 'success'}
                        onClick={handleJoinLeave}
                        disabled={isConnecting}
                        sx={{
                            backgroundColor: isJoined ? 'error.main' : 'success.main',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: isJoined ? 'error.dark' : 'success.dark',
                            },
                        }}
                    >
                        {isJoined ? <PhoneDisabled/> : <Phone/>}
                    </IconButton>

                    {isJoined && (
                        <MuteButton
                            isMuted={isMuted}
                            onClick={toggleMute}
                        >
                            {isMuted ? <MicOff/> : <Mic/>}
                        </MuteButton>
                    )}
                </VoiceChatControls>
            </Collapse>
        </VoiceChatContainer>
    );
};