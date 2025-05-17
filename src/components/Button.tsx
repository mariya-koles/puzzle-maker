import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 8px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: inherit;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props} />;
};

export default Button; 