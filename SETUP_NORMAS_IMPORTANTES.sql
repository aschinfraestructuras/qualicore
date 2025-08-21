-- Script para inserir 50 normas importantes de Portugal e Europa
-- Foco em IPQ, CEN, ISO, EN e outras entidades normativas relevantes
-- Usa ON CONFLICT DO NOTHING para evitar duplicados

-- Inserir normas IPQ (Instituto Português da Qualidade)
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('NP EN 1990', 'Eurocódigo - Bases para o dimensionamento das estruturas', 'Estabelece as bases para o dimensionamento e verificação das estruturas', 'Estruturas', 'IPQ', 'ATIVA', 'CRITICA', '1.0', '2020-01-15', '2030-01-15', 'Aplicável a todas as estruturas de construção civil', ARRAY['Edifícios', 'Pontes', 'Obras de arte'], ARRAY['Estados limites', 'Combinações de ações', 'Coeficientes de segurança'], ARRAY['Análise estrutural', 'Verificação de segurança'], ARRAY['Eurocódigo', 'Estruturas', 'Dimensionamento'], 'Norma fundamental para dimensionamento estrutural', NOW(), NOW()),

('NP EN 1991-1-1', 'Eurocódigo 1 - Ações em estruturas - Ações gerais', 'Define as ações permanentes e variáveis em estruturas', 'Estruturas', 'IPQ', 'ATIVA', 'ALTA', '1.0', '2020-01-15', '2030-01-15', 'Ações em estruturas de construção', ARRAY['Edifícios', 'Pontes', 'Estruturas especiais'], ARRAY['Peso próprio', 'Sobrecargas', 'Ações do vento'], ARRAY['Cálculo de ações', 'Análise de cargas'], ARRAY['Eurocódigo', 'Ações', 'Cargas'], 'Base para cálculo de ações estruturais', NOW(), NOW()),

('NP EN 1992-1-1', 'Eurocódigo 2 - Dimensionamento de estruturas de betão', 'Regras para dimensionamento de estruturas de betão armado', 'Estruturas', 'IPQ', 'ATIVA', 'CRITICA', '1.0', '2020-01-15', '2030-01-15', 'Estruturas de betão armado e pré-esforçado', ARRAY['Edifícios', 'Pontes', 'Fundações'], ARRAY['Dimensionamento à flexão', 'Dimensionamento ao esforço transverso', 'Verificação de fendilhação'], ARRAY['Cálculo estrutural', 'Verificação de segurança'], ARRAY['Eurocódigo', 'Betão', 'Dimensionamento'], 'Norma essencial para estruturas de betão', NOW(), NOW()),

('NP EN 1993-1-1', 'Eurocódigo 3 - Dimensionamento de estruturas de aço', 'Regras para dimensionamento de estruturas de aço', 'Estruturas', 'IPQ', 'ATIVA', 'CRITICA', '1.0', '2020-01-15', '2030-01-15', 'Estruturas de aço e estruturas mistas', ARRAY['Edifícios', 'Pontes', 'Estruturas industriais'], ARRAY['Dimensionamento à tração', 'Dimensionamento à compressão', 'Verificação de instabilidade'], ARRAY['Cálculo estrutural', 'Verificação de segurança'], ARRAY['Eurocódigo', 'Aço', 'Dimensionamento'], 'Fundamental para estruturas metálicas', NOW(), NOW()),

