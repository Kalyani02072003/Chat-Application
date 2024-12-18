import React from 'react';
import styled from 'styled-components';

const MessagesContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
`;

const Message = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  margin-right: 20px;
  border-radius: 5px;
  background-color: ${(props) => (props.isOwnMessage ? '#e1ffc7' : '#f0f0f0')};
  align-self: ${(props) => (props.isOwnMessage ? 'flex-end' : 'flex-start')};
  color: ${(props) => (props.isNotification ? 'gray' : 'black')};
  text-align: ${(props) => (props.isNotification ? 'center' : 'left')};
`;

const ChatMessages = ({ messages, nickname }) => {
  

  return (
    <MessagesContainer>
      {messages.map((message, index) => {
        const isOwnMessage = message.startsWith(`${nickname}:`);
        const isNotification = message.includes('has joined') || message.includes('has left');
        return (
          <Message key={index} isOwnMessage={isOwnMessage} isNotification={isNotification}>
            {message}
          </Message>
        );
      })}
    </MessagesContainer>
  );
};

export default ChatMessages;
