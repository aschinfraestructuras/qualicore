import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Ensaios from './pages/Ensaios'
import Checklists from './pages/Checklists'
import Materiais from './pages/Materiais'
import Fornecedores from './pages/Fornecedores'
import NaoConformidades from './pages/NaoConformidades'
import Documentos from './pages/Documentos'
import Relatorios from './pages/Relatorios'
import Obras from './pages/Obras'
import Landing from './pages/Landing'
import DocumentoForm from './components/forms/DocumentoForm'
import EnsaioForm from './components/forms/EnsaioForm'
import ChecklistForm from './components/forms/ChecklistForm'
import NaoConformidadeForm from './components/forms/NaoConformidadeForm'
import ObraForm from './components/forms/ObraForm'
import './styles/globals.css'

function App() {
  return (
    <div className="App">
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
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/ensaios" element={<Layout><Ensaios /></Layout>} />
        <Route path="/checklists" element={<Layout><Checklists /></Layout>} />
        <Route path="/materiais" element={<Layout><Materiais /></Layout>} />
        <Route path="/fornecedores" element={<Layout><Fornecedores /></Layout>} />
        <Route path="/nao-conformidades" element={<Layout><NaoConformidades /></Layout>} />
        <Route path="/documentos" element={<Layout><Documentos /></Layout>} />
        <Route path="/relatorios" element={<Layout><Relatorios /></Layout>} />
        <Route path="/obras" element={<Layout><Obras /></Layout>} />
        {/* Rotas para ações rápidas */}
        <Route path="/documentos/novo" element={<Layout><DocumentoForm isEditing={false} onSubmit={() => {}} onCancel={() => {}} /></Layout>} />
        <Route path="/ensaios/novo" element={<Layout><EnsaioForm isEditing={false} onSubmit={() => {}} onCancel={() => {}} /></Layout>} />
        <Route path="/checklists/novo" element={<Layout><ChecklistForm onSubmit={() => {}} onCancel={() => {}} /></Layout>} />
        <Route path="/nao-conformidades/nova" element={<Layout><NaoConformidadeForm isEditing={false} onSubmit={() => {}} onCancel={() => {}} /></Layout>} />
        <Route path="/obras/nova" element={<Layout><ObraForm onSubmit={() => {}} onCancel={() => {}} /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App 