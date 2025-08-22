import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { SecurityManager } from './lib/security/securityManager';

// Importações de páginas
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Ensaios from './pages/Ensaios';
import Checklists from './pages/Checklists';
import Materiais from './pages/Materiais';
import Fornecedores from './pages/Fornecedores';
import NaoConformidades from './pages/NaoConformidades';
import Documentos from './pages/Documentos';
import Obras from './pages/Obras';
import RFIs from './pages/RFIs';
import EnsaiosCompactacao from './pages/EnsaiosCompactacao';
import ControloBetonagens from './pages/ControloBetonagens';
import CaracterizacaoSolos from './pages/CaracterizacaoSolos';
import Armaduras from './pages/Armaduras';
import Normas from './pages/Normas';
import SubmissaoMateriais from './pages/SubmissaoMateriais';
import Certificados from './pages/Certificados';
import CalibracoesEquipamentos from './pages/CalibracoesEquipamentos';
import Auditorias from './pages/Auditorias';
import RececaoObraGarantias from './pages/RececaoObraGarantias';
import ViaFerrea from './pages/ViaFerrea';
import Sinalizacao from './pages/Sinalizacao';
import SegurancaFerroviaria from './pages/SegurancaFerroviaria';
import PontesTuneis from './pages/PontesTuneis';
import Estacoes from './pages/Estacoes';
import Eletrificacao from './pages/Eletrificacao';
import FornecedoresAvancados from './pages/FornecedoresAvancados';
import ChecklistPage from './pages/ChecklistPage';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';
import PremiumLayout from './components/PremiumLayout';
import PDFGlobalConfig from './components/PDFGlobalConfig';

// Configuração inicial de segurança
SecurityManager.configure({
  rateLimitEnabled: true,
  auditLogEnabled: true,
  maxRequestsPerMinute: 60,
  maxRequestsPerHour: 1000,
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Páginas protegidas com layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
          </Route>
          
          <Route path="/ensaios" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Ensaios />} />
          </Route>
          
          <Route path="/checklists" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Checklists />} />
          </Route>
          
          <Route path="/materiais" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Materiais />} />
          </Route>
          
          <Route path="/fornecedores" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Fornecedores />} />
          </Route>
          
          <Route path="/nao-conformidades" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<NaoConformidades />} />
          </Route>
          
          <Route path="/documentos" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Documentos />} />
          </Route>
          
          <Route path="/obras" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Obras />} />
          </Route>
          
          <Route path="/rfis" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<RFIs />} />
          </Route>
          
          <Route path="/ensaios-compactacao" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<EnsaiosCompactacao />} />
          </Route>
          
          <Route path="/controlo-betonagens" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ControloBetonagens />} />
          </Route>
          
          <Route path="/caracterizacao-solos" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CaracterizacaoSolos />} />
          </Route>
          
          <Route path="/armaduras" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Armaduras />} />
          </Route>
          
          <Route path="/normas" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Normas />} />
          </Route>
          
          <Route path="/submissao-materiais" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SubmissaoMateriais />} />
          </Route>
          
          <Route path="/certificados" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Certificados />} />
          </Route>
          
          <Route path="/calibracoes-equipamentos" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CalibracoesEquipamentos />} />
          </Route>
          
          <Route path="/auditorias" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Auditorias />} />
          </Route>
          
          <Route path="/rececao-obra-garantias" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<RececaoObraGarantias />} />
          </Route>
          
          <Route path="/via-ferrea" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ViaFerrea />} />
          </Route>
          
          <Route path="/sinalizacao" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Sinalizacao />} />
          </Route>
          
          <Route path="/seguranca-ferroviaria" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<SegurancaFerroviaria />} />
          </Route>
          
          <Route path="/pontes-tuneis" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PontesTuneis />} />
          </Route>
          
          <Route path="/estacoes" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Estacoes />} />
          </Route>
          
          <Route path="/eletrificacao" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Eletrificacao />} />
          </Route>
          
          <Route path="/fornecedores-avancados" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<FornecedoresAvancados />} />
          </Route>
          
          <Route path="/checklist/:id" element={
            <ProtectedRoute>
              <PremiumLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ChecklistPage />} />
          </Route>
        </Routes>
        
        {/* Toaster para notificações */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Modal Global de Configuração de PDFs */}
        <PDFGlobalConfig />
      </div>
    </QueryClientProvider>
  );
}

export default App;
