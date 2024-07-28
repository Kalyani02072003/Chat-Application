import React, { useState } from 'react';
import styled from 'styled-components';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import avatar3 from '../assets/avatar3.png';
import avatar4 from '../assets/avatar4.png';
import avatar5 from '../assets/avatar5.png';

const JoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  border-radius: 10px;
  outline: none;
  margin-bottom: 10px;
  width: 100%;
  max-width: 300px;
`;

const AvatarSelection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  border: ${(props) => (props.selected ? '2px solid #007bff' : 'none')};

  &:hover {
    border: 2px solid #007bff;
  }
`;

const JoinButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;

  &:hover {
    background-color: #0056b3;
  }
`;

const JoinChat = ({ connect }) => {
  const [nickname, setNickname] = useState('');
  const [room, setRoom] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
  };

  return (
    <JoinContainer>
      <Title>Join an instant Chat Application with your friends</Title>
      <Input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Enter your nickname"
      />
      <Input
        type="text"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        placeholder="Enter room name"
      />
      <AvatarSelection>
        {avatars.map((avatar, index) => (
          <Avatar
            key={index}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            selected={avatar === selectedAvatar}
            onClick={() => handleAvatarClick(avatar)}
          />
        ))}
      </AvatarSelection>
      <JoinButton onClick={() => connect(nickname, selectedAvatar, room)}>
        Join Chat
      </JoinButton>
    </JoinContainer>
  );
};

export default JoinChat;
