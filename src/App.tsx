import { NextUIProvider } from '@nextui-org/react';
import { StrictMode } from 'react';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import './App.css';
import BaselineInterface from './study/BaselineInterface';
import StudyInterface from './study/StudyInterface';
import { useStudyStore } from './study/StudyModel';
import TextoshopInterface from './view/TextoshopInterface';



function App() {

  const router = createHashRouter([
    {
      path: 'free-form',
      loader: () => {
        useStudyStore.getState().setIsDataSaved(false);
        return null;
      },
      element: <TextoshopInterface />
    },
    {
      path: 'study',
      element: <StudyInterface />
    },
    {
      path: 'baseline',
      element: <BaselineInterface />
    },
    {
      path: '',
      element: <TextoshopInterface />
    }
  ],
  /*{
    basename: import.meta.env.BASE_URL
  }*/
);

  return (
    <>
      <StrictMode>
        <NextUIProvider>
        <RouterProvider router={router} />
        </NextUIProvider>
      </StrictMode>
    </>
  )
}

export default App
