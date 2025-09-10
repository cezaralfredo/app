-- Tabelas para o sistema EQUIPAMAX - Cadastro de Fornecedores
-- Project ID: dujnqluqzirvsdyyxlbi

-- Tabela de usuários (base para autenticação)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'provider')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Tabela de fornecedores (dados da empresa)
CREATE TABLE IF NOT EXISTS providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    INDEX idx_equipment_provider (provider_id),
    INDEX idx_equipment_category (category_id),
    INDEX idx_equipment_location (latitude, longitude)
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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_images ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para providers
CREATE POLICY "Providers can view their own data" ON providers
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM users WHERE users.id = providers.user_id AND users.id = auth.uid()
    ));

CREATE POLICY "Providers can update their own data" ON providers
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM users WHERE users.id = providers.user_id AND users.id = auth.uid()
    ));

CREATE POLICY "Public can view verified providers" ON providers
    FOR SELECT USING (is_verified = TRUE);

-- Políticas para equipment
CREATE POLICY "Providers can manage their equipment" ON equipment
    FOR ALL USING (EXISTS (
        SELECT 1 FROM providers 
        WHERE providers.id = equipment.provider_id 
        AND providers.user_id = auth.uid()
    ));

CREATE POLICY "Public can view available equipment" ON equipment
    FOR SELECT USING (is_available = TRUE);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices adicionais para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_providers_cnpj ON providers(cnpj);
CREATE INDEX idx_providers_city_state ON providers(city, state);
CREATE INDEX idx_equipment_rates ON equipment(daily_rate, weekly_rate, monthly_rate);
CREATE INDEX idx_equipment_availability ON equipment(is_available, availability_status);