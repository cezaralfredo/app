# EQUIPAMAX - Marketplace de Aluguel de Equipamentos Pesados

## Sobre o Projeto

EQUIPAMAX é um marketplace que conecta empresas locadoras de equipamentos pesados com clientes que necessitam desses serviços em todo território nacional. A plataforma facilita a busca, comparação e contratação de equipamentos como Munck, Guindaste, Empilhadeira, entre outros.

## Slogan

"Equipamentos pesados, solução leve!"

## Plataformas

- Web (responsivo)
- Android (aplicativo nativo ou PWA)

## Categorias de Equipamentos

1. Munck
2. Guindaste
3. Empilhadeira
4. Pipa (Caminhão Pipa)
5. Guincho/Reboque
6. Escavadeira
7. Trator
8. Betoneira

## Funcionalidades Principais

- Cadastro de prestadores e clientes
- Cadastro detalhado de equipamentos
- Sistema de busca com filtros avançados
- Geolocalização para encontrar equipamentos próximos
- Sistema de solicitação de orçamentos
- Chat interno para comunicação
- Avaliações de serviços
- Integração com WhatsApp
- Notificações push

## Tecnologias Utilizadas

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- PWA

### Backend (Futuro)
- Node.js + Express
- PostgreSQL
- Firebase (notificações push)

### Integrações
- Google Maps API
- Firebase Cloud Messaging
- API Receita Federal (CNPJ)
- WhatsApp Business API

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]

# Entre no diretório do projeto
cd equipamax

# Instale as dependências
npm install
# ou
yarn install

# Execute o projeto em modo de desenvolvimento
npm start
# ou
yarn start
```

## Estrutura do Projeto

```
src/
├── assets/        # Imagens, ícones e outros recursos estáticos
├── components/    # Componentes reutilizáveis
├── contexts/      # Contextos React para gerenciamento de estado
├── hooks/         # Hooks personalizados
├── pages/         # Páginas da aplicação
├── services/      # Serviços e integrações com APIs
├── styles/        # Estilos globais e temas
├── types/         # Definições de tipos TypeScript
├── utils/         # Funções utilitárias
└── App.tsx        # Componente principal da aplicação
```

## Modelo de Monetização

### Fase 1 - Lançamento (Primeiros 3 meses)
- GRATUITO para atrair prestadores e clientes
- Foco em crescimento de base de usuários

### Fase 2 - Monetização Básica
- Taxa de Intermediação: 5-8% sobre transações fechadas pela plataforma
- Plano Básico Prestador: Gratuito (até 5 equipamentos)
- Plano Premium Prestador: R$ 99/mês (equipamentos ilimitados + destaque nas buscas)

## Roadmap de Desenvolvimento

- [x] Definição do escopo do MVP
- [ ] Estrutura básica do projeto
- [ ] Implementação das telas principais
- [ ] Sistema de autenticação e cadastro
- [ ] Sistema de busca e filtros
- [ ] Integração com mapas
- [ ] Chat interno
- [ ] Notificações
- [ ] Testes e correções
- [ ] Deploy da versão MVP

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).