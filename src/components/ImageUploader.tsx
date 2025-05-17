import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DropZone = styled.div<{ isDragging: boolean }>`
  width: 100%;
  max-width: 500px;
  height: 300px;
  border: 2px dashed ${props => props.isDragging ? '#4CAF50' : '#ccc'};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.isDragging ? 'rgba(76, 175, 80, 0.1)' : '#fafafa'};

  &:hover {
    border-color: #4CAF50;
    background-color: rgba(76, 175, 80, 0.1);
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: #666;
  margin-bottom: 16px;
`;

const UploadText = styled.p`
  color: #666;
  margin: 0;
  text-align: center;
`;

const HiddenInput = styled.input`
  display: none;
`;

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <UploaderContainer>
      <DropZone
        isDragging={isDragging}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadIcon>📁</UploadIcon>
        <UploadText>
          Drag and drop an image here<br />
          or click to select a file
        </UploadText>
      </DropZone>
      <HiddenInput
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileInput}
      />
    </UploaderContainer>
  );
};

export default ImageUploader; 