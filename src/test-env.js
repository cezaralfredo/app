// Teste rápido para verificar variáveis de ambiente
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? process.env.REACT_APP_SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'undefined');

// Verificar se a chave tem 3 partes
if (process.env.REACT_APP_SUPABASE_ANON_KEY) {
  const parts = process.env.REACT_APP_SUPABASE_ANON_KEY.split('.');
  console.log('Partes do JWT:', parts.length);
  console.log('Parte 1:', parts[0]?.substring(0, 10) + '...');
  console.log('Parte 2:', parts[1]?.substring(0, 10) + '...');
  console.log('Parte 3:', parts[2]?.substring(0, 10) + '...');
}