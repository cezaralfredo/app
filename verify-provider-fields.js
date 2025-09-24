// Script para verificar mapeamento entre campos do formulário e tabela do Supabase

// Estrutura da tabela providers (baseado em supabase_tables.sql)
const providerTableStructure = {
  id: 'UUID PRIMARY KEY',
  user_id: 'UUID REFERENCES auth.users(id)',
  
  // Dados do responsável
  responsible_name: 'VARCHAR(100) NOT NULL',
  responsible_document: 'VARCHAR(14)',
  
  // Dados da empresa
  fantasy_name: 'VARCHAR(255) NOT NULL',
  company_name: 'VARCHAR(255) NOT NULL',
  cnpj: 'VARCHAR(18) UNIQUE NOT NULL',
  state_registration: 'VARCHAR(20)',
  municipal_registration: 'VARCHAR(20)',
  
  // Contato
  main_phone: 'VARCHAR(20) NOT NULL',
  secondary_phone: 'VARCHAR(20)',
  whatsapp_phone: 'VARCHAR(20)',
  website: 'VARCHAR(255)',
  instagram: 'VARCHAR(100)',
  facebook: 'VARCHAR(100)',
  
  // Endereço
  zip_code: 'VARCHAR(9) NOT NULL',
  address: 'VARCHAR(255) NOT NULL',
  number: 'VARCHAR(10)',
  complement: 'VARCHAR(100)',
  neighborhood: 'VARCHAR(100) NOT NULL',
  city: 'VARCHAR(100) NOT NULL',
  state: 'VARCHAR(2) NOT NULL',
  
  // Dados operacionais
  service_radius_km: 'INTEGER DEFAULT 50',
  service_cities: 'TEXT[]',
  service_states: 'VARCHAR(2)[]',
  
  // Documentação
  contract_document_url: 'VARCHAR(255)',
  cnpj_document_url: 'VARCHAR(255)',
  
  // Status e verificação
  is_verified: 'BOOLEAN DEFAULT FALSE',
  verification_status: 'VARCHAR(20) DEFAULT pending',
  verification_notes: 'TEXT',
  
  // Metadados
  created_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
  updated_at: 'TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
  verified_at: 'TIMESTAMP WITH TIME ZONE'
};

// Campos do formulário (baseado em ProviderRegister/index.tsx)
const formFields = [
  'responsibleName',
  'responsibleDocument',
  'fantasyName', 
  'companyName',
  'cnpj',
  'stateRegistration',
  'municipalRegistration',
  'mainPhone',
  'secondaryPhone',
  'whatsappPhone',
  'website',
  'instagram',
  'facebook',
  'zipCode',
  'address',
  'number',
  'complement',
  'neighborhood',
  'city',
  'state',
  'serviceRadius',
  'serviceCities',
  'serviceStates',
  'password',
  'confirmPassword',
  'terms',
  'contractUpload',
  'cnpjDocumentUpload'
];

// Mapeamento de campos do formulário para a tabela
const fieldMapping = {
  // Dados do responsável
  'responsibleName': 'responsible_name',
  'responsibleDocument': 'responsible_document',
  
  // Dados da empresa
  'fantasyName': 'fantasy_name',
  'companyName': 'company_name',
  'cnpj': 'cnpj',
  'stateRegistration': 'state_registration',
  'municipalRegistration': 'municipal_registration',
  
  // Contato
  'mainPhone': 'main_phone',
  'secondaryPhone': 'secondary_phone',
  'whatsappPhone': 'whatsapp_phone',
  'website': 'website',
  'instagram': 'instagram',
  'facebook': 'facebook',
  
  // Endereço
  'zipCode': 'zip_code',
  'address': 'address',
  'number': 'number',
  'complement': 'complement',
  'neighborhood': 'neighborhood',
  'city': 'city',
  'state': 'state',
  
  // Serviços
  'serviceRadius': 'service_radius_km',
  'serviceCities': 'service_cities',
  'serviceStates': 'service_states'
};

