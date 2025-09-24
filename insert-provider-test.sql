-- INSTRUÇÃO SQL PARA INSERIR DADOS DE TESTE NA TABELA PROVIDERS
-- Compatível com Supabase PostgreSQL

-- Primeiro, verifique se a extensão pgcrypto está habilitada (necessária para gen_random_uuid())
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- AVISO IMPORTANTE: A constraint UNIQUE do CNPJ foi removida pelo comando:
-- ALTER TABLE providers DROP CONSTRAINT IF EXISTS unique_cnpj;
-- Portanto, não é possível usar ON CONFLICT (cnpj)

-- Inserção do registro de teste na tabela providers
INSERT INTO providers (
    id,
    user_id,
    
    -- Dados do responsável
    responsible_name,
    responsible_document,
    
    -- Dados da empresa
    fantasy_name,
    company_name,
    cnpj,
    state_registration,
    municipal_registration,
    
    -- Contato
    main_phone,
    secondary_phone,
    whatsapp_phone,
    website,
    instagram,
    facebook,
    
    -- Endereço
    zip_code,
    address,
    number,
    complement,
    neighborhood,
    city,
    state,
    
    -- Dados operacionais
    service_radius_km,
    service_cities,
    service_states,
    
    -- Documentação
    contract_document_url,
    cnpj_document_url,
    
    -- Status e verificação
    is_verified,
    verification_status,
    
    -- Metadados (serão preenchidos automaticamente)
    created_at,
    updated_at
)
VALUES (
    -- ID gerado automaticamente
    gen_random_uuid(),
    
    -- user_id (pode ser NULL para teste ou usar um ID de usuário existente)
    NULL,
    
    -- Dados do responsável
    'João Silva Teste',
    '123.456.789-00',
    
    -- Dados da empresa
    'Construtora Teste Ltda',
    'Construtora Teste Ltda ME',
    '12.345.678/0001-90', -- CNPJ
    '123456789',
    '987654321',
    
    -- Contato
    '(11) 99999-9999',
    '(11) 88888-8888',
    '(11) 97777-7777',
    'https://construtorateste.com.br',
    '@construtorateste',
    'construtorateste',
    
    -- Endereço
    '01234-567',
    'Rua das Construções, 123',
    '123',
    'Sala 45',
    'Centro',
    'São Paulo',
    'SP',
    
    -- Dados operacionais
    100, -- service_radius_km
    ARRAY['São Paulo', 'Guarulhos', 'Osasco'], -- service_cities
    ARRAY['SP', 'RJ'], -- service_states
    
    -- Documentação (URLs de exemplo)
    'https://example.com/contract.pdf',
    'https://example.com/cnpj.pdf',
    
    -- Status e verificação
    FALSE, -- is_verified
    'pending', -- verification_status
    
    -- Metadados (valores padrão)
    DEFAULT, -- created_at (NOW())
    DEFAULT  -- updated_at (NOW())
)
RETURNING *; -- Retorna o registro inserido

-- INSTRUÇÕES DE USO:
-- 1. Execute este SQL no editor SQL do Supabase Dashboard
-- 2. Verifique se o registro foi inserido com sucesso
-- 3. Se o CNPJ já existir, a inserção falhará (não há mais constraint UNIQUE no CNPJ)

-- CONSULTA PARA VERIFICAR O REGISTRO INSERIDO:
-- SELECT * FROM providers WHERE cnpj = '12.345.678/0001-90';

-- CONSULTA PARA LISTAR TODOS OS PROVIDERS:
-- SELECT id, fantasy_name, cnpj, city, state, is_verified FROM providers ORDER BY created_at DESC;

-- NOTAS IMPORTANTES:
-- 1. O campo 'user_id' está como NULL para teste. Em produção, deve referenciar um usuário válido de auth.users
-- 2. CNPJ NÃO TEM MAIS CONSTRAINT UNIQUE - a constraint foi removida pelo comando: ALTER TABLE providers DROP CONSTRAINT IF EXISTS unique_cnpj;
-- 3. Campos obrigatórios: responsible_name, fantasy_name, company_name, cnpj, main_phone, zip_code, address, neighborhood, city, state
-- 4. Arrays (service_cities, service_states) usam a sintaxe ARRAY[] do PostgreSQL
-- 5. Timestamps (created_at, updated_at) são preenchidos automaticamente
-- 6. A cláusula ON CONFLICT foi removida pois não há mais constraint UNIQUE no CNPJ