import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/Router';
import { UserContextProvider } from './Context/UserContext';
import { ProjectContextProvider } from './Context/ProjectContext';

function App() {
  return (
    <UserContextProvider>
      <ProjectContextProvider>
        <RouterProvider router={router} />
      </ProjectContextProvider>
    </UserContextProvider>
  );
}

export default App;