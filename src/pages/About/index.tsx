import React from 'react';
import { Layout } from '../../components/Layout';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Sobre a EQUIPAMAX</h1>
            <p className="mt-4 text-lg text-gray-500">
              Conectando empresas e profissionais aos melhores equipamentos pesados do Brasil.
            </p>
          </div>

          <div className="mt-12">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa História</h2>
                <p className="text-gray-600 mb-4">
                  Fundada em 2023, a EQUIPAMAX nasceu da percepção de uma necessidade crescente no mercado brasileiro: facilitar o acesso a equipamentos pesados para empresas de todos os portes, sem a necessidade de grandes investimentos em compra de maquinário.
                </p>
                <p className="text-gray-600 mb-4">
                  Nossa plataforma foi desenvolvida por profissionais com mais de 15 anos de experiência no setor de construção civil e logística, que identificaram as dificuldades enfrentadas tanto por empresas que precisam alugar equipamentos quanto por locadoras que buscam ampliar seu alcance no mercado.
                </p>
                <p className="text-gray-600">
                  Desde o início, nosso objetivo tem sido criar uma solução tecnológica que simplifique o processo de locação, garantindo transparência, segurança e eficiência para todos os envolvidos.
                </p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
                <p className="text-gray-600 mb-4">
                  Democratizar o acesso a equipamentos pesados no Brasil, conectando prestadores de serviços qualificados a clientes que necessitam de soluções eficientes e econômicas para seus projetos.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-primary-600 mb-2">Inovação</h3>
                    <p className="text-gray-600">Buscamos constantemente novas tecnologias e soluções para melhorar a experiência de nossos usuários.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-primary-600 mb-2">Confiabilidade</h3>
                    <p className="text-gray-600">Garantimos a qualidade dos serviços e equipamentos oferecidos em nossa plataforma.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg text-primary-600 mb-2">Acessibilidade</h3>
                    <p className="text-gray-600">Trabalhamos para que empresas de todos os portes possam ter acesso aos equipamentos necessários para seus projetos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Como Funcionamos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-lg text-primary-600 mb-3">Para Clientes</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">1.</span>
                        <span>Cadastre-se gratuitamente na plataforma</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">2.</span>
                        <span>Busque equipamentos por categoria, localização ou disponibilidade</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">3.</span>
                        <span>Compare preços, avaliações e especificações técnicas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">4.</span>
                        <span>Solicite orçamentos diretamente com os prestadores</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">5.</span>
                        <span>Negocie condições e feche contratos com segurança</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">6.</span>
                        <span>Avalie o serviço após a conclusão</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-primary-600 mb-3">Para Prestadores</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">1.</span>
                        <span>Cadastre sua empresa e passe pelo processo de verificação</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">2.</span>
                        <span>Registre seus equipamentos com fotos e especificações detalhadas</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">3.</span>
                        <span>Defina preços, condições de locação e área de atendimento</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">4.</span>
                        <span>Receba solicitações de orçamento de clientes interessados</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">5.</span>
                        <span>Negocie e feche contratos diretamente pela plataforma</span>
                      </li>
                      <li className="flex items-start">
                        <span className="flex-shrink-0 h-6 w-6 text-primary-600 mr-2">6.</span>
                        <span>Construa sua reputação através de avaliações positivas</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa Equipe</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900">Carlos Silva</h3>
                    <p className="text-primary-600">CEO & Fundador</p>
                    <p className="mt-2 text-gray-500 text-sm">Engenheiro civil com mais de 15 anos de experiência no setor de construção pesada.</p>
                  </div>
                  <div className="text-center">
                    <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900">Ana Oliveira</h3>
                    <p className="text-primary-600">CTO</p>
                    <p className="mt-2 text-gray-500 text-sm">Especialista em tecnologia com foco em marketplaces e plataformas de serviços.</p>
                  </div>
                  <div className="text-center">
                    <div className="h-40 w-40 rounded-full bg-gray-200 mx-auto mb-4"></div>
                    <h3 className="text-lg font-medium text-gray-900">Roberto Santos</h3>
                    <p className="text-primary-600">Diretor Comercial</p>
                    <p className="mt-2 text-gray-500 text-sm">Profissional com vasta experiência no mercado de locação de equipamentos pesados.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossos Números</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-4xl font-bold text-primary-600">+500</p>
                    <p className="text-gray-600 mt-2">Prestadores cadastrados</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary-600">+2.000</p>
                    <p className="text-gray-600 mt-2">Equipamentos disponíveis</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary-600">+5.000</p>
                    <p className="text-gray-600 mt-2">Clientes atendidos</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary-600">+10.000</p>
                    <p className="text-gray-600 mt-2">Locações realizadas</p>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-gray-600">Presente em mais de 100 cidades brasileiras, a EQUIPAMAX está transformando o mercado de locação de equipamentos pesados, tornando-o mais acessível, transparente e eficiente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;