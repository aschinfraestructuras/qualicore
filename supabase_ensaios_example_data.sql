-- =====================================================
-- DADOS DE EXEMPLO DE ENSAIOS - QUALICORE
-- =====================================================

-- Inserir dados de exemplo de ensaios
INSERT INTO ensaios (codigo, tipo, data_ensaio, laboratorio, responsavel, valor_esperado, valor_obtido, unidade, conforme, estado, zona, observacoes, resultado) VALUES

-- ENSAIOS DE BETÃO
('EN-2024-001', 'Ensaio de Resistência à Compressão - EN 12390-3', '2024-01-15', 'Laboratório Central', 'Eng. Silva', 25.0, 27.5, 'MPa', true, 'aprovado', 'Zona A - Fundações', 'Betão C25/30 - Conforme EN 206-1', '27.5 MPa'),
('EN-2024-002', 'Ensaio de Resistência à Compressão - EN 12390-3', '2024-01-16', 'Laboratório Central', 'Eng. Silva', 30.0, 32.1, 'MPa', true, 'aprovado', 'Zona B - Pilares', 'Betão C30/37 - Conforme EN 206-1', '32.1 MPa'),
('EN-2024-003', 'Ensaio de Resistência à Flexão - EN 12390-5', '2024-01-17', 'Laboratório Central', 'Eng. Santos', 4.5, 4.8, 'MPa', true, 'aprovado', 'Zona C - Lajes', 'Betão C25/30 - Conforme EN 12390-5', '4.8 MPa'),
('EN-2024-004', 'Ensaio de Densidade - EN 12390-7', '2024-01-18', 'Laboratório Central', 'Téc. Costa', 2300, 2320, 'kg/m³', true, 'aprovado', 'Zona A - Fundações', 'Betão C25/30 - Conforme EN 12390-7', '2320 kg/m³'),
('EN-2024-005', 'Ensaio de Resistência à Compressão - EN 12390-3', '2024-01-19', 'Laboratório Central', 'Eng. Silva', 25.0, 23.2, 'MPa', false, 'reprovado', 'Zona D - Estrutura', 'Betão C25/30 - Abaixo do especificado', '23.2 MPa'),

-- ENSAIOS DE AGREGADOS
('EN-2024-006', 'Ensaio de Granulometria - EN 933-1', '2024-01-20', 'Laboratório de Obra', 'Téc. Santos', 100.0, 98.5, '%', true, 'aprovado', 'Zona B - Pilares', 'Agregado 0/20 - Conforme EN 933-1', '98.5%'),
('EN-2024-007', 'Ensaio de Granulometria - EN 933-1', '2024-01-21', 'Laboratório de Obra', 'Téc. Santos', 100.0, 99.2, '%', true, 'aprovado', 'Zona C - Lajes', 'Agregado 0/31.5 - Conforme EN 933-1', '99.2%'),
('EN-2024-008', 'Ensaio de Forma dos Grãos - EN 933-3', '2024-01-22', 'Laboratório de Obra', 'Téc. Costa', 35.0, 32.0, '%', true, 'aprovado', 'Zona A - Fundações', 'Agregado 4/20 - Conforme EN 933-3', '32%'),
('EN-2024-009', 'Ensaio de Partículas Finas - EN 933-5', '2024-01-23', 'Laboratório de Obra', 'Téc. Santos', 3.0, 2.8, '%', true, 'aprovado', 'Zona B - Pilares', 'Agregado 0/20 - Conforme EN 933-5', '2.8%'),
('EN-2024-010', 'Ensaio de Granulometria - EN 933-1', '2024-01-24', 'Laboratório de Obra', 'Téc. Costa', 100.0, 95.2, '%', false, 'reprovado', 'Zona D - Estrutura', 'Agregado 0/20 - Fora da especificação', '95.2%'),

