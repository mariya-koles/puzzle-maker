import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import ImageUploader from './components/ImageUploader';
import PuzzleBoard from './components/PuzzleBoard';
import Toolbar from './components/Toolbar';
import Button from './components/Button';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #1a1a1a;
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a1a;
`;

const Header = styled.header`
  width: 100%;
  padding: 20px;
  background-color: #2a2a2a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  margin: 0;
  font-size: 2.5rem;
  font-weight: 500;
`;

const Subtitle = styled.p`
  color: #bbb;
  margin: 10px 0 0;
`;

const MainContent = styled.main`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
`;

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [puzzlePieces, setPuzzlePieces] = useState<number>(36); // Default 6x6 grid

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handlePuzzlePiecesChange = (pieces: number) => {
    setPuzzlePieces(pieces);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>Create Jigsaw Puzzle</Title>
          <Subtitle>Upload an image to create your own interactive jigsaw puzzle</Subtitle>
        </Header>
        <MainContent>
          {!uploadedImage ? (
            <>
              <Toolbar 
                puzzlePieces={puzzlePieces}
                onPuzzlePiecesChange={handlePuzzlePiecesChange}
              />
              <ImageUploader onImageUpload={handleImageUpload} />
            </>
          ) : (
            <PuzzleBoard 
              imageUrl={uploadedImage}
              pieces={puzzlePieces}
              renderControls={({ isScattered, isAnimating, onScatterAssemble }) => (
                <Toolbar 
                  puzzlePieces={puzzlePieces}
                  onPuzzlePiecesChange={handlePuzzlePiecesChange}
                >
                  <Button onClick={onScatterAssemble} disabled={isAnimating}>
                    {isScattered ? 'Assemble' : 'Scatter'}
                  </Button>
                </Toolbar>
              )}
            />
          )}
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App; 