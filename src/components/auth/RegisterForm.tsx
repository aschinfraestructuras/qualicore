import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";

const registerSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    passwordConfirm: z.string(),
    perfil: z.enum(["qualidade", "producao", "fiscal"]),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Senhas não coincidem",
    path: ["passwordConfirm"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      perfil: "qualidade",
    },
  });

  const onSubmit = async (data: any) => {
    // Garantir que todos os campos obrigatórios estão definidos
    if (
      !data.email ||
      !data.password ||
      !data.nome ||
      !data.perfil ||
      !data.passwordConfirm
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await signUp(data.email, data.password);
      if (result.success) {
        toast.success("Conta criada com sucesso!");
        onSuccess();
      } else {
        toast.error(result.error || "Erro no registro");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro no registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 font-display mb-2">
          Criar Conta
        </h2>
        <p className="text-gray-600">Registe-se para aceder ao sistema</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome */}
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...register("nome")}
              type="text"
              id="nome"
              className="input pl-10 w-full"
              placeholder="Seu nome completo"
              disabled={isLoading}
            />
          </div>
          {errors.nome && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm text-red-600 mt-1"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.nome.message}
            </motion.p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              id="email"
              className="input pl-10 w-full"
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm text-red-600 mt-1"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Perfil */}
        <div>
          <label
            htmlFor="perfil"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Perfil
          </label>
          <select
            {...register("perfil")}
            id="perfil"
            className="select w-full"
            disabled={isLoading}
          >
            <option value="qualidade">Engenheiro de Qualidade</option>
            <option value="producao">Responsável de Produção</option>
            <option value="fiscal">Fiscal de Obra</option>
          </select>
          {errors.perfil && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm text-red-600 mt-1"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.perfil.message}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              className="input pl-10 pr-10 w-full"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm text-red-600 mt-1"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Password Confirm */}
        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirmar Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              {...register("passwordConfirm")}
              type={showPasswordConfirm ? "text" : "password"}
              id="passwordConfirm"
              className="input pl-10 pr-10 w-full"
              placeholder="••••••••"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPasswordConfirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.passwordConfirm && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-sm text-red-600 mt-1"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.passwordConfirm.message}
            </motion.p>
          )}
        </div>

        {/* Error geral */}
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            {errors.root.message}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Criar Conta"
          )}
        </button>

        {/* Link para login */}
        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            disabled={isLoading}
          >
            Já tem uma conta? Entrar
          </button>
        </div>
      </form>
    </motion.div>
  );
}
