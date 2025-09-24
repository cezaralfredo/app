-- Habilitar extensão necessária para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabelas para o sistema EQUIPAMAX - Cadastro de Fornecedores
-- Project ID: dujnqluqzirvsdyyxlbi

-- NOTA: Removida tabela users personalizada - usar auth.users do Supabase

-- Tabela de fornecedores (dados da empresa)
CREATE TABLE IF NOT EXISTS providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Dados do responsável
    responsible_name VARCHAR(100) NOT NULL,
    responsible_document VARCHAR(14),
    
    -- Dados da empresa
    fantasy_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    state_registration VARCHAR(20),
    municipal_registration VARCHAR(20),
    
    -- Contato
    main_phone VARCHAR(20) NOT NULL,
    secondary_phone VARCHAR(20),
    whatsapp_phone VARCHAR(20),
    website VARCHAR(255),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    
    -- Endereço
    zip_code VARCHAR(9) NOT NULL,
    address VARCHAR(255) NOT NULL,
    number VARCHAR(10),
    complement VARCHAR(100),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    
    -- Dados operacionais
    service_radius_km INTEGER DEFAULT 50,
    service_cities TEXT[],
    service_states VARCHAR(2)[],
    
    -- Documentação
    contract_document_url VARCHAR(255),
    cnpj_document_url VARCHAR(255),
    
    -- Status e verificação
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verification_notes TEXT,
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Índices
    CONSTRAINT unique_cnpj UNIQUE(cnpj)
);
ALTER TABLE providers DROP CONSTRAINT IF EXISTS unique_cnpj;

-- Tabela de documentos dos fornecedores
CREATE TABLE IF NOT EXISTS provider_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('contract', 'cnpj', 'id_card', 'other')),
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT
);

-- Tabela de categorias de equipamentos
CREATE TABLE IF NOT EXISTS equipment_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de equipamentos
CREATE TABLE IF NOT EXISTS equipment (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    category_id UUID REFERENCES equipment_categories(id),
    
    -- Informações básicas
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    plate VARCHAR(10),
    
    -- Especificações técnicas
    weight_kg DECIMAL(10,2),
    dimensions VARCHAR(100),
    power_hp DECIMAL(10,2),
    capacity_kg DECIMAL(10,2),
    
    -- Status e disponibilidade
    is_available BOOLEAN DEFAULT TRUE,
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'rented', 'maintenance', 'unavailable')),
    daily_rate DECIMAL(10,2) NOT NULL,
    weekly_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    minimum_rental_days INTEGER DEFAULT 1,
    
    -- Localização
    current_location VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Metadados
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    
    -- Índices (removidos do bloco CREATE TABLE; serão criados adiante)
);

-- Tabela de imagens dos equipamentos
CREATE TABLE IF NOT EXISTS equipment_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    alt_text VARCHAR(255),
    upload_order INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão de equipamentos
INSERT INTO equipment_categories (name, description, icon) VALUES
('Munck', 'Caminhões munck para carga e descarga', '🚚'),
('Guindaste', 'Guindastes para içamento de cargas', '🏗️'),
('Empilhadeira', 'Empilhadeiras para movimentação de materiais', '📦'),
('Pipa', 'Caminhões pipa para transporte de água', '💧'),
('Guincho', 'Veículos guincho para reboque', '🔧'),
('Escavadeira', 'Máquinas para escavação e terraplanagem', '⛏️'),
('Trator', 'Tratores para agricultura e construção', '🚜'),
('Betoneira', 'Betoneiras para mistura de concreto', '🏗️')
ON CONFLICT (name) DO NOTHING;

-- Criar políticas de segurança RLS (Row Level Security)
-- REMOVIDO: ALTER TABLE users ENABLE ROW LEVEL SECURITY; (não existe mais tabela users personalizada)
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_images ENABLE ROW LEVEL SECURITY;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at (idempotentes)
-- REMOVIDO: Trigger para users (tabela removida)

DROP TRIGGER IF EXISTS update_providers_updated_at ON providers;
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipment_updated_at ON equipment;
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices adicionais para performance
-- Removidos índices redundantes em users(email) e providers(cnpj); usaremos os UNIQUE já existentes
-- Limpeza idempotente (caso tenham sido criados em execuções anteriores)
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_providers_cnpj;

CREATE INDEX IF NOT EXISTS idx_providers_city_state ON providers(city, state);
CREATE INDEX IF NOT EXISTS idx_equipment_rates ON equipment(daily_rate, weekly_rate, monthly_rate);
CREATE INDEX IF NOT EXISTS idx_equipment_availability ON equipment(is_available, availability_status);
CREATE INDEX IF NOT EXISTS idx_equipment_provider ON equipment(provider_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(latitude, longitude);
-- Índices para FKs úteis em consultas
CREATE INDEX IF NOT EXISTS idx_provider_documents_provider ON provider_documents(provider_id);
CREATE INDEX IF Not EXISTS idx_equipment_images_equipment ON equipment_images(equipment_id);


-- RBAC: tabela de roles de usuário
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin','user','moderator')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Função utilitária para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin(uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = uid AND ur.role = 'admin'
  );
$$;

