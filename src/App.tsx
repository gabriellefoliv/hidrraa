import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Auth/Login';
import Cadastro from './screens/Auth/Cadastro';
import { AuthProvider } from './context/auth';
import Home from './screens/Home';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import SidebarRoutes from './components/Sidebar';
import ModelosProjeto from './screens/EntExec/ModelosProjeto';
import CriarProjeto from './screens/EntExec/CriarProjeto';
import RealizarAporte from './screens/Investidor/RealizarAporte';
import AportesRealizados from './screens/Investidor/AportesRealizados';
import ValidarAporte from './screens/MembroCBH/ValidarAporte';
import AvaliarProjetos from './screens/MembroCBH/AvaliarProjeto';
import ProjetosAvaliados from './screens/MembroCBH/ProjetosAvaliados';
import ProjetosSalvos from './screens/EntExec/ProjetosSalvos';
import ProjetosSubmetidos from './screens/EntExec/ProjetosSubmetidos';
import EditarProjeto from './screens/EntExec/EditarProjeto';
import ProjetosAprovados from './screens/EntExec/ProjetosAprovados';
import ExecucaoMarco from './screens/EntExec/ExecucaoMarco';
import AnaliseMarco from './screens/MembroCBH/AnaliseMarco';
import AvaliacaoEvidencias from './screens/MembroCBH/AvaliacaoEvidencias';
import MarcosAvaliados from './screens/EntExec/MarcosAvaliados';

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
          <Route path='/projetos-aprovados' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <ProjetosAprovados />
            </ProtectedRoute>
          }/>
          <Route path='/executar-marcos/:codProjeto' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <ExecucaoMarco />
            </ProtectedRoute>
          }/>
          <Route path='/analise-marcos' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <AnaliseMarco />
            </ProtectedRoute>
          }/>
          <Route path='/analise-marcos/:codProjeto' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <AvaliacaoEvidencias />
            </ProtectedRoute>
          }/>
          <Route path='/marcos-avaliados/:codProjeto' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <MarcosAvaliados />
            </ProtectedRoute>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
