import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a script to apply border-radius to specific elements
const applyStyles = () => {
  // Add a style tag to handle complex selectors
  const style = document.createElement('style');
  style.innerHTML = `
    .group.flex.flex-col.data-\\[hidden\\=true\\]\\:hidden.w-full.relative.justify-end.data-\\[has-label\\=true\\]\\:mt-\\[calc\\(theme\\(fontSize\\.small\\)_\\+_8px\\)\\].border-\\[\\#E8E8E5\\].is-filled,
    div[class*="border-[#E8E8E5] is-filled"] {
      border-radius: 8px !important;
    }
    
    .flex.flex-col.relative.overflow-hidden.h-auto.text-foreground.box-border.bg-content1.outline-none.data-\\[focus-visible\\=true\\]\\:z-10.data-\\[focus-visible\\=true\\]\\:outline-2.data-\\[focus-visible\\=true\\]\\:outline-focus.data-\\[focus-visible\\=true\\]\\:outline-offset-2.shadow-medium.rounded-large.transition-transform-background.motion-reduce\\:transition-none,
    div[class*="flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1"] {
      width: auto !important;
      min-width: 268px !important;
    }
  `;
  document.head.appendChild(style);
  
  // Also add a mutation observer to apply styles to dynamically added elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const element = node as HTMLElement;
            
            // Apply border-radius to input wrappers
            if (element.className && element.className.includes('border-[#E8E8E5] is-filled')) {
              element.style.borderRadius = '8px';
            }
            
            // Apply width to card elements
            if (element.className && 
                element.className.includes('flex flex-col relative overflow-hidden h-auto text-foreground box-border bg-content1')) {
              element.style.width = 'auto';
              element.style.minWidth = '268px';
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
};

// Execute after the component mounts
window.addEventListener('DOMContentLoaded', applyStyles);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
