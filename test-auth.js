const { createClient } = require('@supabase/supabase-js');

// Credenciais diretamente do arquivo .env
const supabaseUrl = 'https://dujnqluqzirvsdyyxlbi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1am5xbHVxemlydnNkeXl4bGJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMjQ2MzcsImV4cCI6MjAyMDYwMDYzN30.9Qq3v0U1Qv3U3U3U3U3U3U3U3U3U3U3U3U3U3U3U3U';

console.log('🔧 Testando autenticação com Supabase...');
console.log('📋 URL:', supabaseUrl);
console.log('🔑 Chave:', supabaseKey.substring(0, 20) + '...');

// Criar cliente
const supabase = createClient(supabaseUrl, supabaseKey);

// Testar autenticação
async function testAuth() {
  try {
    console.log('\n🔐 Testando login com gerandoparceria@gmail.com...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'gerandoparceria@gmail.com',
      password: 'senha_temporaria' // Você precisará usar a senha real
    });

    if (error) {
      console.log('❌ Erro de autenticação:');
      console.log('Código:', error.code);
      console.log('Mensagem:', error.message);
      console.log('Status:', error.status);
      
      // Verificar se é problema de usuário não encontrado
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 Possível solução:');
        console.log('1. Verifique se o usuário existe no Supabase');
        console.log('2. Execute o script SQL fix-admin-role.sql');
        console.log('3. Confirme o email do usuário');
      }
      
      return;
    }

    console.log('✅ Login bem-sucedido!');
    console.log('Usuário:', data.user.email);
    
  } catch (error) {
    console.log('💥 Erro inesperado:', error.message);
  }
}

// Testar conexão básica
async function testConnection() {
  try {
    console.log('\n🌐 Testando conexão básica...');
    
    const { data, error } = await supabase.from('providers').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erro de conexão:', error.message);
      return;
    }
    
    console.log('✅ Conexão bem-sucedida!');
    
  } catch (error) {
    console.log('💥 Erro inesperado:', error.message);
  }
}

// Executar testes
async function runTests() {
  await testConnection();
  await testAuth();
}

runTests();