('NP EN 1997-1', 'Eurocódigo 7 - Dimensionamento geotécnico', 'Regras para dimensionamento geotécnico', 'Geotecnia', 'IPQ', 'ATIVA', 'ALTA', '1.0', '2020-01-15', '2030-01-15', 'Fundações e estruturas de contenção', ARRAY['Fundações', 'Muros de contenção', 'Taludes'], ARRAY['Capacidade de carga', 'Estabilidade', 'Deformações'], ARRAY['Ensaios geotécnicos', 'Análise de estabilidade'], ARRAY['Eurocódigo', 'Geotecnia', 'Fundações'], 'Essencial para obras geotécnicas', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas CEN (Comité Européen de Normalisation)
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('EN 10025-1', 'Produtos laminados a quente de aços estruturais', 'Especificações técnicas para aços estruturais', 'Materiais', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Aços para estruturas de construção', ARRAY['Estruturas metálicas', 'Pontes', 'Edifícios'], ARRAY['Propriedades mecânicas', 'Composição química', 'Tratamento térmico'], ARRAY['Ensaios de tração', 'Ensaios de impacto'], ARRAY['Aço', 'Estrutural', 'Laminado'], 'Norma fundamental para aços estruturais', NOW(), NOW()),

('EN 206+A1', 'Betão - Especificação, desempenho, produção e conformidade', 'Especificações para betão estrutural', 'Materiais', 'CEN', 'ATIVA', 'CRITICA', '1.0', '2019-06-01', '2029-06-01', 'Betão para estruturas', ARRAY['Estruturas de betão', 'Fundações', 'Pavimentos'], ARRAY['Classes de resistência', 'Durabilidade', 'Trabalhabilidade'], ARRAY['Ensaios de resistência', 'Ensaios de consistência'], ARRAY['Betão', 'Estrutural', 'Especificação'], 'Base para especificação de betão', NOW(), NOW()),

('EN 1990', 'Eurocódigo - Bases para o dimensionamento das estruturas', 'Bases para dimensionamento estrutural', 'Estruturas', 'CEN', 'ATIVA', 'CRITICA', '1.0', '2019-06-01', '2029-06-01', 'Todas as estruturas de construção', ARRAY['Edifícios', 'Pontes', 'Obras de arte'], ARRAY['Estados limites', 'Combinações de ações', 'Coeficientes de segurança'], ARRAY['Análise estrutural', 'Verificação de segurança'], ARRAY['Eurocódigo', 'Estruturas', 'Dimensionamento'], 'Norma europeia fundamental', NOW(), NOW()),

('EN 10080', 'Aço para armaduras de betão armado', 'Especificações para aços de armadura', 'Materiais', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Aços para armaduras de betão', ARRAY['Betão armado', 'Fundações', 'Estruturas'], ARRAY['Propriedades mecânicas', 'Aderência', 'Ductilidade'], ARRAY['Ensaios de tração', 'Ensaios de dobramento'], ARRAY['Aço', 'Armadura', 'Betão'], 'Essencial para betão armado', NOW(), NOW()),

('EN 13670', 'Execução de estruturas de betão', 'Regras para execução de estruturas de betão', 'Execução', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Execução de estruturas de betão', ARRAY['Betão armado', 'Fundações', 'Estruturas'], ARRAY['Preparação', 'Colocação', 'Cura'], ARRAY['Controlo de qualidade', 'Ensaios de conformidade'], ARRAY['Betão', 'Execução', 'Qualidade'], 'Controlo de execução de betão', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas ISO (International Organization for Standardization)
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('ISO 9001:2015', 'Sistemas de gestão da qualidade', 'Requisitos para sistemas de gestão da qualidade', 'Qualidade', 'ISO', 'ATIVA', 'CRITICA', '2015', '2015-09-15', '2025-09-15', 'Sistemas de gestão da qualidade', ARRAY['Empresas', 'Organizações', 'Projetos'], ARRAY['Liderança', 'Planeamento', 'Melhoria contínua'], ARRAY['Auditorias', 'Avaliação de conformidade'], ARRAY['Qualidade', 'Gestão', 'Sistema'], 'Norma internacional de qualidade', NOW(), NOW()),

('ISO 14001:2015', 'Sistemas de gestão ambiental', 'Requisitos para sistemas de gestão ambiental', 'Ambiente', 'ISO', 'ATIVA', 'ALTA', '2015', '2015-09-15', '2025-09-15', 'Gestão ambiental em organizações', ARRAY['Empresas', 'Obras', 'Projetos'], ARRAY['Política ambiental', 'Aspectos ambientais', 'Melhoria contínua'], ARRAY['Avaliação ambiental', 'Monitorização'], ARRAY['Ambiente', 'Gestão', 'Sustentabilidade'], 'Gestão ambiental empresarial', NOW(), NOW()),

('ISO 45001:2018', 'Sistemas de gestão da segurança e saúde no trabalho', 'Requisitos para SST', 'Segurança', 'ISO', 'ATIVA', 'CRITICA', '2018', '2018-03-12', '2028-03-12', 'Segurança e saúde no trabalho', ARRAY['Empresas', 'Obras', 'Locais de trabalho'], ARRAY['Política de SST', 'Identificação de perigos', 'Prevenção'], ARRAY['Avaliação de riscos', 'Monitorização'], ARRAY['Segurança', 'Saúde', 'Trabalho'], 'Gestão de segurança no trabalho', NOW(), NOW()),

('ISO 17025:2017', 'Requisitos gerais para a competência de laboratórios', 'Competência técnica de laboratórios', 'Laboratórios', 'ISO', 'ATIVA', 'ALTA', '2017', '2017-11-30', '2027-11-30', 'Laboratórios de ensaio e calibração', ARRAY['Laboratórios', 'Ensaios', 'Calibração'], ARRAY['Competência técnica', 'Sistema de gestão', 'Validação de métodos'], ARRAY['Ensaios de proficiência', 'Auditorias'], ARRAY['Laboratório', 'Competência', 'Ensaios'], 'Acreditação de laboratórios', NOW(), NOW()),

('ISO 31000:2018', 'Gestão de riscos', 'Princípios e diretrizes para gestão de riscos', 'Gestão', 'ISO', 'ATIVA', 'ALTA', '2018', '2018-02-20', '2028-02-20', 'Gestão de riscos em organizações', ARRAY['Empresas', 'Projetos', 'Obras'], ARRAY['Identificação de riscos', 'Avaliação', 'Tratamento'], ARRAY['Análise de riscos', 'Monitorização'], ARRAY['Riscos', 'Gestão', 'Prevenção'], 'Gestão integrada de riscos', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas ferroviárias específicas
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('EN 50126-1', 'Aplicações ferroviárias - Especificação e demonstração da fiabilidade, disponibilidade, manutenibilidade e segurança', 'RAMS para sistemas ferroviários', 'Ferroviário', 'CEN', 'ATIVA', 'CRITICA', '1.0', '2019-06-01', '2029-06-01', 'Sistemas ferroviários', ARRAY['Infraestrutura', 'Material circulante', 'Sinalização'], ARRAY['Fiabilidade', 'Disponibilidade', 'Segurança'], ARRAY['Análise de fiabilidade', 'Ensaios de segurança'], ARRAY['Ferroviário', 'RAMS', 'Segurança'], 'Fundamental para sistemas ferroviários', NOW(), NOW()),

('EN 50128', 'Aplicações ferroviárias - Sistemas de sinalização, telecomunicações e processamento', 'Software para sistemas ferroviários', 'Ferroviário', 'CEN', 'ATIVA', 'CRITICA', '1.0', '2019-06-01', '2029-06-01', 'Software de sistemas ferroviários', ARRAY['Sinalização', 'Telecomunicações', 'Controlo'], ARRAY['Qualidade do software', 'Segurança', 'Manutenibilidade'], ARRAY['Testes de software', 'Análise estática'], ARRAY['Ferroviário', 'Software', 'Segurança'], 'Qualidade de software ferroviário', NOW(), NOW()),

('EN 50129', 'Aplicações ferroviárias - Sistemas de sinalização de segurança', 'Sistemas de sinalização ferroviária', 'Ferroviário', 'CEN', 'ATIVA', 'CRITICA', '1.0', '2019-06-01', '2029-06-01', 'Sistemas de sinalização', ARRAY['Sinalização', 'Controlo', 'Segurança'], ARRAY['Integridade de segurança', 'Disponibilidade', 'Manutenibilidade'], ARRAY['Ensaios de segurança', 'Análise de falhas'], ARRAY['Ferroviário', 'Sinalização', 'Segurança'], 'Sistemas de sinalização seguros', NOW(), NOW()),

('EN 50163', 'Aplicações ferroviárias - Tensões de alimentação dos sistemas de tração', 'Tensões de alimentação ferroviária', 'Ferroviário', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Sistemas de alimentação', ARRAY['Tração', 'Alimentação', 'Infraestrutura'], ARRAY['Tensões nominais', 'Limites de tensão', 'Qualidade da energia'], ARRAY['Medições de tensão', 'Ensaios de qualidade'], ARRAY['Ferroviário', 'Tensão', 'Alimentação'], 'Tensões de alimentação', NOW(), NOW()),

('EN 50121-1', 'Aplicações ferroviárias - Compatibilidade eletromagnética', 'EMC em aplicações ferroviárias', 'Ferroviário', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Compatibilidade eletromagnética', ARRAY['Material circulante', 'Infraestrutura', 'Sistemas'], ARRAY['Emissões', 'Imunidade', 'Limites'], ARRAY['Ensaios EMC', 'Medições de campo'], ARRAY['Ferroviário', 'EMC', 'Eletromagnético'], 'Compatibilidade eletromagnética', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas de construção civil
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('EN 1991-2', 'Eurocódigo 1 - Ações em estruturas - Cargas de tráfego em pontes', 'Cargas de tráfego para pontes', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Pontes rodoviárias e ferroviárias', ARRAY['Pontes', 'Viadutos', 'Passagens superiores'], ARRAY['Cargas de tráfego', 'Combinações', 'Coeficientes dinâmicos'], ARRAY['Análise de cargas', 'Ensaios de carga'], ARRAY['Pontes', 'Tráfego', 'Cargas'], 'Cargas de tráfego em pontes', NOW(), NOW()),

('EN 1991-4', 'Eurocódigo 1 - Ações em estruturas - Ações em silos e reservatórios', 'Ações em estruturas especiais', 'Estruturas', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Silos e reservatórios', ARRAY['Silos', 'Reservatórios', 'Estruturas especiais'], ARRAY['Pressões de enchimento', 'Pressões de descarga', 'Ações térmicas'], ARRAY['Ensaios de pressão', 'Análise estrutural'], ARRAY['Silos', 'Reservatórios', 'Pressões'], 'Ações em estruturas especiais', NOW(), NOW()),

('EN 1992-2', 'Eurocódigo 2 - Dimensionamento de estruturas de betão - Pontes', 'Dimensionamento de pontes de betão', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Pontes de betão armado e pré-esforçado', ARRAY['Pontes', 'Viadutos', 'Passagens'], ARRAY['Dimensionamento específico', 'Durabilidade', 'Manutenção'], ARRAY['Cálculo estrutural', 'Ensaios de durabilidade'], ARRAY['Pontes', 'Betão', 'Dimensionamento'], 'Dimensionamento de pontes', NOW(), NOW()),

('EN 1993-2', 'Eurocódigo 3 - Dimensionamento de estruturas de aço - Pontes', 'Dimensionamento de pontes de aço', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Pontes de aço e estruturas mistas', ARRAY['Pontes', 'Viadutos', 'Passagens'], ARRAY['Dimensionamento específico', 'Fadiga', 'Manutenção'], ARRAY['Cálculo estrutural', 'Ensaios de fadiga'], ARRAY['Pontes', 'Aço', 'Dimensionamento'], 'Dimensionamento de pontes metálicas', NOW(), NOW()),

('EN 1998-1', 'Eurocódigo 8 - Dimensionamento de estruturas para resistência aos sismos', 'Dimensionamento sísmico', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Estruturas em zonas sísmicas', ARRAY['Edifícios', 'Pontes', 'Estruturas especiais'], ARRAY['Ações sísmicas', 'Comportamento dúctil', 'Capacidade de deformação'], ARRAY['Análise sísmica', 'Ensaios de comportamento'], ARRAY['Sísmico', 'Estruturas', 'Dimensionamento'], 'Dimensionamento sísmico', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas de materiais
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('EN 197-1', 'Cimento - Composição, especificações e critérios de conformidade', 'Especificações de cimentos', 'Materiais', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Cimentos para construção', ARRAY['Betão', 'Argamassas', 'Construção'], ARRAY['Composição', 'Resistência', 'Durabilidade'], ARRAY['Ensaios de resistência', 'Análise química'], ARRAY['Cimento', 'Materiais', 'Especificação'], 'Especificações de cimento', NOW(), NOW()),

('EN 12620', 'Agregados para betão', 'Especificações para agregados', 'Materiais', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Agregados para betão', ARRAY['Betão', 'Argamassas', 'Construção'], ARRAY['Granulometria', 'Resistência', 'Durabilidade'], ARRAY['Análise granulométrica', 'Ensaios de resistência'], ARRAY['Agregados', 'Betão', 'Materiais'], 'Especificações de agregados', NOW(), NOW()),

('EN 934-2', 'Aditivos para betão, argamassa e calda', 'Especificações de aditivos', 'Materiais', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Aditivos para betão', ARRAY['Betão', 'Argamassas', 'Construção'], ARRAY['Eficácia', 'Compatibilidade', 'Dosagem'], ARRAY['Ensaios de eficácia', 'Ensaios de compatibilidade'], ARRAY['Aditivos', 'Betão', 'Materiais'], 'Especificações de aditivos', NOW(), NOW()),

('EN 1008', 'Água para betão', 'Especificações para água de amassadura', 'Materiais', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Água para betão', ARRAY['Betão', 'Argamassas', 'Construção'], ARRAY['Qualidade', 'Impurezas', 'pH'], ARRAY['Análise química', 'Ensaios de qualidade'], ARRAY['Água', 'Betão', 'Materiais'], 'Qualidade da água', NOW(), NOW()),

('EN 1015-1', 'Métodos de ensaio para argamassas para alvenaria', 'Ensaios de argamassas', 'Materiais', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Argamassas para alvenaria', ARRAY['Alvenaria', 'Construção', 'Revestimentos'], ARRAY['Consistência', 'Resistência', 'Aderência'], ARRAY['Ensaios de consistência', 'Ensaios de resistência'], ARRAY['Argamassas', 'Alvenaria', 'Ensaios'], 'Ensaios de argamassas', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas de execução
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('EN 1090-1', 'Execução de estruturas de aço e alumínio', 'Execução de estruturas metálicas', 'Execução', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Execução de estruturas metálicas', ARRAY['Estruturas de aço', 'Pontes', 'Edifícios'], ARRAY['Fabrico', 'Montagem', 'Controlo'], ARRAY['Controlo de qualidade', 'Ensaios de soldadura'], ARRAY['Aço', 'Execução', 'Estruturas'], 'Execução de estruturas metálicas', NOW(), NOW()),

('EN 1996-2', 'Eurocódigo 6 - Dimensionamento de estruturas de alvenaria - Execução', 'Execução de alvenaria', 'Execução', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Execução de estruturas de alvenaria', ARRAY['Alvenaria', 'Edifícios', 'Muros'], ARRAY['Preparação', 'Assentamento', 'Cura'], ARRAY['Controlo de qualidade', 'Ensaios de resistência'], ARRAY['Alvenaria', 'Execução', 'Estruturas'], 'Execução de alvenaria', NOW(), NOW()),

('EN 1997-2', 'Eurocódigo 7 - Dimensionamento geotécnico - Investigação e ensaios', 'Investigação geotécnica', 'Geotecnia', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Investigação geotécnica', ARRAY['Fundações', 'Taludes', 'Obras subterrâneas'], ARRAY['Sondagens', 'Ensaios in situ', 'Ensaios laboratoriais'], ARRAY['Sondagens', 'Ensaios geotécnicos'], ARRAY['Geotecnia', 'Investigação', 'Ensaios'], 'Investigação geotécnica', NOW(), NOW()),

('EN 1999-1-1', 'Eurocódigo 9 - Dimensionamento de estruturas de alumínio', 'Dimensionamento de estruturas de alumínio', 'Estruturas', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Estruturas de alumínio', ARRAY['Estruturas leves', 'Fachadas', 'Coberturas'], ARRAY['Dimensionamento', 'Durabilidade', 'Manutenção'], ARRAY['Cálculo estrutural', 'Ensaios de durabilidade'], ARRAY['Alumínio', 'Estruturas', 'Dimensionamento'], 'Estruturas de alumínio', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas de qualidade e controlo
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('EN ISO/IEC 17020', 'Avaliação da conformidade - Requisitos para o funcionamento de diferentes tipos de organismos que realizam inspeção', 'Organismos de inspeção', 'Qualidade', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Organismos de inspeção', ARRAY['Inspeção', 'Controlo', 'Qualidade'], ARRAY['Competência', 'Independência', 'Imparcialidade'], ARRAY['Auditorias', 'Avaliação de competência'], ARRAY['Inspeção', 'Qualidade', 'Controlo'], 'Organismos de inspeção', NOW(), NOW()),

('EN ISO/IEC 17065', 'Avaliação da conformidade - Requisitos para organismos que certificam produtos, processos e serviços', 'Certificação de produtos', 'Qualidade', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Certificação de produtos', ARRAY['Certificação', 'Produtos', 'Serviços'], ARRAY['Competência', 'Independência', 'Imparcialidade'], ARRAY['Auditorias', 'Avaliação de conformidade'], ARRAY['Certificação', 'Produtos', 'Qualidade'], 'Certificação de produtos', NOW(), NOW()),

('EN ISO 19011', 'Diretrizes para auditoria de sistemas de gestão', 'Auditorias de sistemas de gestão', 'Qualidade', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Auditorias de sistemas de gestão', ARRAY['Auditorias', 'Qualidade', 'Ambiente'], ARRAY['Competência dos auditores', 'Processo de auditoria', 'Relatórios'], ARRAY['Auditorias', 'Avaliação de competência'], ARRAY['Auditorias', 'Sistemas', 'Gestão'], 'Diretrizes para auditorias', NOW(), NOW()),

('EN ISO 14001', 'Sistemas de gestão ambiental', 'Gestão ambiental', 'Ambiente', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Sistemas de gestão ambiental', ARRAY['Empresas', 'Obras', 'Projetos'], ARRAY['Política ambiental', 'Aspectos ambientais', 'Melhoria'], ARRAY['Avaliação ambiental', 'Monitorização'], ARRAY['Ambiente', 'Gestão', 'Sustentabilidade'], 'Gestão ambiental', NOW(), NOW()),

('EN ISO 45001', 'Sistemas de gestão da segurança e saúde no trabalho', 'Gestão de SST', 'Segurança', 'CEN', 'ATIVA', 'CRITICA', '1.0', '2019-06-01', '2029-06-01', 'Segurança e saúde no trabalho', ARRAY['Empresas', 'Obras', 'Locais de trabalho'], ARRAY['Política de SST', 'Identificação de perigos', 'Prevenção'], ARRAY['Avaliação de riscos', 'Monitorização'], ARRAY['Segurança', 'Saúde', 'Trabalho'], 'Gestão de SST', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas específicas do setor
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('EN 1991-1-4', 'Eurocódigo 1 - Ações em estruturas - Ações do vento', 'Ações do vento em estruturas', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Ações do vento', ARRAY['Edifícios', 'Pontes', 'Estruturas altas'], ARRAY['Pressão do vento', 'Forças dinâmicas', 'Efeitos de turbulência'], ARRAY['Ensaios em túnel de vento', 'Análise dinâmica'], ARRAY['Vento', 'Ações', 'Estruturas'], 'Ações do vento', NOW(), NOW()),

('EN 1991-1-5', 'Eurocódigo 1 - Ações em estruturas - Ações térmicas', 'Ações térmicas em estruturas', 'Estruturas', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Ações térmicas', ARRAY['Estruturas', 'Pontes', 'Edifícios'], ARRAY['Variações de temperatura', 'Gradientes térmicos', 'Deformações'], ARRAY['Medições de temperatura', 'Análise térmica'], ARRAY['Térmico', 'Ações', 'Estruturas'], 'Ações térmicas', NOW(), NOW()),

('EN 1991-1-6', 'Eurocódigo 1 - Ações em estruturas - Ações durante a execução', 'Ações durante a execução', 'Estruturas', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Ações durante a execução', ARRAY['Obras', 'Estruturas', 'Execução'], ARRAY['Cargas de construção', 'Ações temporárias', 'Sequência de execução'], ARRAY['Planeamento de execução', 'Controlo de cargas'], ARRAY['Execução', 'Ações', 'Obras'], 'Ações durante execução', NOW(), NOW()),

('EN 1991-1-7', 'Eurocódigo 1 - Ações em estruturas - Ações acidentais', 'Ações acidentais', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Ações acidentais', ARRAY['Estruturas', 'Pontes', 'Edifícios'], ARRAY['Impactos', 'Explosões', 'Incêndios'], ARRAY['Análise de riscos', 'Ensaios de impacto'], ARRAY['Acidentais', 'Ações', 'Segurança'], 'Ações acidentais', NOW(), NOW()),

('EN 1991-3', 'Eurocódigo 1 - Ações em estruturas - Ações induzidas por gruas e máquinas', 'Ações de gruas e máquinas', 'Estruturas', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Ações de gruas e máquinas', ARRAY['Estruturas industriais', 'Edifícios', 'Obras'], ARRAY['Cargas dinâmicas', 'Vibrações', 'Impactos'], ARRAY['Ensaios de vibração', 'Análise dinâmica'], ARRAY['Gruas', 'Máquinas', 'Ações'], 'Ações de equipamentos', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;

-- Normas de durabilidade e manutenção
INSERT INTO normas (codigo, titulo, descricao, categoria, organismo, status, prioridade, versao, data_publicacao, data_entrada_vigor, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, tags, observacoes, criado_em, atualizado_em) VALUES
('EN 1992-1-1', 'Eurocódigo 2 - Dimensionamento de estruturas de betão - Durabilidade', 'Durabilidade de estruturas de betão', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Durabilidade de betão', ARRAY['Estruturas de betão', 'Fundações', 'Pontes'], ARRAY['Classes de exposição', 'Cobrimento', 'Composição'], ARRAY['Ensaios de durabilidade', 'Controlo de qualidade'], ARRAY['Durabilidade', 'Betão', 'Estruturas'], 'Durabilidade de betão', NOW(), NOW()),

('EN 1993-1-9', 'Eurocódigo 3 - Dimensionamento de estruturas de aço - Fadiga', 'Fadiga em estruturas de aço', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Fadiga em estruturas de aço', ARRAY['Pontes', 'Estruturas industriais', 'Estruturas sujeitas a cargas variáveis'], ARRAY['Categorias de detalhes', 'Curvas S-N', 'Análise de fadiga'], ARRAY['Ensaios de fadiga', 'Análise de tensões'], ARRAY['Fadiga', 'Aço', 'Estruturas'], 'Fadiga em estruturas metálicas', NOW(), NOW()),

('EN 1990-MANUTENCAO', 'Eurocódigo - Bases para o dimensionamento das estruturas - Manutenção', 'Manutenção de estruturas', 'Estruturas', 'CEN', 'ATIVA', 'MEDIA', '1.0', '2019-06-01', '2029-06-01', 'Manutenção de estruturas', ARRAY['Estruturas', 'Pontes', 'Edifícios'], ARRAY['Inspeções', 'Reparações', 'Reforços'], ARRAY['Inspeções visuais', 'Ensaios não destrutivos'], ARRAY['Manutenção', 'Estruturas', 'Inspeções'], 'Manutenção de estruturas', NOW(), NOW()),

('EN 1991-1-1-PESOS', 'Eurocódigo 1 - Ações em estruturas - Ações gerais - Densidades, pesos próprios e cargas de armazenamento', 'Pesos próprios e cargas', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Pesos próprios e cargas', ARRAY['Estruturas', 'Edifícios', 'Obras'], ARRAY['Pesos próprios', 'Cargas de armazenamento', 'Densidades'], ARRAY['Pesagem', 'Cálculo de cargas'], ARRAY['Pesos', 'Cargas', 'Estruturas'], 'Pesos próprios e cargas', NOW(), NOW()),

('EN 1991-1-2', 'Eurocódigo 1 - Ações em estruturas - Ações gerais - Ações em estruturas expostas ao fogo', 'Ações do fogo', 'Estruturas', 'CEN', 'ATIVA', 'ALTA', '1.0', '2019-06-01', '2029-06-01', 'Ações do fogo em estruturas', ARRAY['Estruturas', 'Edifícios', 'Túneis'], ARRAY['Curvas de temperatura', 'Ações térmicas', 'Resistência ao fogo'], ARRAY['Ensaios de resistência ao fogo', 'Análise térmica'], ARRAY['Fogo', 'Ações', 'Segurança'], 'Ações do fogo', NOW(), NOW())

ON CONFLICT (codigo) DO NOTHING;
