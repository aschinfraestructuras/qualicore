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
import ModernLayout from "./components/ModernLayout";
import PremiumLayout from "./components/PremiumLayout";
import Dashboard from "./pages/Dashboard";
import Ensaios from "./pages/Ensaios";
import EnsaiosCompactacao from "./pages/EnsaiosCompactacao";
import Checklists from "./pages/Checklists";
import Materiais from "./pages/Materiais";
import Fornecedores from "./pages/Fornecedores";
import NaoConformidades from "./pages/NaoConformidades";
import Documentos from "./pages/Documentos";
import Relatorios from "./pages/Relatorios";
import ViaFerrea from "./pages/ViaFerrea";
import Sinalizacao from "./pages/Sinalizacao";
import Eletrificacao from "./pages/Eletrificacao";
import PontesTuneis from "./pages/PontesTuneis";
import Estacoes from "./pages/Estacoes";
import SegurancaFerroviaria from "./pages/SegurancaFerroviaria";
import ControloBetonagens from "./pages/ControloBetonagens";
import CaracterizacaoSolos from "./pages/CaracterizacaoSolos";
import Normas from "./pages/Normas";
import SubmissaoMateriais from "./pages/SubmissaoMateriais";
import Certificados from "./pages/Certificados";
import Obras from "./pages/Obras";
import Landing from "./pages/Landing";
import SupabaseTest from "./components/SupabaseTest";
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
import Armaduras from "./pages/Armaduras";
import "./styles/globals.css";
import { ensaioCompactacaoService } from "./services/ensaioCompactacaoService";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação ao carregar a app
    useAuthStore.getState().checkUser();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Inicializando Qualicore..." variant="logo" />;
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
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        <Route
          path="/ensaios"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Ensaios />} />
        </Route>

        <Route
          path="/ensaios-compactacao"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<EnsaiosCompactacao />} />
        </Route>

        <Route
          path="/checklists"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Checklists />} />
        </Route>

        <Route
          path="/materiais"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Materiais />} />
        </Route>

        <Route
          path="/fornecedores"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Fornecedores />} />
        </Route>

        <Route
          path="/nao-conformidades"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<NaoConformidades />} />
        </Route>

        <Route
          path="/documentos"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Documentos />} />
        </Route>

        <Route
          path="/relatorios"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Relatorios />} />
        </Route>

        <Route
          path="/via-ferrea"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<ViaFerrea />} />
        </Route>

        <Route
          path="/sinalizacao"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Sinalizacao />} />
        </Route>

        <Route
          path="/eletrificacao"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Eletrificacao />} />
        </Route>

                <Route
          path="/pontes-tuneis"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<PontesTuneis />} />
        </Route>

        <Route
          path="/estacoes"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Estacoes />} />
        </Route>

        <Route
          path="/seguranca-ferroviaria"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<SegurancaFerroviaria />} />
        </Route>

        <Route
          path="/controlo-betonagens"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<ControloBetonagens />} />
        </Route>

        <Route
          path="/caracterizacao-solos"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<CaracterizacaoSolos />} />
        </Route>

        <Route
          path="/normas"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Normas />} />
        </Route>

        <Route
          path="/submissao-materiais"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<SubmissaoMateriais />} />
        </Route>

        <Route
          path="/certificados"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Certificados />} />
        </Route>
        
        <Route
          path="/test-supabase"
          element={<SupabaseTest />}
        />

        <Route
          path="/obras"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Obras />} />
        </Route>

        <Route
          path="/rfis"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<RFIs />} />
        </Route>

        <Route
          path="/pie"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<PontosInspecaoEnsaiosPage />} />
        </Route>

        <Route
          path="/pie/editor"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<PontosInspecaoEnsaiosEditor />} />
        </Route>

        <Route
          path="/pie/editor/:id"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<PontosInspecaoEnsaiosEditor />} />
        </Route>

        <Route
          path="/pie/view/:id"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<PontosInspecaoEnsaiosEditor />} />
        </Route>

        <Route
          path="/armaduras"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Armaduras />} />
        </Route>

        {/* Rotas para ações rápidas */}
        <Route
          path="/documentos/novo"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
            <DocumentoForm
              onSubmit={() => {
                toast.success('Documento criado com sucesso!');
                navigate('/documentos');
              }}
              onCancel={() => {
                navigate('/documentos');
              }}
            />
          } />
        </Route>

        <Route
          path="/ensaios/novo"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
            <EnsaioForm
              onSubmit={() => {
                toast.success('Ensaio criado com sucesso!');
                navigate('/ensaios');
              }}
              onCancel={() => {
                navigate('/ensaios');
              }}
            />
          } />
        </Route>

        <Route
          path="/ensaios-compactacao/novo"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
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
          } />
        </Route>

        <Route
          path="/checklists/novo"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
            <ChecklistForm 
              onSubmit={() => {
                toast.success('Checklist criado com sucesso!');
                navigate('/checklists');
              }} 
              onCancel={() => {
                navigate('/checklists');
              }} 
            />
          } />
        </Route>

        <Route
          path="/obras/nova"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
            <ObraForm 
              onSubmit={() => {
                toast.success('Obra criada com sucesso!');
                navigate('/obras');
              }} 
              onCancel={() => {
                navigate('/obras');
              }} 
            />
          } />
        </Route>

        <Route
          path="/materiais/novo"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
            <MaterialForm 
              onSubmit={() => {
                toast.success('Material criado com sucesso!');
                navigate('/materiais');
              }} 
              onCancel={() => {
                navigate('/materiais');
              }} 
            />
          } />
        </Route>

        <Route
          path="/fornecedores/novo"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
            <FornecedorForm 
              onSubmit={() => {
                toast.success('Fornecedor criado com sucesso!');
                navigate('/fornecedores');
              }} 
              onCancel={() => {
                navigate('/fornecedores');
              }} 
            />
          } />
        </Route>

        <Route
          path="/nao-conformidades/nova"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
            <NaoConformidadeForm 
              onSubmit={() => {
                toast.success('Não conformidade criada com sucesso!');
                navigate('/nao-conformidades');
              }} 
              onCancel={() => {
                navigate('/nao-conformidades');
              }} 
            />
          } />
        </Route>

        <Route
          path="/rfis/novo"
          element={
            user ? (
              <PremiumLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={
            <RFIForm 
              onSubmit={() => {
                toast.success('RFI criado com sucesso!');
                navigate('/rfis');
              }} 
              onCancel={() => {
                navigate('/rfis');
              }} 
            />
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
