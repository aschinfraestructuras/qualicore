import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/auth";
import { User } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  fallbackPath = "/login",
}: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = useAuthStore.getState().user as User | null;
        if (currentUser) {
          setUser(currentUser);

          // Configurar permissões baseadas no perfil do utilizador
          // Remover esta linha:
          // if (currentUser) {
          //   const userPermissions = {
          //     userId: currentUser.id,
          //     roles: [currentUser.perfil], // Usar perfil como role
          //     customPermissions: []
          //   }
          //   permissionManager.setUserPermissions(userPermissions)
          // }

          // Verificar permissões se especificadas
          if (requiredPermission) {
            // Remover esta linha:
            // const hasRequiredPermission = permissionManager.hasPermission(requiredPermission)
            // setHasPermission(hasRequiredPermission)
            setHasPermission(true); // Sem permissão específica requerida
          } else {
            setHasPermission(true); // Sem permissão específica requerida
          }
        } else {
          setUser(null);
          setHasPermission(false);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setUser(null);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listener para mudanças de autenticação (not implemented)
    // const unsubscribe = authService.onAuthChange((user) => {
    //   setUser(user)
    //   if (user && requiredPermission) {
    //     setHasPermission(authService.hasPermission(requiredPermission))
    //   } else {
    //     setHasPermission(!!user)
    //   }
    //   setIsLoading(false)
    // })

    // return unsubscribe
  }, [requiredPermission]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">
            Verificando autenticação...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Negado
          </h1>
          <p className="text-gray-600 mb-6">
            Não tem permissão para aceder a esta página. Contacte o
            administrador se acredita que isto é um erro.
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-xl border border-red-200">
              <p className="text-sm text-gray-600">
                <strong>Utilizador:</strong> {user.nome}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Perfil:</strong> {user.perfil}
              </p>
              {requiredPermission && (
                <p className="text-sm text-gray-600">
                  <strong>Permissão necessária:</strong> {requiredPermission}
                </p>
              )}
            </div>
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary w-full"
            >
              Voltar
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
