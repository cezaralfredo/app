-- Script para corrigir o problema de privilégios administrativos
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos encontrar o ID do usuário gerandoparceria@gmail.com
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'gerandoparceria@gmail.com';

-- Agora insira o usuário na tabela user_roles com role 'admin'
-- Substitua 'USER_ID_AQUI' pelo ID real do usuário acima
INSERT INTO public.user_roles (user_id, role) SELECT u.id, 'admin' FROM auth.users u WHERE u.email = 'gerandoparceria@gmail.com' ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verifique se a inserção foi bem-sucedida
SELECT 
  ur.id, 
  ur.user_id, 
  u.email, 
  ur.role, 
  ur.created_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE u.email = 'gerandoparceria@gmail.com';