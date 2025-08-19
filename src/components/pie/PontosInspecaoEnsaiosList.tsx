import React from "react";
import { useNavigate } from "react-router-dom";

export default function PontosInspecaoEnsaiosList() {
  const navigate = useNavigate();
  // Mock de dados por enquanto
  const planos = [
    { id: 1, nome: "Estrutura - Fundação", categoria: "CCG", status: "Ativo" },
    { id: 2, nome: "Concreto - Laje", categoria: "CCE", status: "Inativo" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-600 text-sm">
            <th className="py-2 px-4">Nome</th>
            <th className="py-2 px-4">Categoria</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {planos.map((plano) => (
            <tr key={plano.id} className="border-t">
              <td className="py-2 px-4 font-medium">{plano.nome}</td>
              <td className="py-2 px-4">{plano.categoria}</td>
              <td className="py-2 px-4">{plano.status}</td>
              <td className="py-2 px-4">
                <button
                  className="text-primary-600 hover:underline mr-2"
                  onClick={() => navigate(`/pontos-inspecao-ensaios/${plano.id}`)}
                >
                  Editar
                </button>
                <button className="text-red-600 hover:underline">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
