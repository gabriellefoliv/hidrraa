import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Auth/Login';
import Cadastro from './screens/Auth/Cadastro';
import { AuthProvider } from './context/auth';
import Home from './screens/Home';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import SidebarRoutes from './components/Sidebar';
import ModelosProjeto from './screens/EntDelTec/ModelosProjeto';
import CriarProjeto from './screens/EntDelTec/CriarProjeto';
import RealizarAporte from './screens/Investidor/RealizarAporte';
import AportesRealizados from './screens/Investidor/AportesRealizados';
import ValidarAporte from './screens/EntDelTec/ValidarAporte';
import ProjetosSalvos from './screens/EntExec/ProjetosSalvos';
import ProjetosSubmetidos from './screens/EntDelTec/ProjetosSubmetidos';
import EditarProjeto from './screens/EntDelTec/EditarProjeto';
import ProjetosContratados from './screens/EntExec/ProjetosContratados';
import ExecucaoMarco from './screens/EntExec/ExecucaoMarco';
import AnaliseMarco from './screens/EntDelTec/AnaliseMarco';
import AvaliacaoEvidencias from './screens/EntDelTec/AvaliacaoEvidencias';
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
          <Route path='/projetos-contratados' element={
            <ProtectedRoute>
              <SidebarRoutes/>
              <ProjetosContratados />
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
