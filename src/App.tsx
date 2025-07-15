import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./lib/auth";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Ensaios from "./pages/Ensaios";
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
import ChecklistForm from "./components/forms/ChecklistForm";
import ObraForm from "./components/forms/ObraForm";
import RFIs from "./pages/RFIs";
import "./styles/globals.css";

function App() {
  const { user, loading } = useAuthStore();

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

        {/* Rotas para ações rápidas */}
        <Route
          path="/documentos/novo"
          element={
            user ? (
              <Layout>
                <DocumentoForm
                  isEditing={false}
                  onSubmit={() => {}}
                  onCancel={() => {}}
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
                  isEditing={false}
                  onSubmit={() => {}}
                  onCancel={() => {}}
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
                <ChecklistForm onSubmit={() => {}} onCancel={() => {}} />
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
                <ObraForm onSubmit={() => {}} onCancel={() => {}} />
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