-- ENSAIOS DE SOLOS
('EN-2024-011', 'Ensaio de Limites de Atterberg - EN ISO 17892-12', '2024-01-25', 'Laboratório Externo - LNEC', 'Dr. Costa', 35.0, 32.0, '%', true, 'aprovado', 'Zona A - Fundações', 'Solo argiloso - Conforme EN ISO 17892-12', '32%'),
('EN-2024-012', 'Ensaio de Granulometria - EN ISO 17892-4', '2024-01-26', 'Laboratório Externo - LNEC', 'Dr. Costa', 100.0, 97.8, '%', true, 'aprovado', 'Zona B - Pilares', 'Solo arenoso - Conforme EN ISO 17892-4', '97.8%'),
('EN-2024-013', 'Ensaio de Teor em Água - EN ISO 17892-1', '2024-01-27', 'Laboratório Externo - LNEC', 'Dr. Silva', 15.0, 14.2, '%', true, 'aprovado', 'Zona C - Lajes', 'Solo argiloso - Conforme EN ISO 17892-1', '14.2%'),
('EN-2024-014', 'Ensaio de Cisalhamento Direto - EN ISO 17892-5', '2024-01-28', 'Laboratório Externo - LNEC', 'Dr. Costa', 25.0, 23.5, 'kPa', true, 'aprovado', 'Zona A - Fundações', 'Solo argiloso - Conforme EN ISO 17892-5', '23.5 kPa'),
('EN-2024-015', 'Ensaio de Permeabilidade - EN ISO 17892-11', '2024-01-29', 'Laboratório Externo - LNEC', 'Dr. Silva', 1.0E-6, 1.2E-6, 'm/s', true, 'aprovado', 'Zona B - Pilares', 'Solo argiloso - Conforme EN ISO 17892-11', '1.2E-6 m/s'),

-- ENSAIOS DE AÇOS
('EN-2024-016', 'Ensaio de Tração - EN 10025-1', '2024-01-30', 'Laboratório Externo - IST', 'Prof. Martins', 355.0, 365.0, 'MPa', true, 'aprovado', 'Zona C - Lajes', 'Aço S355 - Conforme EN 10025-1', '365 MPa'),
('EN-2024-017', 'Ensaio de Tração - EN 10025-1', '2024-01-31', 'Laboratório Externo - IST', 'Prof. Martins', 355.0, 340.0, 'MPa', false, 'reprovado', 'Zona D - Estrutura', 'Aço S355 - Abaixo do especificado', '340 MPa'),
('EN-2024-018', 'Ensaio de Impacto - EN 10025-1', '2024-02-01', 'Laboratório Externo - IST', 'Prof. Santos', 27.0, 29.5, 'J', true, 'aprovado', 'Zona A - Fundações', 'Aço S355 - Conforme EN 10025-1', '29.5 J'),
('EN-2024-019', 'Ensaio de Dureza - EN 10025-1', '2024-02-02', 'Laboratório Externo - IST', 'Prof. Martins', 180.0, 175.0, 'HB', true, 'aprovado', 'Zona B - Pilares', 'Aço S355 - Conforme EN 10025-1', '175 HB'),
('EN-2024-020', 'Ensaio de Tração - EN 10025-1', '2024-02-03', 'Laboratório Externo - IST', 'Prof. Santos', 355.0, 370.0, 'MPa', true, 'aprovado', 'Zona C - Lajes', 'Aço S355 - Conforme EN 10025-1', '370 MPa'),

-- ENSAIOS DE OBRA IN SITU
('EN-2024-021', 'Ensaio de Resistência à Compressão In Situ - EN 12504-1', '2024-02-04', 'Laboratório de Obra', 'Eng. Silva', 25.0, 26.8, 'MPa', true, 'aprovado', 'Zona A - Fundações', 'Betão C25/30 - Conforme EN 12504-1', '26.8 MPa'),
('EN-2024-022', 'Ensaio Ultrassónico - EN 12504-2', '2024-02-05', 'Laboratório de Obra', 'Eng. Santos', 4500, 4650, 'm/s', true, 'aprovado', 'Zona B - Pilares', 'Betão C30/37 - Conforme EN 12504-2', '4650 m/s'),
('EN-2024-023', 'Ensaio de Tração por Fendilhamento - EN 12504-3', '2024-02-06', 'Laboratório de Obra', 'Eng. Costa', 2.5, 2.3, 'MPa', true, 'aprovado', 'Zona C - Lajes', 'Betão C25/30 - Conforme EN 12504-3', '2.3 MPa'),
('EN-2024-024', 'Ensaio de Resistência à Compressão In Situ - EN 12504-1', '2024-02-07', 'Laboratório de Obra', 'Eng. Silva', 30.0, 28.5, 'MPa', false, 'reprovado', 'Zona D - Estrutura', 'Betão C30/37 - Abaixo do especificado', '28.5 MPa'),
('EN-2024-025', 'Ensaio Ultrassónico - EN 12504-2', '2024-02-08', 'Laboratório de Obra', 'Eng. Santos', 4500, 4200, 'm/s', false, 'reprovado', 'Zona A - Fundações', 'Betão C30/37 - Abaixo do especificado', '4200 m/s'),

