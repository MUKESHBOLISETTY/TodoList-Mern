import './App.css'
import { UserDetails } from './UserDetails';
import UserChecker from './collector/UserChecker'
import { DashboardView } from './DashboardView';
import VerifiedPage from './components/VerifiedPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ResetPassword from './components/ResetPassword';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <DashboardView>
        <UserDetails>
          <UserChecker />
        </UserDetails>
      </DashboardView>
    },
    {
      path: '/auth/:userid/verify/:token',
      element: <VerifiedPage />
    },
    {
      path: '/password/:userid/reset/:token',
      element: <ResetPassword />
    }

  ])

   return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
