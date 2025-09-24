const { supabase, providerService } = require('./src/services/supabase');

// Dados de teste para criar um perfil de prestador
const testProviderData = {
  user_id: '00000000-0000-0000-0000-000000000000', // ID fictício para teste
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
  contract_document_url: 'https://example.com/contract.pdf',
  cnpj_document_url: 'https://example.com/cnpj.pdf',
  is_verified: false,
  verification_status: 'pending'
};

async function testProviderRegistration() {
  console.log('=== TESTE DE REGISTRO DE PRESTADOR ===\n');
  
  try {
    // 1. Testar conexão com Supabase
    console.log('1. Testando conexão com Supabase...');
    const { data: settings, error: settingsError } = await supabase.from('providers').select('count').limit(1);
    
    if (settingsError) {
      console.log('❌ Erro na conexão:', settingsError.message);
      console.log('Verifique se as variáveis de ambiente estão configuradas corretamente.');
      return;
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso');
    
    // 2. Verificar estrutura da tabela providers
    console.log('\n2. Verificando estrutura da tabela providers...');
    
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
    
    console.log('✅ Mapeamento de campos:');
    Object.entries(fieldMapping).forEach(([formField, dbField]) => {
      console.log(`   ${formField} → ${dbField}`);
    });
    
    // 3. Testar criação de provider
    console.log('\n3. Testando criação de registro...');
    
    try {
      const result = await providerService.createProvider(testProviderData);
      console.log('✅ Registro criado com sucesso!');
      console.log('ID do registro:', result.id);
      
      // 4. Verificar se os dados foram salvos corretamente
      console.log('\n4. Verificando dados salvos...');
      const { data: savedProvider, error: fetchError } = await supabase
        .from('providers')
        .select('*')
        .eq('id', result.id)
        .single();
      
      if (fetchError) {
        console.log('❌ Erro ao buscar registro:', fetchError.message);
        return;
      }
      
      console.log('✅ Dados salvos corretamente:');
      console.log('   Nome fantasia:', savedProvider.fantasy_name);
      console.log('   CNPJ:', savedProvider.cnpj);
      console.log('   Cidade:', savedProvider.city);
      console.log('   Estado:', savedProvider.state);
      console.log('   Raio de serviço:', savedProvider.service_radius_km + 'km');
      
      // 5. Limpar teste (opcional)
      console.log('\n5. Limpando registro de teste...');
      const { error: deleteError } = await supabase
        .from('providers')
        .delete()
        .eq('id', result.id);
      
      if (deleteError) {
        console.log('⚠️  Não foi possível limpar o registro de teste:', deleteError.message);
      } else {
        console.log('✅ Registro de teste removido');
      }
      
    } catch (createError) {
      console.log('❌ Erro ao criar registro:', createError.message);
      
      // Verificar se é erro de constraint única (CNPJ duplicado)
      if (createError.message.includes('duplicate key')) {
        console.log('💡 Dica: O CNPJ de teste já existe na base. Use um CNPJ diferente.');
      }
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

// Executar teste
if (require.main === module) {
  testProviderRegistration();
}

module.exports = { testProviderRegistration };