-- ENSAIOS DE MADEIRAS
('EN-2024-026', 'Ensaio de Resistência à Compressão - EN 408', '2024-02-09', 'Laboratório Externo - FEUP', 'Prof. Oliveira', 24.0, 25.5, 'MPa', true, 'aprovado', 'Zona B - Pilares', 'Madeira C24 - Conforme EN 408', '25.5 MPa'),
('EN-2024-027', 'Ensaio de Resistência à Tração - EN 408', '2024-02-10', 'Laboratório Externo - FEUP', 'Prof. Oliveira', 14.0, 15.2, 'MPa', true, 'aprovado', 'Zona C - Lajes', 'Madeira C24 - Conforme EN 408', '15.2 MPa'),
('EN-2024-028', 'Ensaio de Resistência à Flexão - EN 408', '2024-02-11', 'Laboratório Externo - FEUP', 'Prof. Santos', 24.0, 22.8, 'MPa', true, 'aprovado', 'Zona A - Fundações', 'Madeira C24 - Conforme EN 408', '22.8 MPa'),
('EN-2024-029', 'Ensaio de Resistência à Compressão - EN 408', '2024-02-12', 'Laboratório Externo - FEUP', 'Prof. Oliveira', 24.0, 20.5, 'MPa', false, 'reprovado', 'Zona D - Estrutura', 'Madeira C24 - Abaixo do especificado', '20.5 MPa'),
('EN-2024-030', 'Ensaio de Resistência à Tração - EN 408', '2024-02-13', 'Laboratório Externo - FEUP', 'Prof. Santos', 14.0, 16.8, 'MPa', true, 'aprovado', 'Zona B - Pilares', 'Madeira C24 - Conforme EN 408', '16.8 MPa'),

-- ENSAIOS PENDENTES
('EN-2024-031', 'Ensaio de Resistência à Compressão - EN 12390-3', '2024-02-14', 'Laboratório Central', 'Eng. Silva', 25.0, NULL, 'MPa', NULL, 'pendente', 'Zona A - Fundações', 'Betão C25/30 - Aguardando resultados', 'Pendente'),
('EN-2024-032', 'Ensaio de Granulometria - EN 933-1', '2024-02-15', 'Laboratório de Obra', 'Téc. Santos', 100.0, NULL, '%', NULL, 'pendente', 'Zona B - Pilares', 'Agregado 0/20 - Aguardando resultados', 'Pendente'),
('EN-2024-033', 'Ensaio de Limites de Atterberg - EN ISO 17892-12', '2024-02-16', 'Laboratório Externo - LNEC', 'Dr. Costa', 35.0, NULL, '%', NULL, 'pendente', 'Zona C - Lajes', 'Solo argiloso - Aguardando resultados', 'Pendente'),
('EN-2024-034', 'Ensaio de Tração - EN 10025-1', '2024-02-17', 'Laboratório Externo - IST', 'Prof. Martins', 355.0, NULL, 'MPa', NULL, 'pendente', 'Zona D - Estrutura', 'Aço S355 - Aguardando resultados', 'Pendente'),
('EN-2024-035', 'Ensaio de Resistência à Compressão In Situ - EN 12504-1', '2024-02-18', 'Laboratório de Obra', 'Eng. Silva', 25.0, NULL, 'MPa', NULL, 'pendente', 'Zona A - Fundações', 'Betão C25/30 - Aguardando resultados', 'Pendente');

-- =====================================================
-- FIM DOS DADOS DE EXEMPLO
-- =====================================================
