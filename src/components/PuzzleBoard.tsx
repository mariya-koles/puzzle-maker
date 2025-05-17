import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import PuzzlePiece from './PuzzlePiece';

interface Position {
  x: number;
  y: number;
}

interface EdgeInfo {
  top: 'flat' | 'tab' | 'indent';
  right: 'flat' | 'tab' | 'indent';
  bottom: 'flat' | 'tab' | 'indent';
  left: 'flat' | 'tab' | 'indent';
}

interface PuzzlePiece {
  id: number;
  currentPos: Position;
  correctPos: Position;
  image: string;
  row: number;
  col: number;
  edges: EdgeInfo;
}

const BoardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
  font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;
`;

const PuzzleArea = styled.div`
  position: relative;
  width: 800px;
  height: 800px;
  background-color: #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
`;

const FullImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Button = styled.button`
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

interface PuzzleBoardProps {
  imageUrl: string;
  pieces: number;
  renderControls?: (props: {
    isScattered: boolean;
    isAnimating: boolean;
    onScatterAssemble: () => void;
  }) => React.ReactNode;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ imageUrl, pieces, renderControls }) => {
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [isScattered, setIsScattered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFullImage, setShowFullImage] = useState(true);
  const [animationOrder, setAnimationOrder] = useState<number[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  const gridSize = Math.sqrt(pieces);
  const pieceSize = 800 / gridSize;

  const ANIMATION_DELAY_PER_PIECE = 100;
  const ANIMATION_DURATION = 1200;

  // Helper function to determine if a piece is at the edge
  const isCornerPiece = (row: number, col: number) => 
    (row === 0 || row === gridSize - 1) && (col === 0 || col === gridSize - 1);

  const isEdgePiece = (row: number, col: number) =>
    row === 0 || col === 0 || row === gridSize - 1 || col === gridSize - 1;

  // Helper function to get the opposite edge type
  const getOppositeEdge = (edge: 'tab' | 'indent' | 'flat'): 'tab' | 'indent' | 'flat' => {
    if (edge === 'flat') return 'flat';
    return edge === 'tab' ? 'indent' : 'tab';
  };

  // Helper function to randomly choose between tab and indent
  const randomEdgeType = (): 'tab' | 'indent' => 
    Math.random() < 0.5 ? 'tab' : 'indent';

  useEffect(() => {
    const createPuzzlePieces = async () => {
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Create a 2D array to store edge information
      const edgeGrid: EdgeInfo[][] = Array(gridSize).fill(null)
        .map(() => Array(gridSize).fill(null));

      const newPieces: PuzzlePiece[] = [];

      // Generate pieces sequentially
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const id = row * gridSize + col;
          const edges: EdgeInfo = {
            top: 'flat',
            right: 'flat',
            bottom: 'flat',
            left: 'flat'
          };

          if (isCornerPiece(row, col)) {
            // Corner pieces have two flat edges
            edges.top = row === 0 ? 'flat' : randomEdgeType();
            edges.right = col === gridSize - 1 ? 'flat' : randomEdgeType();
            edges.bottom = row === gridSize - 1 ? 'flat' : randomEdgeType();
            edges.left = col === 0 ? 'flat' : randomEdgeType();
          } else if (isEdgePiece(row, col)) {
            // Edge pieces have one flat edge
            if (row === 0) edges.top = 'flat';
            if (col === 0) edges.left = 'flat';
            if (row === gridSize - 1) edges.bottom = 'flat';
            if (col === gridSize - 1) edges.right = 'flat';
          }

          // Set edges based on adjacent pieces
          if (row > 0) {
            // Get the bottom edge of the piece above
            edges.top = getOppositeEdge(edgeGrid[row - 1][col].bottom);
          }
          if (col > 0) {
            // Get the right edge of the piece to the left
            edges.left = getOppositeEdge(edgeGrid[row][col - 1].right);
          }

          // Randomly generate new connecting edges
          if (!isEdgePiece(row, col) || col < gridSize - 1) {
            edges.right = randomEdgeType();
          }
          if (!isEdgePiece(row, col) || row < gridSize - 1) {
            edges.bottom = randomEdgeType();
          }

          // Store the edge information
          edgeGrid[row][col] = edges;

          newPieces.push({
            id,
            currentPos: { x: col * pieceSize, y: row * pieceSize },
            correctPos: { x: col * pieceSize, y: row * pieceSize },
            image: imageUrl,
            row,
            col,
            edges
          });
        }
      }

      setPuzzlePieces(newPieces);
      // Initialize animation order
      setAnimationOrder([...Array(pieces)].map((_, i) => i));
    };

    createPuzzlePieces();
  }, [imageUrl, pieces, gridSize, pieceSize]);

  const handleScatterAssemble = () => {
    setIsAnimating(true);
    
    if (isScattered) {
      // Randomize assembly order
      const newOrder = [...animationOrder];
      for (let i = newOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
      }
      setAnimationOrder(newOrder);

      setPuzzlePieces(pieces => pieces.map(piece => ({
        ...piece,
        currentPos: piece.correctPos
      })));
      
      const totalDuration = ANIMATION_DURATION + (pieces * ANIMATION_DELAY_PER_PIECE);
      setTimeout(() => {
        setIsAnimating(false);
        setIsScattered(false);
        setShowFullImage(true);
      }, totalDuration);
    } else {
      // Calculate scattered positions with a margin from borders
      const occupiedSpaces: Position[] = [];
      const newPositions: Position[] = [];
      const margin = pieceSize * 0.4; // Add 40% of piece size as margin

      // Create array of indices and shuffle it for random scatter order
      const indices = [...Array(puzzlePieces.length)].map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setAnimationOrder(indices);

      // Calculate random positions for each piece
      for (let i = 0; i < puzzlePieces.length; i++) {
        let newPos: Position;
        let attempts = 0;
        const maxAttempts = 50;

        do {
          newPos = {
            x: margin + Math.random() * (800 - pieceSize - 2 * margin),
            y: margin + Math.random() * (800 - pieceSize - 2 * margin)
          };
          attempts++;
        } while (
          attempts < maxAttempts &&
          occupiedSpaces.some(pos => 
            Math.abs(pos.x - newPos.x) < pieceSize &&
            Math.abs(pos.y - newPos.y) < pieceSize
          )
        );

        occupiedSpaces.push(newPos);
        newPositions.push(newPos);
      }

      // Start the scatter sequence
      setShowFullImage(false);
      
      setTimeout(() => {
        setPuzzlePieces(pieces => 
          pieces.map((piece, index) => ({
            ...piece,
            currentPos: newPositions[index]
          }))
        );
        
        setIsScattered(true);
        
        const totalDuration = ANIMATION_DURATION + (pieces * ANIMATION_DELAY_PER_PIECE);
        setTimeout(() => {
          setIsAnimating(false);
        }, totalDuration);
      }, 50);
    }
  };

  return (
    <BoardContainer>
      {renderControls?.({
        isScattered,
        isAnimating,
        onScatterAssemble: handleScatterAssemble
      })}
      <PuzzleArea ref={boardRef}>
        {puzzlePieces.map((piece) => {
          const animationIndex = animationOrder.indexOf(piece.id);
          return (
            <PuzzlePiece
              key={piece.id}
              id={piece.id}
              image={piece.image}
              width={pieceSize}
              height={pieceSize}
              isAnimating={isAnimating}
              animationDelay={animationIndex * ANIMATION_DELAY_PER_PIECE}
              x={piece.currentPos.x}
              y={piece.currentPos.y}
              row={piece.row}
              col={piece.col}
              totalRows={gridSize}
              totalCols={gridSize}
              edges={piece.edges}
            />
          );
        })}
        {showFullImage && (
          <FullImage src={imageUrl} alt="Complete puzzle" />
        )}
      </PuzzleArea>
    </BoardContainer>
  );
};

export default PuzzleBoard; 