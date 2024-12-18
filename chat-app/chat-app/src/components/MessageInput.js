import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  outline: none;
`;

const SendButton = styled.button`
  padding: 10px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const MessageInput = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    sendMessage(message);
    // log.debug('Message sent:', message);
    setMessage('');
  };

  return (
    <InputContainer>
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
      />
      <SendButton onClick={handleSendMessage}>Send</SendButton>
    </InputContainer>
  );
};

export default MessageInput;
