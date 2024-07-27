import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import JoinChat from './JoinChat';
import bgimg from '../assets/background.jpg';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: url(${bgimg}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
`;

const ChatBox = styled.div`
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  height: 80vh;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  gap:10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [nickname, setNickname] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [avatar, setAvatar] = useState('');
    const socket = useRef(null);

    useEffect(() => {
        return () => {
        if (socket.current) {
            socket.current.close();
        }
        };
    }, []);

    const connect = (nickname, selectedAvatar) => {
        setAvatar(selectedAvatar);

        socket.current = new WebSocket('ws://localhost:5555');
        socket.current.onopen = () => {
        socket.current.send(nickname);
        setIsConnected(true);
        setNickname(nickname);
        };

        socket.current.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        socket.current.onclose = () => {
        console.log('WebSocket connection closed');
        };
    };

    const sendMessage = (message) => {
        if (message.trim() && socket.current) {
        socket.current.send(JSON.stringify({ message }));
        }
    };

    return (
        <AppContainer>
        {!isConnected ? (
            <JoinChat connect={connect} />
        ) : (
            <ChatBox>
            <Header>
                <span>{nickname}</span>
                <Avatar src={avatar} alt="Avatar" />
            </Header>
            <ChatMessages messages={messages} nickname={nickname} />
            <MessageInput sendMessage={sendMessage} />
            </ChatBox>
        )}
        </AppContainer>
    );
};

export default ChatApp;