-- Políticas para user_roles
-- Leitura: qualquer usuário autenticado pode consultar (necessário para o app saber a role)
DROP POLICY IF EXISTS "Authenticated can read own and public roles" ON user_roles;
CREATE POLICY "Authenticated can read own and public roles" ON user_roles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Inserção: permitir SOMENTE quando ainda não existe nenhum registro em user_roles
-- Assim é possível semear o primeiro admin com a própria conta logada
DROP POLICY IF EXISTS "Bootstrap first admin" ON user_roles;
CREATE POLICY "Bootstrap first admin" ON user_roles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'admin'
    AND (SELECT COUNT(*) = 0 FROM user_roles)
  );

-- Atualização/Exclusão: restritas (podem ser gerenciadas manualmente pelo painel do Supabase ou futuras funções admin)
REVOKE ALL ON TABLE user_roles FROM PUBLIC;

-- REMOVIDAS: Políticas para tabela users (não existe mais)

-- Políticas atualizadas para providers (agora referenciando auth.users)
DROP POLICY IF EXISTS "Providers can view their own data" ON providers;
CREATE POLICY "Providers can view their own data" ON providers
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Providers can update their own data" ON providers;
CREATE POLICY "Providers can update their own data" ON providers
  FOR UPDATE USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "Public can view verified providers" ON providers;
CREATE POLICY "Public can view verified providers" ON providers
  FOR SELECT USING (is_verified = TRUE OR is_admin());

DROP POLICY IF EXISTS "Providers can manage their equipment" ON equipment;
CREATE POLICY "Providers can manage their equipment" ON equipment
  FOR ALL USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM providers 
      WHERE providers.id = equipment.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Public can view available equipment" ON equipment;
CREATE POLICY "Public can view available equipment" ON equipment
  FOR SELECT USING (is_available = TRUE OR is_admin());

-- Políticas para equipment_images
DROP POLICY IF EXISTS "Providers can manage their equipment images" ON equipment_images;
CREATE POLICY "Providers can manage their equipment images" ON equipment_images
  FOR ALL
  USING (
    is_admin() OR EXISTS (
      SELECT 1
      FROM equipment e
      JOIN providers p ON p.id = e.provider_id
      WHERE e.id = equipment_images.equipment_id
        AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    is_admin() OR EXISTS (
      SELECT 1
      FROM equipment e
      JOIN providers p ON p.id = e.provider_id
      WHERE e.id = equipment_images.equipment_id
        AND p.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Public can view images of available equipment" ON equipment_images;
CREATE POLICY "Public can view images of available equipment" ON equipment_images
  FOR SELECT USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM equipment e
      WHERE e.id = equipment_images.equipment_id
        AND e.is_available = TRUE
    )
  );

DROP POLICY IF EXISTS "Provider documents access" ON provider_documents;
CREATE POLICY "Provider documents access" ON provider_documents
  FOR ALL USING (
    is_admin() OR EXISTS (
      SELECT 1 FROM providers WHERE providers.id = provider_documents.provider_id AND providers.user_id = auth.uid()
    )
  );


-- Permitir que o email designado possa auto-atribuir admin (sem depender de ser o primeiro)
-- Usa o claim do JWT para obter o email do usuário autenticado
DROP POLICY IF EXISTS "Designated email can self-assign admin" ON user_roles;
CREATE POLICY "Designated email can self-assign admin" ON user_roles
  FOR INSERT
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::jsonb ->> 'email') = 'gerandoparceria@gmail.com'
    AND user_id = auth.uid()
    AND role = 'admin'
    AND NOT EXISTS (
      SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid()
    )
  );

-- RPC segura para listar usuários somente para administradores
CREATE OR REPLACE FUNCTION public.list_users_admin(
  search text DEFAULT NULL,
  limit_count integer DEFAULT 100,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  name text,
  role text,
  status text,
  last_login timestamptz,
  phone text,
  avatar text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _is_admin boolean;
BEGIN
  -- Verifica se o caller é admin usando a função pública
  _is_admin := is_admin(auth.uid());
  IF NOT _is_admin THEN
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.created_at,
    COALESCE(
      u.raw_user_meta_data->>'full_name', 
      u.raw_user_meta_data->>'name', 
      split_part(u.email,'@',1)
    ) AS name,
    COALESCE(ur.role, COALESCE(u.raw_user_meta_data->>'role','user')) AS role,
    COALESCE(u.raw_user_meta_data->>'status','active') AS status,
    u.last_sign_in_at AS last_login,
    COALESCE(u.raw_user_meta_data->>'phone', u.raw_user_meta_data->>'telefone') AS phone,
    COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'avatar') AS avatar
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  WHERE (
    search IS NULL
    OR u.email ILIKE '%'||search||'%'
    OR (u.raw_user_meta_data->>'full_name') ILIKE '%'||search||'%'
    OR (u.raw_user_meta_data->>'name') ILIKE '%'||search||'%'
  )
  ORDER BY u.created_at DESC
  LIMIT COALESCE(limit_count, 100)
  OFFSET COALESCE(offset_count, 0);
END;
$$;

-- Permissões de execução: somente usuários autenticados (a função valida se é admin)
REVOKE ALL ON FUNCTION public.list_users_admin(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_users_admin(text, integer, integer) TO authenticated;