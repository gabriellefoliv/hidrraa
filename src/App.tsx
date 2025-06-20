import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import { AuthProvider } from './context/auth';
import Home from './screens/Home';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import SidebarRoutes from './components/Sidebar';
import ModelosProjeto from './screens/ModelosProjeto';
import CriarProjeto from './screens/SubmeterProjeto';
import RealizarAporte from './screens/RealizarAporte';
import AportesRealizados from './screens/AportesRealizados';
import ValidarAporte from './screens/ValidarAporte';
import AvaliarProjetos from './screens/AvaliarProjeto';
import ProjetosAvaliados from './screens/ProjetosAvaliados';
import ProjetosSalvos from './screens/ProjetosSalvos';
import ProjetosSubmetidos from './screens/ProjetosSubmetidos';
import EditarProjeto from './screens/EditarProjeto';

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
          <Route path='/submeter-projeto/:codTipoProjeto' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <CriarProjeto />
            </ProtectedRoute>
          }/>
          <Route path='/projetos/editar/:codProjeto' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <EditarProjeto />
            </ProtectedRoute>
          }/>
          <Route path='/projetos-salvos' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <ProjetosSalvos />
            </ProtectedRoute>
          }/>
          <Route path='/projetos-submetidos' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <ProjetosSubmetidos />
            </ProtectedRoute>
          }/>

          
          <Route path='/aportes' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <RealizarAporte />
            </ProtectedRoute>
          }/>
          <Route path='/aportes-realizados' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <AportesRealizados />
            </ProtectedRoute>
          }/>
          <Route path='/validar-aportes' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <ValidarAporte />
            </ProtectedRoute>
          }/>
          <Route path='/avaliacoes' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <AvaliarProjetos />
            </ProtectedRoute>
          }/>
          <Route path='/projetos-avaliados' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <ProjetosAvaliados />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
