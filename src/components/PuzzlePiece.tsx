import React from 'react';
import styled from 'styled-components';

const PieceContainer = styled.div<{ isAnimating: boolean; animationDelay: number }>`
  position: absolute;
  user-select: none;
  z-index: 1;
  transition: ${props => props.isAnimating ? 'all 1.5s ease-in-out' : 'none'};
  transition-delay: ${props => props.isAnimating ? `${props.animationDelay}ms` : '0s'};
`;

interface EdgeInfo {
  top: 'flat' | 'tab' | 'indent';
  right: 'flat' | 'tab' | 'indent';
  bottom: 'flat' | 'tab' | 'indent';
  left: 'flat' | 'tab' | 'indent';
}

interface PuzzlePieceProps {
  id: number;
  image: string;
  width: number;
  height: number;
  isAnimating: boolean;
  animationDelay: number;
  x: number;
  y: number;
  row: number;
  col: number;
  totalRows: number;
  totalCols: number;
  edges: EdgeInfo;
}

const generatePiecePath = (width: number, height: number, edges: EdgeInfo): string => {
  const tabSize = Math.min(width, height) * 0.45; // Keep the same depth
  const tabWidth = tabSize * 0.7; // Make tabs narrower (70% of their depth)
  const overlap = 1; // 1 pixel overlap
  
  let path = `M ${-overlap} ${-overlap} `; // Start slightly outside

  // Top edge
  if (edges.top === 'flat') {
    path += `h ${width + overlap * 2} `;
  } else {
    const midPoint = width / 2;
    path += `h ${midPoint - tabWidth/2 + overlap} `;
    if (edges.top === 'tab') {
      // More circular tab
      path += `q ${0} ${-tabSize/2}, ${tabWidth/2} ${-tabSize/2} `;  // Left quarter circle
      path += `h ${0} `;  // Reduced straight top
      path += `q ${tabWidth/2} ${0}, ${tabWidth/2} ${tabSize/2} `;  // Right quarter circle
    } else { // indent
      // More circular indent
      path += `q ${0} ${tabSize/2}, ${tabWidth/2} ${tabSize/2} `;  // Left quarter circle
      path += `h ${0} `;  // Reduced straight bottom of indent
      path += `q ${tabWidth/2} ${0}, ${tabWidth/2} ${-tabSize/2} `;  // Right quarter circle
    }
    path += `h ${midPoint - tabWidth/2 + overlap} `;
  }

  // Right edge
  if (edges.right === 'flat') {
    path += `v ${height + overlap * 2} `;
  } else {
    const midPoint = height / 2;
    path += `v ${midPoint - tabWidth/2 + overlap} `;
    if (edges.right === 'tab') {
      // More circular tab
      path += `q ${tabSize/2} ${0}, ${tabSize/2} ${tabWidth/2} `;  // Top quarter circle
      path += `v ${0} `;  // Reduced straight right
      path += `q ${0} ${tabWidth/2}, ${-tabSize/2} ${tabWidth/2} `;  // Bottom quarter circle
    } else { // indent
      // More circular indent
      path += `q ${-tabSize/2} ${0}, ${-tabSize/2} ${tabWidth/2} `;  // Top quarter circle
      path += `v ${0} `;  // Reduced straight left of indent
      path += `q ${0} ${tabWidth/2}, ${tabSize/2} ${tabWidth/2} `;  // Bottom quarter circle
    }
    path += `v ${midPoint - tabWidth/2 + overlap} `;
  }

  // Bottom edge (moving right to left)
  if (edges.bottom === 'flat') {
    path += `h ${-(width + overlap * 2)} `;
  } else {
    const midPoint = width / 2;
    path += `h ${-(midPoint - tabWidth/2 + overlap)} `;
    if (edges.bottom === 'tab') {
      // More circular tab
      path += `q ${0} ${tabSize/2}, ${-tabWidth/2} ${tabSize/2} `;  // Right quarter circle
      path += `h ${0} `;  // Reduced straight bottom
      path += `q ${-tabWidth/2} ${0}, ${-tabWidth/2} ${-tabSize/2} `;  // Left quarter circle
    } else { // indent
      // More circular indent
      path += `q ${0} ${-tabSize/2}, ${-tabWidth/2} ${-tabSize/2} `;  // Right quarter circle
      path += `h ${0} `;  // Reduced straight top of indent
      path += `q ${-tabWidth/2} ${0}, ${-tabWidth/2} ${tabSize/2} `;  // Left quarter circle
    }
    path += `h ${-(midPoint - tabWidth/2 + overlap)} `;
  }

  // Left edge (moving bottom to top)
  if (edges.left === 'flat') {
    path += `v ${-(height + overlap * 2)} `;
  } else {
    const midPoint = height / 2;
    path += `v ${-(midPoint - tabWidth/2 + overlap)} `;
    if (edges.left === 'tab') {
      // More circular tab
      path += `q ${-tabSize/2} ${0}, ${-tabSize/2} ${-tabWidth/2} `;  // Bottom quarter circle
      path += `v ${0} `;  // Reduced straight left
      path += `q ${0} ${-tabWidth/2}, ${tabSize/2} ${-tabWidth/2} `;  // Top quarter circle
    } else { // indent
      // More circular indent
      path += `q ${tabSize/2} ${0}, ${tabSize/2} ${-tabWidth/2} `;  // Bottom quarter circle
      path += `v ${0} `;  // Reduced straight right of indent
      path += `q ${0} ${-tabWidth/2}, ${-tabSize/2} ${-tabWidth/2} `;  // Top quarter circle
    }
    path += `v ${-(midPoint - tabWidth/2 + overlap)} `;
  }

  path += 'Z';
  return path;
};

const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
  id,
  image,
  width,
  height,
  isAnimating,
  animationDelay,
  x,
  y,
  row,
  col,
  totalRows,
  totalCols,
  edges
}) => {
  const piecePath = generatePiecePath(width, height, edges);
  const uniqueId = `piece-${id}`;
  const tabSize = Math.min(width, height) * 0.3;
  
  return (
    <PieceContainer
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: `${width}px`,
        height: `${height}px`
      }}
      isAnimating={isAnimating}
      animationDelay={animationDelay}
    >
      <svg
        width={width + tabSize * 2}
        height={height + tabSize * 2}
        viewBox={`${-tabSize} ${-tabSize} ${width + tabSize * 2} ${height + tabSize * 2}`}
        style={{ 
          position: 'absolute', 
          top: -tabSize,
          left: -tabSize
        }}
      >
        <defs>
          <clipPath id={uniqueId}>
            <path d={piecePath} />
          </clipPath>
        </defs>
        <image
          href={image}
          x={-col * width}
          y={-row * height}
          width={width * totalCols}
          height={height * totalRows}
          clipPath={`url(#${uniqueId})`}
          preserveAspectRatio="none"
        />
        <path
          d={piecePath}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </PieceContainer>
  );
};

export default PuzzlePiece; 