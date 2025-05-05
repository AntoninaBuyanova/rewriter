import React from 'react';
import { Card } from "@nextui-org/react";
import { useModelStore } from "../../model/Model";
import { useUndoModelStore } from "../../model/UndoModel";
import { PasteIcon, UploadIcon } from './icons/CustomIcons';

interface EmptyStateOverlayProps {
  textFieldId: string;
}

export const EmptyStateOverlay: React.FC<EmptyStateOverlayProps> = ({ textFieldId }) => {
  // Only show for the main text field
  if (textFieldId !== 'mainTextField') return null;

  const setTextFields = useModelStore(state => state.setTextFields);
  const textFields = useModelStore(state => state.textFields);

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // Store undo state before making changes
        useUndoModelStore.getState().storeUndoState();
        
        // Update the main text field with the pasted text
        if (textFields.length > 0) {
          const newState = [{
            type: 'paragraph',
            children: [{ text }]
          }];
          
          setTextFields(
            textFields.map(tf => 
              tf.id === 'mainTextField' 
                ? { ...tf, state: newState } 
                : tf
            )
          );
        }
      }
    } catch (err) {
      console.error('Error pasting text:', err);
    }
  };

  const handleUploadClick = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.doc,.docx,.pdf,.txt,.rtf';
    
    // Add event listener to handle file selection
    fileInput.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Show loading state
        // In a real app, you'd display some loading indicator here
        
        const response = await fetch('https://api.mystylus.ai/mini-tools/extract-text', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.text) {
          // Store undo state before making changes
          useUndoModelStore.getState().storeUndoState();
          
          // Update the main text field with the extracted text
          if (textFields.length > 0) {
            const newState = [{
              type: 'paragraph',
              children: [{ text: data.text }]
            }];
            
            setTextFields(
              textFields.map(tf => 
                tf.id === 'mainTextField' 
                  ? { ...tf, state: newState } 
                  : tf
              )
            );
          }
        } else {
          throw new Error('No text was extracted from the document');
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        // In a real app, you'd display an error message
      }
    });
    
    // Trigger file selection dialog
    fileInput.click();
  };

  return (
    <>
      <div 
        className="pointer-events-none" 
        style={{ 
          position: 'absolute',
          left: 0,
          right: 0,
          top: '40px',
          width: '100%',
          zIndex: 10
        }}
      >
        <div 
          className="flex gap-4 pointer-events-auto justify-start" 
          style={{ 
            position: 'relative',
            width: '100%'
          }}
        >
          <Card 
            isPressable 
            onPress={handlePasteClick}
            className="bg-white border border-[#E8E8E5] file-uploader-card"
            style={{ 
              padding: '10px 16px',
              borderRadius: '8px',
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <div className="flex items-center gap-3">
              <PasteIcon size={24} />
              <span style={{ fontWeight: 500, fontSize: '14px' }}>Paste text</span>
            </div>
          </Card>
          
          <Card 
            isPressable 
            onPress={handleUploadClick}
            className="bg-white border border-[#E8E8E5] file-uploader-card"
            style={{ 
              padding: '10px 16px',
              borderRadius: '8px',
              boxShadow: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <div className="flex items-center gap-3">
              <UploadIcon size={24} />
              <span style={{ fontWeight: 500, fontSize: '14px' }}>Upload document</span>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}; 