// Debug da verificação de admin
import { supabase } from './services/supabase';

async function debugAdminCheck() {
  console.log('=== DEBUG VERIFICAÇÃO ADMIN ===');
  
  try {
    // 1. Verificar usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Usuário autenticado:', user ? user.email : 'Nenhum');
    
    if (!user) {
      console.log('❌ Nenhum usuário autenticado');
      return;
    }
    
    // 2. Verificar diretamente na tabela user_roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);
    
    if (rolesError) {
      console.log('❌ Erro ao buscar user_roles:', rolesError.message);
    } else {
      console.log('Roles do usuário:', userRoles);
      const isAdminInDB = userRoles.some(role => role.role === 'admin');
      console.log('É admin na tabela user_roles:', isAdminInDB);
    }
    
    // 3. Testar a função RPC is_admin
    const { data: isAdminRPC, error: rpcError } = await supabase.rpc('is_admin');
    
    if (rpcError) {
      console.log('❌ Erro na função RPC is_admin:', rpcError.message);
    } else {
      console.log('Resultado da função is_admin():', isAdminRPC);
    }
    
    // 4. Verificar se o email é o designado para admin
    const isDesignatedEmail = user.email === 'gerandoparceria@gmail.com';
    console.log('É email designado para admin:', isDesignatedEmail);
    
  } catch (error) {
    console.log('❌ Erro no debug:', error.message);
  }
  
  console.log('=== FIM DEBUG ===');
}

// Executar quando a página carregar
if (typeof window !== 'undefined') {
  setTimeout(debugAdminCheck, 2000);
}

export default debugAdminCheck;