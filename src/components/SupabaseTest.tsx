import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader2, Database, TestTube } from 'lucide-react';
import { viaFerreaAPI } from '../lib/supabase-api/viaFerreaAPI';
import { testSupabaseConnection } from '../lib/supabase-api/supabaseClient';

interface TestResult {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function SupabaseTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    const testResults: TestResult[] = [];

    // Teste 1: Conexão básica
    testResults.push({
      name: 'Conexão Supabase',
      status: 'loading',
      message: 'Testando conexão...'
    });
    setTests([...testResults]);

    try {
      const connectionOk = await testSupabaseConnection();
      testResults[0] = {
        name: 'Conexão Supabase',
        status: connectionOk ? 'success' : 'error',
        message: connectionOk ? 'Conexão estabelecida com sucesso!' : 'Erro na conexão'
      };
      setTests([...testResults]);
    } catch (error) {
      testResults[0] = {
        name: 'Conexão Supabase',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
      setTests([...testResults]);
    }

    // Teste 2: Estatísticas
    testResults.push({
      name: 'Estatísticas Via Férrea',
      status: 'loading',
      message: 'Buscando estatísticas...'
    });
    setTests([...testResults]);

    try {
      const stats = await viaFerreaAPI.stats.getStats();
      testResults[1] = {
        name: 'Estatísticas Via Férrea',
        status: 'success',
        message: 'Estatísticas carregadas com sucesso!',
        data: stats
      };
      setTests([...testResults]);
    } catch (error) {
      testResults[1] = {
        name: 'Estatísticas Via Férrea',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
      setTests([...testResults]);
    }

    // Teste 3: Trilhos
    testResults.push({
      name: 'API Trilhos',
      status: 'loading',
      message: 'Testando API de trilhos...'
    });
    setTests([...testResults]);

    try {
      const trilhos = await viaFerreaAPI.trilhos.getAll();
      testResults[2] = {
        name: 'API Trilhos',
        status: 'success',
        message: `${trilhos.length} trilhos encontrados`,
        data: trilhos
      };
      setTests([...testResults]);
    } catch (error) {
      testResults[2] = {
        name: 'API Trilhos',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
      setTests([...testResults]);
    }

    // Teste 4: Travessas
    testResults.push({
      name: 'API Travessas',
      status: 'loading',
      message: 'Testando API de travessas...'
    });
    setTests([...testResults]);

    try {
      const travessas = await viaFerreaAPI.travessas.getAll();
      testResults[3] = {
        name: 'API Travessas',
        status: 'success',
        message: `${travessas.length} travessas encontradas`,
        data: travessas
      };
      setTests([...testResults]);
    } catch (error) {
      testResults[3] = {
        name: 'API Travessas',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
      setTests([...testResults]);
    }

    // Teste 5: Inspeções
    testResults.push({
      name: 'API Inspeções',
      status: 'loading',
      message: 'Testando API de inspeções...'
    });
    setTests([...testResults]);

    try {
      const inspecoes = await viaFerreaAPI.inspecoes.getAll();
      testResults[4] = {
        name: 'API Inspeções',
        status: 'success',
        message: `${inspecoes.length} inspeções encontradas`,
        data: inspecoes
      };
      setTests([...testResults]);
    } catch (error) {
      testResults[4] = {
        name: 'API Inspeções',
        status: 'error',
        message: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
      setTests([...testResults]);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)', padding: '24px' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ background: 'rgba(255, 255, 255, 0.9)', padding: '32px', borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Teste Supabase
                </h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <span>🧪</span>
                  <span>Verificação da implementação Via Férrea</span>
                </p>
              </div>
            </div>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TestTube className="h-5 w-5" />
              <span>{isRunning ? 'Executando...' : 'Executar Testes'}</span>
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={index}
              className={`glass-card p-6 rounded-xl border-2 ${getStatusColor(test.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-600">{test.message}</p>
                  </div>
                </div>
              </div>
              
              {/* Data Display */}
              {test.data && (
                <div className="mt-4 p-4 bg-white/50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Dados:</h4>
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(test.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {tests.length > 0 && !isRunning && (
          <div className="glass-card p-6 rounded-2xl mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo dos Testes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {tests.filter(t => t.status === 'success').length}
                </div>
                <div className="text-sm text-green-600">Sucessos</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {tests.filter(t => t.status === 'error').length}
                </div>
                <div className="text-sm text-red-600">Erros</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {tests.length}
                </div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
