import React, { useState, useEffect } from 'react';
import { TestSuite } from '../lib/test-suite';
import { Play, CheckCircle, XCircle, RefreshCw, Activity } from 'lucide-react';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

export const TestDashboard: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const testResults = await TestSuite.runAllTests();
      setResults(testResults.results);
      setLastRun(new Date());
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Executar testes automaticamente ao carregar
    runTests();
  }, []);

  const passedTests = results.filter(r => r.status === 'PASS').length;
  const totalTests = results.length;
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🧪 Testes do Sistema</h2>
          <p className="text-gray-600">Monitorização da saúde do Qualicore</p>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isRunning ? 'Executando...' : 'Executar Testes'}
        </button>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Testes Passaram</p>
              <p className="text-2xl font-bold text-green-700">{passedTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-red-600 font-medium">Testes Falharam</p>
              <p className="text-2xl font-bold text-red-700">{totalTests - passedTests}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Taxa de Sucesso</p>
              <p className="text-2xl font-bold text-blue-700">{successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados Detalhados */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Resultados Detalhados</h3>
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.status === 'PASS'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {result.status === 'PASS' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mr-3" />
                )}
                <div>
                  <p className="font-medium text-gray-800">{result.test}</p>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  result.status === 'PASS'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {result.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Última Execução */}
      {lastRun && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Última execução: {lastRun.toLocaleString('pt-BR')}
          </p>
        </div>
      )}

      {/* Recomendações */}
      {totalTests > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">💡 Recomendações</h4>
          {successRate === 100 ? (
            <p className="text-yellow-700">
              🎉 Excelente! Todos os testes passaram. O sistema está funcionando perfeitamente.
            </p>
          ) : successRate >= 80 ? (
            <p className="text-yellow-700">
              ⚠️ Bom desempenho, mas alguns testes falharam. Verifique os detalhes acima.
            </p>
          ) : (
            <p className="text-yellow-700">
              🔴 Atenção! Muitos testes falharam. O sistema pode ter problemas críticos.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
