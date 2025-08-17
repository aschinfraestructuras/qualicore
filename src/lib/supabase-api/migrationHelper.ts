import { viaFerreaAPI, Trilho, Travessa, Inspecao } from './viaFerreaAPI';

// =====================================================
// HELPER PARA MIGRAÇÃO DE DADOS MOCK PARA SUPABASE
// =====================================================

export interface MigrationResult {
  success: boolean;
  message: string;
  details?: {
    trilhos?: { created: number; errors: string[] };
    travessas?: { created: number; errors: string[] };
    inspecoes?: { created: number; errors: string[] };
  };
}

export class MigrationHelper {
  // =====================================================
  // MIGRAÇÃO COMPLETA
  // =====================================================

  static async migrateAllData(
    trilhosMock: Trilho[],
    travessasMock: Travessa[],
    inspecoesMock: Inspecao[]
  ): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      message: 'Migração iniciada com sucesso',
      details: {
        trilhos: { created: 0, errors: [] },
        travessas: { created: 0, errors: [] },
        inspecoes: { created: 0, errors: [] }
      }
    };

    try {
      console.log('🚀 Iniciando migração de dados para Supabase...');

      // 1. Migrar trilhos
      const trilhosResult = await this.migrateTrilhos(trilhosMock);
      result.details!.trilhos = trilhosResult;

      // 2. Migrar travessas
      const travessasResult = await this.migrateTravessas(travessasMock);
      result.details!.travessas = travessasResult;

      // 3. Migrar inspeções (após trilhos e travessas)
      const inspecoesResult = await this.migrateInspecoes(inspecoesMock);
      result.details!.inspecoes = inspecoesResult;

      // Verificar se houve erros
      const totalErrors = 
        (result.details!.trilhos?.errors.length || 0) +
        (result.details!.travessas?.errors.length || 0) +
        (result.details!.inspecoes?.errors.length || 0);

      if (totalErrors > 0) {
        result.success = false;
        result.message = `Migração concluída com ${totalErrors} erro(s)`;
      } else {
        result.message = 'Migração concluída com sucesso!';
      }

      console.log('✅ Migração concluída:', result);
      return result;

    } catch (error) {
      console.error('❌ Erro durante migração:', error);
      return {
        success: false,
        message: `Erro durante migração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        details: result.details
      };
    }
  }

  // =====================================================
  // MIGRAÇÃO DE TRILHOS
  // =====================================================

  static async migrateTrilhos(trilhosMock: Trilho[]): Promise<{ created: number; errors: string[] }> {
    const result = { created: 0, errors: [] as string[] };

    console.log(`📊 Migrando ${trilhosMock.length} trilhos...`);

    for (const trilhoMock of trilhosMock) {
      try {
        // Verificar se já existe
        const existing = await viaFerreaAPI.trilhos.getByCodigo(trilhoMock.codigo);
        if (existing) {
          console.log(`⚠️ Trilho ${trilhoMock.codigo} já existe, pulando...`);
          continue;
        }

        // Preparar dados para inserção
        const trilhoData = {
          codigo: trilhoMock.codigo,
          tipo: trilhoMock.tipo,
          material: trilhoMock.material,
          comprimento: trilhoMock.comprimento,
          peso: trilhoMock.peso,
          fabricante: trilhoMock.fabricante,
          data_fabricacao: trilhoMock.data_fabricacao,
          data_instalacao: trilhoMock.data_instalacao,
          km_inicial: trilhoMock.km_inicial,
          km_final: trilhoMock.km_final,
          estado: trilhoMock.estado,
          tensao: trilhoMock.tensao,
          alinhamento: trilhoMock.alinhamento,
          nivel: trilhoMock.nivel,
          bitola: trilhoMock.bitola,
          ultima_inspecao: trilhoMock.ultima_inspecao,
          proxima_inspecao: trilhoMock.proxima_inspecao,
          observacoes: trilhoMock.observacoes
        };

        await viaFerreaAPI.trilhos.create(trilhoData);
        result.created++;
        console.log(`✅ Trilho ${trilhoMock.codigo} migrado com sucesso`);

      } catch (error) {
        const errorMsg = `Erro ao migrar trilho ${trilhoMock.codigo}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
        result.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    console.log(`📊 Trilhos migrados: ${result.created}/${trilhosMock.length}`);
    return result;
  }

  // =====================================================
  // MIGRAÇÃO DE TRAVESSAS
  // =====================================================

  static async migrateTravessas(travessasMock: Travessa[]): Promise<{ created: number; errors: string[] }> {
    const result = { created: 0, errors: [] as string[] };

    console.log(`📊 Migrando ${travessasMock.length} travessas...`);

    for (const travessaMock of travessasMock) {
      try {
        // Verificar se já existe
        const existing = await viaFerreaAPI.travessas.getByCodigo(travessaMock.codigo);
        if (existing) {
          console.log(`⚠️ Travessa ${travessaMock.codigo} já existe, pulando...`);
          continue;
        }

        // Preparar dados para inserção
        const travessaData = {
          codigo: travessaMock.codigo,
          tipo: travessaMock.tipo,
          material: travessaMock.material,
          comprimento: travessaMock.comprimento,
          largura: travessaMock.largura,
          altura: travessaMock.altura,
          peso: travessaMock.peso,
          fabricante: travessaMock.fabricante,
          data_fabricacao: travessaMock.data_fabricacao,
          data_instalacao: travessaMock.data_instalacao,
          km_inicial: travessaMock.km_inicial,
          km_final: travessaMock.km_final,
          estado: travessaMock.estado,
          ultima_inspecao: travessaMock.ultima_inspecao,
          proxima_inspecao: travessaMock.proxima_inspecao,
          observacoes: travessaMock.observacoes
        };

        await viaFerreaAPI.travessas.create(travessaData);
        result.created++;
        console.log(`✅ Travessa ${travessaMock.codigo} migrada com sucesso`);

      } catch (error) {
        const errorMsg = `Erro ao migrar travessa ${travessaMock.codigo}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
        result.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    console.log(`📊 Travessas migradas: ${result.created}/${travessasMock.length}`);
    return result;
  }

  // =====================================================
  // MIGRAÇÃO DE INSPEÇÕES
  // =====================================================

  static async migrateInspecoes(inspecoesMock: Inspecao[]): Promise<{ created: number; errors: string[] }> {
    const result = { created: 0, errors: [] as string[] };

    console.log(`📊 Migrando ${inspecoesMock.length} inspeções...`);

    for (const inspecaoMock of inspecoesMock) {
      try {
        // Verificar se o trilho ou travessa referenciado existe
        let trilhoId: string | undefined;
        let travessaId: string | undefined;

        if (inspecaoMock.trilho_id) {
          const trilho = await viaFerreaAPI.trilhos.getById(inspecaoMock.trilho_id);
          if (!trilho) {
            throw new Error(`Trilho com ID ${inspecaoMock.trilho_id} não encontrado`);
          }
          trilhoId = trilho.id;
        }

        if (inspecaoMock.travessa_id) {
          const travessa = await viaFerreaAPI.travessas.getById(inspecaoMock.travessa_id);
          if (!travessa) {
            throw new Error(`Travessa com ID ${inspecaoMock.travessa_id} não encontrada`);
          }
          travessaId = travessa.id;
        }

        // Preparar dados para inserção
        const inspecaoData = {
          trilho_id: trilhoId,
          travessa_id: travessaId,
          data_inspecao: inspecaoMock.data_inspecao,
          tipo: inspecaoMock.tipo,
          inspector: inspecaoMock.inspector,
          resultado: inspecaoMock.resultado,
          observacoes: inspecaoMock.observacoes,
          acoes_corretivas: inspecaoMock.acoes_corretivas,
          proxima_inspecao: inspecaoMock.proxima_inspecao,
          fotos: inspecaoMock.fotos,
          relatorio_url: inspecaoMock.relatorio_url,
          parametros_medidos: inspecaoMock.parametros_medidos
        };

        await viaFerreaAPI.inspecoes.create(inspecaoData);
        result.created++;
        console.log(`✅ Inspeção ${inspecaoMock.id} migrada com sucesso`);

      } catch (error) {
        const errorMsg = `Erro ao migrar inspeção ${inspecaoMock.id}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
        result.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    console.log(`📊 Inspeções migradas: ${result.created}/${inspecoesMock.length}`);
    return result;
  }

  // =====================================================
  // VALIDAÇÃO DE DADOS
  // =====================================================

  static validateTrilho(trilho: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!trilho.codigo) errors.push('Código é obrigatório');
    if (!trilho.tipo) errors.push('Tipo é obrigatório');
    if (!trilho.material) errors.push('Material é obrigatório');
    if (!trilho.comprimento || trilho.comprimento <= 0) errors.push('Comprimento deve ser maior que 0');
    if (!trilho.peso || trilho.peso <= 0) errors.push('Peso deve ser maior que 0');
    if (!trilho.fabricante) errors.push('Fabricante é obrigatório');
    if (!trilho.data_fabricacao) errors.push('Data de fabricação é obrigatória');
    if (!trilho.data_instalacao) errors.push('Data de instalação é obrigatória');
    if (!trilho.km_inicial || trilho.km_inicial < 0) errors.push('KM inicial deve ser >= 0');
    if (!trilho.km_final || trilho.km_final <= trilho.km_inicial) errors.push('KM final deve ser > KM inicial');
    if (!trilho.estado) errors.push('Estado é obrigatório');
    if (!trilho.tensao || trilho.tensao <= 0) errors.push('Tensão deve ser maior que 0');

    return { valid: errors.length === 0, errors };
  }

  static validateTravessa(travessa: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!travessa.codigo) errors.push('Código é obrigatório');
    if (!travessa.tipo) errors.push('Tipo é obrigatório');
    if (!travessa.material) errors.push('Material é obrigatório');
    if (!travessa.comprimento || travessa.comprimento <= 0) errors.push('Comprimento deve ser maior que 0');
    if (!travessa.largura || travessa.largura <= 0) errors.push('Largura deve ser maior que 0');
    if (!travessa.altura || travessa.altura <= 0) errors.push('Altura deve ser maior que 0');
    if (!travessa.peso || travessa.peso <= 0) errors.push('Peso deve ser maior que 0');
    if (!travessa.fabricante) errors.push('Fabricante é obrigatório');
    if (!travessa.data_fabricacao) errors.push('Data de fabricação é obrigatória');
    if (!travessa.data_instalacao) errors.push('Data de instalação é obrigatória');
    if (!travessa.km_inicial || travessa.km_inicial < 0) errors.push('KM inicial deve ser >= 0');
    if (!travessa.km_final || travessa.km_final <= travessa.km_inicial) errors.push('KM final deve ser > KM inicial');
    if (!travessa.estado) errors.push('Estado é obrigatório');

    return { valid: errors.length === 0, errors };
  }

  static validateInspecao(inspecao: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!inspecao.data_inspecao) errors.push('Data de inspeção é obrigatória');
    if (!inspecao.tipo) errors.push('Tipo é obrigatório');
    if (!inspecao.inspector) errors.push('Inspector é obrigatório');
    if (!inspecao.resultado) errors.push('Resultado é obrigatório');
    if (!inspecao.trilho_id && !inspecao.travessa_id) errors.push('Deve referenciar um trilho ou travessa');

    return { valid: errors.length === 0, errors };
  }

  // =====================================================
  // LIMPEZA DE DADOS
  // =====================================================

  static async clearAllData(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧹 Limpando todos os dados...');

      // Deletar inspeções primeiro (devido às foreign keys)
      const { data: inspecoes } = await viaFerreaAPI.inspecoes.getAll();
      for (const inspecao of inspecoes) {
        await viaFerreaAPI.inspecoes.delete(inspecao.id);
      }

      // Deletar trilhos
      const { data: trilhos } = await viaFerreaAPI.trilhos.getAll();
      for (const trilho of trilhos) {
        await viaFerreaAPI.trilhos.delete(trilho.id);
      }

      // Deletar travessas
      const { data: travessas } = await viaFerreaAPI.travessas.getAll();
      for (const travessa of travessas) {
        await viaFerreaAPI.travessas.delete(travessa.id);
      }

      console.log('✅ Todos os dados foram limpos');
      return { success: true, message: 'Todos os dados foram limpos com sucesso' };

    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
      return { 
        success: false, 
        message: `Erro ao limpar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      };
    }
  }

  // =====================================================
  // VERIFICAÇÃO DE CONEXÃO
  // =====================================================

  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔍 Testando conexão com Supabase...');
      
      // Tentar buscar estatísticas
      await viaFerreaAPI.stats.getStats();
      
      console.log('✅ Conexão com Supabase estabelecida');
      return { success: true, message: 'Conexão com Supabase estabelecida com sucesso' };

    } catch (error) {
      console.error('❌ Erro na conexão com Supabase:', error);
      return { 
        success: false, 
        message: `Erro na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      };
    }
  }
}

export default MigrationHelper;
