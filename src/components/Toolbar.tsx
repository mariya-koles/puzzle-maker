import React from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  background-color: #2a2a2a;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Label = styled.label`
  color: white;
  font-weight: 500;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  outline: none;
  font-family: inherit;

  &:hover {
    border-color: #4CAF50;
  }

  &:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  option {
    background-color: #1a1a1a;
    color: white;
  }
`;

interface ToolbarProps {
  puzzlePieces: number;
  onPuzzlePiecesChange: (pieces: number) => void;
  children?: React.ReactNode;
}

const Toolbar: React.FC<ToolbarProps> = ({ puzzlePieces, onPuzzlePiecesChange, children }) => {
  const handlePiecesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPuzzlePiecesChange(Number(e.target.value));
  };

  return (
    <ToolbarContainer>
      <ToolbarGroup>
        <Label htmlFor="pieces">Puzzle Pieces:</Label>
        <Select
          id="pieces"
          value={puzzlePieces}
          onChange={handlePiecesChange}
        >
          <option value="16">4 x 4 (16 pieces)</option>
          <option value="36">6 x 6 (36 pieces)</option>
          <option value="64">8 x 8 (64 pieces)</option>
          <option value="100">10 x 10 (100 pieces)</option>
        </Select>
      </ToolbarGroup>
      {children && <ToolbarGroup>{children}</ToolbarGroup>}
    </ToolbarContainer>
  );
};

export default Toolbar; 