// Campos que não são armazenados na tabela providers
const nonStoredFields = [
  'password',
  'confirmPassword', 
  'terms',
  'contractUpload',
  'cnpjDocumentUpload'
];

function verifyFieldMapping() {
  console.log('=== VERIFICAÇÃO DE MAPEAMENTO DE CAMPOS ===\n');
  
  console.log('📋 CAMPOS DO FORMULÁRIO:');
  formFields.forEach(field => {
    const status = nonStoredFields.includes(field) ? '🚫 (não armazenado)' : 
                   fieldMapping[field] ? '✅' : '❌ (não mapeado)';
    console.log(`   ${status} ${field}`);
  });
  
  console.log('\n🗂️  CAMPOS DA TABELA PROVIDERS:');
  Object.keys(providerTableStructure).forEach(dbField => {
    const formField = Object.entries(fieldMapping).find(([_, mapped]) => mapped === dbField)?.[0];
    const status = formField ? '✅' : '❌ (não utilizado)';
    console.log(`   ${status} ${dbField}: ${providerTableStructure[dbField]}`);
  });
  
  console.log('\n🔍 CAMPOS NÃO MAPEADOS:');
  const unmappedFormFields = formFields.filter(field => 
    !fieldMapping[field] && !nonStoredFields.includes(field)
  );
  
  if (unmappedFormFields.length === 0) {
    console.log('   ✅ Todos os campos estão mapeados corretamente');
  } else {
    unmappedFormFields.forEach(field => {
      console.log(`   ❌ ${field} - Campo do formulário não mapeado para a tabela`);
    });
  }
  
  console.log('\n📝 CAMPOS QUE NÃO SÃO ARMAZENADOS:');
  nonStoredFields.forEach(field => {
    console.log(`   🚫 ${field} - Campo de formulário apenas (senha, termos, uploads)`);
  });
}

// Dados de exemplo para teste
const testProviderData = {
  responsible_name: 'João Silva Teste',
  responsible_document: '123.456.789-00',
  fantasy_name: 'Construtora Teste Ltda',
  company_name: 'Construtora Teste Ltda ME',
  cnpj: '12.345.678/0001-90',
  state_registration: '123456789',
  municipal_registration: '987654321',
  main_phone: '(11) 99999-9999',
  secondary_phone: '(11) 88888-8888',
  whatsapp_phone: '(11) 97777-7777',
  website: 'https://construtorateste.com.br',
  instagram: '@construtorateste',
  facebook: 'construtorateste',
  zip_code: '01234-567',
  address: 'Rua das Construções, 123',
  number: '123',
  complement: 'Sala 45',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  service_radius_km: 100,
  service_cities: ['São Paulo', 'Guarulhos', 'Osasco'],
  service_states: ['SP', 'RJ'],
  is_verified: false,
  verification_status: 'pending'
};

function generateTestData() {
  console.log('\n=== DADOS DE TESTE PARA REGISTRO ===\n');
  
  console.log('📋 DADOS QUE SERIAM ENVIADOS PARA O SUPABASE:');
  Object.entries(testProviderData).forEach(([key, value]) => {
    console.log(`   ${key}: ${JSON.stringify(value)}`);
  });
  
  console.log('\n💡 INSTRUÇÕES PARA TESTE MANUAL:');
  console.log('1. Acesse o dashboard do Supabase');
  console.log('2. Vá para a tabela "providers"');
  console.log('3. Clique em "Insert" para adicionar um novo registro');
  console.log('4. Use os dados acima para preencher os campos');
  console.log('5. Verifique se todos os campos são aceitos corretamente');
}

// Executar verificação
if (require.main === module) {
  verifyFieldMapping();
  generateTestData();
  
  console.log('\n🎯 PRÓXIMOS PASSOS:');
  console.log('1. Execute o teste manual no Supabase com os dados fornecidos');
  console.log('2. Verifique se não há erros de validação ou constraints');
  console.log('3. Confirme que todos os campos são armazenados corretamente');
}

module.exports = { verifyFieldMapping, generateTestData, testProviderData };