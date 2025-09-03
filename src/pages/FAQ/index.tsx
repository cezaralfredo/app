import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

type FAQItem = {
  question: string;
  answer: string;
  category: 'general' | 'client' | 'provider' | 'payment' | 'equipment';
};

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const faqItems: FAQItem[] = [
    {
      question: 'O que é a EQUIPAMAX?',
      answer: 'A EQUIPAMAX é uma plataforma online que conecta empresas que precisam alugar equipamentos pesados com prestadores de serviços que possuem esses equipamentos. Nosso objetivo é facilitar o processo de locação, tornando-o mais rápido, seguro e eficiente para ambas as partes.',
      category: 'general'
    },
    {
      question: 'Como funciona o processo de aluguel?',
      answer: 'O processo é simples: 1) Busque o equipamento desejado; 2) Envie uma solicitação ao prestador; 3) Negocie os detalhes e valores; 4) Confirme a reserva; 5) Utilize o equipamento conforme combinado; 6) Devolva o equipamento e avalie o serviço.',
      category: 'client'
    },
    {
      question: 'Quais equipamentos estão disponíveis para aluguel?',
      answer: 'Oferecemos uma ampla variedade de equipamentos pesados, incluindo guindastes, retroescavadeiras, empilhadeiras, caminhões munck, tratores, escavadeiras, caminhões pipa, entre outros. A disponibilidade pode variar de acordo com a sua localização.',
      category: 'equipment'
    },
    {
      question: 'Como me cadastrar como prestador de serviços?',
      answer: 'Para se cadastrar como prestador, acesse a opção "Cadastrar" no menu principal e selecione "Sou prestador de serviços". Você precisará fornecer informações sobre sua empresa, documentação necessária e detalhes dos equipamentos disponíveis para aluguel.',
      category: 'provider'
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos diversas formas de pagamento, incluindo cartão de crédito, boleto bancário, transferência bancária e PIX. O prestador de serviços pode definir quais métodos aceita para cada transação.',
      category: 'payment'
    },
    {
      question: 'Como funciona a precificação dos aluguéis?',
      answer: 'Os preços são definidos pelos prestadores de serviços e podem variar de acordo com o tipo de equipamento, período de aluguel, localização e necessidade de operador. Você pode ver os valores por hora, diária ou mensal, além de taxas de mobilização quando aplicáveis.',
      category: 'payment'
    },
    {
      question: 'É possível alugar equipamentos com operador?',
      answer: 'Sim, muitos prestadores oferecem a opção de aluguel com operador qualificado. Esta informação está disponível na descrição de cada equipamento, e geralmente há uma diferença de preço entre o aluguel com e sem operador.',
      category: 'equipment'
    },
    {
      question: 'Como funciona o sistema de avaliações?',
      answer: 'Após cada serviço concluído, clientes e prestadores podem avaliar uns aos outros com notas de 1 a 5 estrelas e comentários. Estas avaliações ajudam a construir a reputação na plataforma e auxiliam outros usuários em suas decisões.',
      category: 'general'
    },
    {
      question: 'Quais documentos são necessários para alugar um equipamento?',
      answer: 'Para alugar, você precisará ter um cadastro completo na plataforma, incluindo documentos da empresa (CNPJ, contrato social) e, dependendo do equipamento, pode ser necessário apresentar documentos específicos como licenças ou certificações. O prestador informará quais documentos são necessários.',
      category: 'client'
    },
    {
      question: 'Como funciona o seguro dos equipamentos?',
      answer: 'Os prestadores são responsáveis por manter seus equipamentos segurados. No entanto, ao alugar, você assinará um termo de responsabilidade sobre o uso adequado do equipamento. Recomendamos verificar as condições de seguro diretamente com o prestador antes de confirmar a locação.',
      category: 'equipment'
    },
    {
      question: 'Qual é a área de cobertura da EQUIPAMAX?',
      answer: 'Atualmente, operamos em todo o território brasileiro. A disponibilidade de equipamentos varia de acordo com a região, e você pode filtrar os resultados por distância para encontrar opções próximas à sua localização.',
      category: 'general'
    },
    {
      question: 'Como receber meus pagamentos como prestador?',
      answer: 'Os pagamentos são processados através da nossa plataforma e transferidos para sua conta bancária cadastrada em até 7 dias úteis após a conclusão do serviço e confirmação pelo cliente. Você pode acompanhar todos os pagamentos pendentes e realizados no seu painel de prestador.',
      category: 'provider'
    },
    {
      question: 'O que fazer em caso de problemas com o equipamento?',
      answer: 'Em caso de problemas, entre em contato imediatamente com o prestador através do chat da plataforma. Se não conseguir resolver diretamente, nossa equipe de suporte está disponível para mediar a situação. Recomendamos documentar qualquer problema com fotos ou vídeos.',
      category: 'client'
    },
    {
      question: 'Como cancelar uma reserva?',
      answer: 'Você pode cancelar uma reserva através do seu painel na plataforma. As políticas de cancelamento variam de acordo com cada prestador e estão disponíveis na página do equipamento. Geralmente, cancelamentos com maior antecedência têm menos ou nenhuma penalidade.',
      category: 'client'
    },
    {
      question: 'Posso negociar o preço diretamente com o prestador?',
      answer: 'Sim, após enviar uma solicitação, você pode negociar detalhes e valores diretamente com o prestador através do chat da plataforma. Recomendamos que todos os acordos sejam documentados na conversa para maior segurança de ambas as partes.',
      category: 'payment'
    }
  ];

  const toggleItem = (question: string) => {
    setOpenItems(prev => ({
      ...prev,
      [question]: !prev[question]
    }));
  };

  const filteredItems = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h1>
        <p className="text-lg text-gray-600">Encontre respostas para as dúvidas mais comuns sobre a EQUIPAMAX</p>
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Todas
        </button>
        <button
          onClick={() => setActiveCategory('general')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'general' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Geral
        </button>
        <button
          onClick={() => setActiveCategory('client')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'client' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Para Clientes
        </button>
        <button
          onClick={() => setActiveCategory('provider')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'provider' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Para Prestadores
        </button>
        <button
          onClick={() => setActiveCategory('payment')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Pagamentos
        </button>
        <button
          onClick={() => setActiveCategory('equipment')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'equipment' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Equipamentos
        </button>
      </div>

      {/* Lista de FAQs */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-gray-50"
              onClick={() => toggleItem(item.question)}
            >
              <span className="text-lg font-medium text-gray-900">{item.question}</span>
              {openItems[item.question] ? (
                <ChevronUpIcon className="h-5 w-5 text-primary-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-primary-500" />
              )}
            </button>
            {openItems[item.question] && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contato para mais dúvidas */}
      <div className="mt-12 text-center p-6 bg-primary-50 rounded-lg">
        <h3 className="text-xl font-medium text-gray-900 mb-2">Não encontrou o que procurava?</h3>
        <p className="text-gray-600 mb-4">Nossa equipe está pronta para ajudar com qualquer dúvida adicional.</p>
        <a
          href="mailto:suporte@equipamax.com.br"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Entre em contato
        </a>
      </div>
    </div>
  );
};

export default FAQ;