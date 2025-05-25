import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import { AuthProvider } from './context/auth';
import Home from './screens/Home';
import { ProtectedRoute } from './components/ProtectedRoute';
import SidebarRoutes from './components/Sidebar';
import ModelosProjeto from './screens/ModelosProjeto';
import SubmeterProjeto from './screens/SubmeterProjeto';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/cadastro" element={<Cadastro/>} />
          <Route path='/inicio' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <Home />
            </ProtectedRoute>
          }/>
          <Route path='/projeto' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <ModelosProjeto />
            </ProtectedRoute>
          }/>
          <Route path='/submeter-projeto' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <SubmeterProjeto />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
