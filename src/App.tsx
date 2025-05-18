import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import { AuthProvider } from './context/auth';
import Home from './screens/Home';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/cadastro" element={<Cadastro/>} />
          <Route path='/inicio' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
