const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Usar a mesma configuração do projeto
const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createCertificadosTables() {
  try {
    console.log('🚀 Criando tabelas de Certificados...');
    
    // Comandos SQL básicos para criar as tabelas principais
    const createTablesSQL = `
      -- Criar extensão UUID se não existir
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      -- Tabela certificados
      CREATE TABLE IF NOT EXISTS certificados (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo VARCHAR(100) UNIQUE NOT NULL,
        titulo VARCHAR(500) NOT NULL,
        descricao TEXT,
        tipo_certificado VARCHAR(50) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        escopo TEXT NOT NULL,
        entidade_certificadora VARCHAR(200) NOT NULL,
        data_emissao DATE NOT NULL,
        data_validade DATE NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'ativo',
        responsavel_nome VARCHAR(200) NOT NULL,
        documentos_anexos JSONB DEFAULT '[]',
        observacoes TEXT,
        user_id UUID NOT NULL,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Tabela registos
      CREATE TABLE IF NOT EXISTS registos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo VARCHAR(100) UNIQUE NOT NULL,
        titulo VARCHAR(500) NOT NULL,
        descricao TEXT,
        tipo_registo VARCHAR(50) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        entidade_registadora VARCHAR(200) NOT NULL,
        data_registo DATE NOT NULL,
        data_validade DATE,
        status VARCHAR(30) NOT NULL DEFAULT 'ativo',
        responsavel_nome VARCHAR(200) NOT NULL,
        documentos_anexos JSONB DEFAULT '[]',
        observacoes TEXT,
        user_id UUID NOT NULL,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Tabela termos_condicoes
      CREATE TABLE IF NOT EXISTS termos_condicoes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo VARCHAR(100) UNIQUE NOT NULL,
        titulo VARCHAR(500) NOT NULL,
        descricao TEXT,
        versao VARCHAR(20) NOT NULL,
        data_aprovacao DATE,
        status VARCHAR(30) NOT NULL DEFAULT 'ativo',
        conteudo TEXT NOT NULL,
        responsavel_nome VARCHAR(200) NOT NULL,
        documentos_anexos JSONB DEFAULT '[]',
        observacoes TEXT,
        user_id UUID NOT NULL,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Tabela relatorios
      CREATE TABLE IF NOT EXISTS relatorios (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo VARCHAR(100) UNIQUE NOT NULL,
        titulo VARCHAR(500) NOT NULL,
        descricao TEXT,
        tipo_relatorio VARCHAR(50) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        data_geracao DATE NOT NULL,
        periodo_inicio DATE,
        periodo_fim DATE,
        status VARCHAR(30) NOT NULL DEFAULT 'rascunho',
        responsavel_nome VARCHAR(200) NOT NULL,
        conteudo JSONB DEFAULT '{}',
        documentos_anexos JSONB DEFAULT '[]',
        observacoes TEXT,
        user_id UUID NOT NULL,
        criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    console.log('📄 Executando comandos SQL...');
    
    // Tentar executar via RPC se disponível
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
      if (error) {
        console.log('⚠️  RPC exec_sql não disponível, tentando inserção direta...');
      } else {
        console.log('✅ Tabelas criadas via RPC');
      }
    } catch (e) {
      console.log('⚠️  RPC não disponível, continuando...');
    }
    
    // Verificar se as tabelas existem tentando fazer uma consulta
    console.log('🔍 Verificando tabelas...');
    
    const tables = ['certificados', 'registos', 'termos_condicoes', 'relatorios'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Tabela ${table}: ${error.message}`);
        } else {
          console.log(`✅ Tabela ${table}: OK`);
        }
      } catch (e) {
        console.log(`❌ Tabela ${table}: ${e.message}`);
      }
    }
    
    console.log('🎉 Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

createCertificadosTables();
