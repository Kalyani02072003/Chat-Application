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
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Nickname = styled.span`
  font-weight: bold;
`;

const RoomName = styled.span`
  font-size: 14px;
  color: #222222;
  position: absolute;
  top: 35px;
  right: 20px;
`;

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState('');
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

  const connect = (nickname, selectedAvatar, room) => {
    setAvatar(selectedAvatar);

    socket.current = new WebSocket('https://chat-application-7zpt.onrender.com/');
    socket.current.onopen = () => {
      socket.current.send(JSON.stringify({ nickname, room }));
      // console.log(room)
      setIsConnected(true);
      setNickname(nickname);
      setRoom(room);
      // log.info('Connected to WebSocket server');
    };

    socket.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
      // log.debug('Received message:', event.data);
    };

    socket.current.onclose = () => {
      // log.warn('WebSocket connection closed');
    };
  };

  const sendMessage = (message) => {
    if (message.trim() && socket.current) {
      socket.current.send(JSON.stringify({ message }));
      // console.log(message);
    }
  };

  return (
    <AppContainer>
      {!isConnected ? (
        <JoinChat connect={connect} />
      ) : (
        <ChatBox>
          <Header>
            <UserSection>
              <Avatar src={avatar} alt="Avatar" />
              <Nickname>{nickname}</Nickname>
            </UserSection>
            <RoomName>Room Joined: {room}</RoomName>
          </Header>
          <ChatMessages messages={messages} nickname={nickname} />
          <MessageInput sendMessage={sendMessage} />
        </ChatBox>
      )}
    </AppContainer>
  );
};

export default ChatApp;