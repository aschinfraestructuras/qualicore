import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
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
import Login from './pages/Login'
import DocumentoForm from './components/forms/DocumentoForm'
import EnsaioForm from './components/forms/EnsaioForm'
import ChecklistForm from './components/forms/ChecklistForm'
import ObraForm from './components/forms/ObraForm'
import RFIs from './pages/RFIs'
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
        {/* Rotas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredPermission="dashboard">
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/ensaios" element={
          <ProtectedRoute requiredPermission="ensaios">
            <Layout><Ensaios /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/checklists" element={
          <ProtectedRoute requiredPermission="checklists">
            <Layout><Checklists /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/materiais" element={
          <ProtectedRoute requiredPermission="materiais">
            <Layout><Materiais /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/fornecedores" element={
          <ProtectedRoute requiredPermission="fornecedores">
            <Layout><Fornecedores /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/nao-conformidades" element={
          <ProtectedRoute requiredPermission="nao-conformidades">
            <Layout><NaoConformidades /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/documentos" element={
          <ProtectedRoute requiredPermission="documentos">
            <Layout><Documentos /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/relatorios" element={
          <ProtectedRoute requiredPermission="relatorios">
            <Layout><Relatorios /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/obras" element={
          <ProtectedRoute requiredPermission="dashboard">
            <Layout><Obras /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/rfis" element={
          <ProtectedRoute requiredPermission="documentos">
            <Layout><RFIs /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Rotas para ações rápidas */}
        <Route path="/documentos/novo" element={
          <ProtectedRoute requiredPermission="documentos">
            <Layout><DocumentoForm isEditing={false} onSubmit={() => {}} onCancel={() => {}} /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/ensaios/novo" element={
          <ProtectedRoute requiredPermission="ensaios">
            <Layout><EnsaioForm isEditing={false} onSubmit={() => {}} onCancel={() => {}} /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/checklists/novo" element={
          <ProtectedRoute requiredPermission="checklists">
            <Layout><ChecklistForm onSubmit={() => {}} onCancel={() => {}} /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/obras/nova" element={
          <ProtectedRoute requiredPermission="dashboard">
            <Layout><ObraForm onSubmit={() => {}} onCancel={() => {}} /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App 