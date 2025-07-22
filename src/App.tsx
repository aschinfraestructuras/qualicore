import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./lib/auth";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Ensaios from "./pages/Ensaios";
import EnsaiosCompactacao from "./pages/EnsaiosCompactacao";
import Checklists from "./pages/Checklists";
import Materiais from "./pages/Materiais";
import Fornecedores from "./pages/Fornecedores";
import NaoConformidades from "./pages/NaoConformidades";
import Documentos from "./pages/Documentos";
import Relatorios from "./pages/Relatorios";
import Obras from "./pages/Obras";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DocumentoForm from "./components/forms/DocumentoForm";
import EnsaioForm from "./components/forms/EnsaioForm";
import EnsaioCompactacaoForm from "./components/forms/EnsaioCompactacaoForm";
import ChecklistForm from "./components/forms/ChecklistForm";
import ObraForm from "./components/forms/ObraForm";
import MaterialForm from "./components/forms/MaterialForm";
import FornecedorForm from "./components/forms/FornecedorForm";
import NaoConformidadeForm from "./components/forms/NaoConformidadeForm";
import RFIForm from "./components/forms/RFIForm";
import RFIs from "./pages/RFIs";
import PontosInspecaoEnsaiosPage from "./pages/PontosInspecaoEnsaios";
import PontosInspecaoEnsaiosEditor from "./components/pie/PontosInspecaoEnsaiosEditor";
import "./styles/globals.css";
import { ensaioCompactacaoService } from "./services/ensaioCompactacaoService";

function App() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação ao carregar a app
    useAuthStore.getState().checkUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas - apenas para usuários autenticados */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/ensaios"
          element={
            user ? (
              <Layout>
                <Ensaios />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/ensaios-compactacao"
          element={
            user ? (
              <Layout>
                <EnsaiosCompactacao />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/checklists"
          element={
            user ? (
              <Layout>
                <Checklists />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/materiais"
          element={
            user ? (
              <Layout>
                <Materiais />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/fornecedores"
          element={
            user ? (
              <Layout>
                <Fornecedores />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/nao-conformidades"
          element={
            user ? (
              <Layout>
                <NaoConformidades />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/documentos"
          element={
            user ? (
              <Layout>
                <Documentos />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/relatorios"
          element={
            user ? (
              <Layout>
                <Relatorios />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/obras"
          element={
            user ? (
              <Layout>
                <Obras />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/rfis"
          element={
            user ? (
              <Layout>
                <RFIs />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/pie"
          element={
            user ? (
              <Layout>
                <PontosInspecaoEnsaiosPage />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/pie/editor"
          element={
            user ? (
              <Layout>
                <PontosInspecaoEnsaiosEditor />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/pie/editor/:id"
          element={
            user ? (
              <Layout>
                <PontosInspecaoEnsaiosEditor />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/pie/view/:id"
          element={
            user ? (
              <Layout>
                <PontosInspecaoEnsaiosEditor />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rotas para ações rápidas */}
        <Route
          path="/documentos/novo"
          element={
            user ? (
              <Layout>
                <DocumentoForm
                  onSubmit={() => {
                    toast.success('Documento criado com sucesso!');
                    navigate('/documentos');
                  }}
                  onCancel={() => {
                    navigate('/documentos');
                  }}
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/ensaios/novo"
          element={
            user ? (
              <Layout>
                <EnsaioForm
                  onSubmit={() => {
                    toast.success('Ensaio criado com sucesso!');
                    navigate('/ensaios');
                  }}
                  onCancel={() => {
                    navigate('/ensaios');
                  }}
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/ensaios-compactacao/novo"
          element={
            user ? (
              <Layout>
                <EnsaioCompactacaoForm
                  onSubmit={async (ensaio) => {
                    try {
                      await ensaioCompactacaoService.create(ensaio);
                      toast.success('Ensaio de compactação criado com sucesso!');
                      navigate('/ensaios-compactacao');
                    } catch (error) {
                      console.error('Erro ao criar ensaio:', error);
                      toast.error('Erro ao criar ensaio de compactação');
                    }
                  }}
                  onCancel={() => {
                    navigate('/ensaios-compactacao');
                  }}
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/checklists/novo"
          element={
            user ? (
              <Layout>
                <ChecklistForm 
                  onSubmit={() => {
                    toast.success('Checklist criado com sucesso!');
                    navigate('/checklists');
                  }} 
                  onCancel={() => {
                    navigate('/checklists');
                  }} 
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/obras/nova"
          element={
            user ? (
              <Layout>
                <ObraForm 
                  onSubmit={() => {
                    toast.success('Obra criada com sucesso!');
                    navigate('/obras');
                  }} 
                  onCancel={() => {
                    navigate('/obras');
                  }} 
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/materiais/novo"
          element={
            user ? (
              <Layout>
                <MaterialForm 
                  onSubmit={() => {
                    toast.success('Material criado com sucesso!');
                    navigate('/materiais');
                  }} 
                  onCancel={() => {
                    navigate('/materiais');
                  }} 
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/fornecedores/novo"
          element={
            user ? (
              <Layout>
                <FornecedorForm 
                  onSubmit={() => {
                    toast.success('Fornecedor criado com sucesso!');
                    navigate('/fornecedores');
                  }} 
                  onCancel={() => {
                    navigate('/fornecedores');
                  }} 
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/nao-conformidades/nova"
          element={
            user ? (
              <Layout>
                <NaoConformidadeForm 
                  onSubmit={() => {
                    toast.success('Não conformidade criada com sucesso!');
                    navigate('/nao-conformidades');
                  }} 
                  onCancel={() => {
                    navigate('/nao-conformidades');
                  }} 
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/rfis/novo"
          element={
            user ? (
              <Layout>
                <RFIForm 
                  onSubmit={() => {
                    toast.success('RFI criado com sucesso!');
                    navigate('/rfis');
                  }} 
                  onCancel={() => {
                    navigate('/rfis');
                  }} 
                />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
