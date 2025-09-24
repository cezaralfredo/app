// Debug das variáveis de ambiente
console.log('=== DEBUG VARIÁVEIS DE AMBIENTE ===');

// Verificar se as variáveis estão definidas
console.log('REACT_APP_SUPABASE_URL definida:', !!process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_ANON_KEY definida:', !!process.env.REACT_APP_SUPABASE_ANON_KEY);

// Verificar valores reais (parciais para segurança)
if (process.env.REACT_APP_SUPABASE_URL) {
  console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
}

if (process.env.REACT_APP_SUPABASE_ANON_KEY) {
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
  console.log('Chave (início):', key.substring(0, 30) + '...');
  console.log('Chave (comprimento):', key.length);
  
  // Verificar partes do JWT
  const parts = key.split('.');
  console.log('Partes do JWT:', parts.length);
  
  if (parts.length === 3) {
    console.log('Parte 1 (header):', parts[0].substring(0, 20) + '...');
    console.log('Parte 2 (payload):', parts[1].substring(0, 20) + '...');
    console.log('Parte 3 (signature):', parts[2].substring(0, 20) + '...');
    
    // Tentar decodificar o payload
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      console.log('Payload decodificado:', {
        iss: payload.iss,
        exp: payload.exp,
        ref: payload.ref,
        role: payload.role
      });
      
      // Verificar expiração
      const now = Math.floor(Date.now() / 1000);
      console.log('Expira em:', new Date(payload.exp * 1000).toLocaleString());
      console.log('Está expirada:', payload.exp < now);
      
    } catch (e) {
      console.log('Erro ao decodificar payload:', e.message);
    }
  } else {
    console.log('ERRO: A chave não tem 3 partes!');
  }
}

console.log('=== FIM DEBUG ===');