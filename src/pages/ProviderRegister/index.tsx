import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useProviderRegistration, useCepSearch } from '../../hooks/useProviderRegistration';

const ProviderRegisterSchema = Yup.object().shape({
  // Dados básicos
  responsibleName: Yup.string()
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo')
    .required('Nome do responsável é obrigatório'),
  responsibleDocument: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato: 000.000.000-00')
    .required('CPF do responsável é obrigatório'),
  
  // Dados da empresa
  fantasyName: Yup.string()
    .max(200, 'Nome fantasia muito longo')
    .required('Nome fantasia é obrigatório'),
  companyName: Yup.string()
    .max(200, 'Razão social muito longa')
    .required('Razão social é obrigatória'),
  cnpj: Yup.string()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido. Use o formato: 00.000.000/0000-00')
    .required('CNPJ é obrigatório'),
  stateRegistration: Yup.string()
    .max(50, 'Inscrição estadual muito longa'),
  municipalRegistration: Yup.string()
    .max(50, 'Inscrição municipal muito longa'),
  
  // Contato
  mainPhone: Yup.string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999')
    .required('Telefone principal é obrigatório'),
  secondaryPhone: Yup.string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999')
    .nullable(),
  whatsappPhone: Yup.string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999')
    .required('WhatsApp é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  
  // Endereço
  zipCode: Yup.string()
    .matches(/^\d{5}-\d{3}$/, 'CEP inválido. Use o formato: 00000-000')
    .required('CEP é obrigatório'),
  address: Yup.string()
    .max(300, 'Endereço muito longo')
    .required('Endereço é obrigatório'),
  number: Yup.string()
    .max(20, 'Número muito longo')
    .required('Número é obrigatório'),
  complement: Yup.string()
    .max(200, 'Complemento muito longo'),
  neighborhood: Yup.string()
    .max(100, 'Bairro muito longo')
    .required('Bairro é obrigatório'),
  city: Yup.string()
    .max(100, 'Cidade muito longa')
    .required('Cidade é obrigatória'),
  state: Yup.string()
    .length(2, 'Estado deve ter 2 caracteres')
    .required('Estado é obrigatório'),
  
  // Serviços
  serviceRadius: Yup.number()
    .min(1, 'Raio de atendimento deve ser maior que 0')
    .max(1000, 'Raio de atendimento muito grande')
    .required('Raio de atendimento é obrigatório'),
  serviceCities: Yup.array()
    .of(Yup.string())
    .min(1, 'Selecione pelo menos uma cidade'),
  serviceStates: Yup.array()
    .of(Yup.string())
    .min(1, 'Selecione pelo menos um estado'),
  
  // Redes sociais
  website: Yup.string()
    .url('URL inválida'),
  instagram: Yup.string()
    .max(100, 'Instagram muito longo'),
  facebook: Yup.string()
    .max(100, 'Facebook muito longo'),
  
  // Segurança
  password: Yup.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .matches(/\d/, 'Senha deve conter pelo menos um número')
    .matches(/[^a-zA-Z0-9]/, 'Senha deve conter pelo menos um caractere especial')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
  
  // Termos e documentos
  terms: Yup.boolean()
    .oneOf([true], 'Você deve aceitar os termos e condições')
    .required('Aceite dos termos é obrigatório'),
  contractUpload: Yup.mixed()
    .test('fileSize', 'Arquivo muito grande (máx. 5MB)', (value) => 
      !value || (value && (value as any).size <= 5 * 1024 * 1024)
    )
    .test('fileType', 'Formato não suportado', (value) =>
      !value || (value && ['application/pdf', 'image/jpeg', 'image/png'].includes((value as any).type))
    )
    .required('Upload do contrato social é obrigatório'),
  cnpjDocumentUpload: Yup.mixed()
    .test('fileSize', 'Arquivo muito grande (máx. 5MB)', (value) => 
      !value || (value && (value as any).size <= 5 * 1024 * 1024)
    )
    .test('fileType', 'Formato não suportado', (value) =>
      !value || (value && ['application/pdf', 'image/jpeg', 'image/png'].includes((value as any).type))
    )
    .required('Upload do CNPJ é obrigatório')
});

const ProviderRegister: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error: registerError,
    currentStep,
    step1Data,
    handleStep1Submit,
    handleStep2Submit,
    goBackToStep1,
    clearError
  } = useProviderRegistration({
    onSuccess: (provider) => {
      navigate('/provider/dashboard', {
        replace: true,
        state: { success: true, message: 'Cadastro de fornecedor concluído com sucesso!' }
      });
    },
    onError: (error) => {
      console.error('Erro no cadastro:', error);
    }
  });

  const { searchCep, addressData, isLoading: cepLoading, error: cepError } = useCepSearch();

  const handleSubmitStep1 = async (values: any) => {
    await handleStep1Submit(values);
    window.scrollTo(0, 0);
  };

  const handleSubmitStep2 = async (values: any) => {
    await handleStep2Submit(values);
  };

  const handleCepBlur = async (cep: string, setFieldValue: any) => {
    if (cep && cep.length === 9) {
      const addressData = await searchCep(cep);
      if (addressData) {
        setFieldValue('address', addressData.logradouro || '');
        setFieldValue('neighborhood', addressData.bairro || '');
        setFieldValue('city', addressData.localidade || '');
        setFieldValue('state', addressData.uf || '');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="EQUIPAMAX"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Cadastro de Prestador
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {currentStep === 1 ? 'Etapa 1: Dados da Empresa' : 'Etapa 2: Documentação e Finalização'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {registerError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{registerError}</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 ? (
            <Formik
              initialValues={{
                // Dados básicos
                responsibleName: '',
                responsibleDocument: '',
                
                // Dados da empresa
                fantasyName: '',
                companyName: '',
                cnpj: '',
                stateRegistration: '',
                municipalRegistration: '',
                
                // Contato
                mainPhone: '',
                secondaryPhone: '',
                whatsappPhone: '',
                email: '',
                
                // Endereço
                zipCode: '',
                address: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                
                // Serviços
                serviceRadius: 50,
                serviceCities: [],
                serviceStates: [],
                
                // Redes sociais
                website: '',
                instagram: '',
                facebook: ''
              }}
              validationSchema={Yup.object({
                responsibleName: ProviderRegisterSchema.fields.responsibleName,
                responsibleDocument: ProviderRegisterSchema.fields.responsibleDocument,
                fantasyName: ProviderRegisterSchema.fields.fantasyName,
                companyName: ProviderRegisterSchema.fields.companyName,
                cnpj: ProviderRegisterSchema.fields.cnpj,
                stateRegistration: ProviderRegisterSchema.fields.stateRegistration,
                municipalRegistration: ProviderRegisterSchema.fields.municipalRegistration,
                mainPhone: ProviderRegisterSchema.fields.mainPhone,
                secondaryPhone: ProviderRegisterSchema.fields.secondaryPhone,
                whatsappPhone: ProviderRegisterSchema.fields.whatsappPhone,
                email: ProviderRegisterSchema.fields.email,
                zipCode: ProviderRegisterSchema.fields.zipCode,
                address: ProviderRegisterSchema.fields.address,
                number: ProviderRegisterSchema.fields.number,
                complement: ProviderRegisterSchema.fields.complement,
                neighborhood: ProviderRegisterSchema.fields.neighborhood,
                city: ProviderRegisterSchema.fields.city,
                state: ProviderRegisterSchema.fields.state,
                serviceRadius: ProviderRegisterSchema.fields.serviceRadius,
                serviceCities: ProviderRegisterSchema.fields.serviceCities,
                serviceStates: ProviderRegisterSchema.fields.serviceStates,
                website: ProviderRegisterSchema.fields.website,
                instagram: ProviderRegisterSchema.fields.instagram,
                facebook: ProviderRegisterSchema.fields.facebook
              })}
              onSubmit={handleSubmitStep1}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700">
                        Nome do Responsável *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="responsibleName"
                          name="responsibleName"
                          type="text"
                          className="input"
                          placeholder="João da Silva"
                        />
                        <ErrorMessage name="responsibleName" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="responsibleDocument" className="block text-sm font-medium text-gray-700">
                        CPF do Responsável *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="responsibleDocument"
                          name="responsibleDocument"
                          type="text"
                          className="input"
                          placeholder="000.000.000-00"
                        />
                        <ErrorMessage name="responsibleDocument" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fantasyName" className="block text-sm font-medium text-gray-700">
                        Nome Fantasia *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="fantasyName"
                          name="fantasyName"
                          type="text"
                          className="input"
                          placeholder="Minha Empresa LTDA"
                        />
                        <ErrorMessage name="fantasyName" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                        Razão Social *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="companyName"
                          name="companyName"
                          type="text"
                          className="input"
                          placeholder="Minha Empresa Comércio e Serviços LTDA"
                        />
                        <ErrorMessage name="companyName" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                        CNPJ *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="cnpj"
                          name="cnpj"
                          type="text"
                          placeholder="00.000.000/0000-00"
                          className="input"
                        />
                        <ErrorMessage name="cnpj" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="stateRegistration" className="block text-sm font-medium text-gray-700">
                        Inscrição Estadual
                      </label>
                      <div className="mt-1">
                        <Field
                          id="stateRegistration"
                          name="stateRegistration"
                          type="text"
                          className="input"
                          placeholder="000.000.000"
                        />
                        <ErrorMessage name="stateRegistration" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="municipalRegistration" className="block text-sm font-medium text-gray-700">
                        Inscrição Municipal
                      </label>
                      <div className="mt-1">
                        <Field
                          id="municipalRegistration"
                          name="municipalRegistration"
                          type="text"
                          className="input"
                          placeholder="000000"
                        />
                        <ErrorMessage name="municipalRegistration" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                      CNPJ
                    </label>
                    <div className="mt-1">
                      <Field
                        id="cnpj"
                        name="cnpj"
                        type="text"
                        placeholder="00.000.000/0000-00"
                        className="input"
                      />
                      <ErrorMessage name="cnpj" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mainPhone" className="block text-sm font-medium text-gray-700">
                      Telefone Principal (WhatsApp)
                    </label>
                    <div className="mt-1">
                      <Field
                        id="mainPhone"
                        name="mainPhone"
                        type="text"
                        placeholder="(99) 99999-9999"
                        className="input"
                      />
                      <ErrorMessage name="mainPhone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="secondaryPhone" className="block text-sm font-medium text-gray-700">
                      Telefone Secundário
                    </label>
                    <div className="mt-1">
                      <Field
                        id="secondaryPhone"
                        name="secondaryPhone"
                        type="text"
                        placeholder="(99) 99999-9999"
                        className="input"
                      />
                      <ErrorMessage name="secondaryPhone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className="input"
                          placeholder="seu@email.com"
                        />
                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefone *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="phone"
                          name="phone"
                          type="tel"
                          className="input"
                          placeholder="(11) 99999-9999"
                        />
                        <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="whatsappPhone" className="block text-sm font-medium text-gray-700">
                        WhatsApp
                      </label>
                      <div className="mt-1">
                        <Field
                          id="whatsappPhone"
                          name="whatsappPhone"
                          type="tel"
                          className="input"
                          placeholder="(11) 99999-9999"
                        />
                        <ErrorMessage name="whatsappPhone" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <div className="mt-1">
                        <Field
                          id="website"
                          name="website"
                          type="url"
                          className="input"
                          placeholder="https://www.suaempresa.com.br"
                        />
                        <ErrorMessage name="website" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        CEP *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          placeholder="00000-000"
                          className="input"
                          onBlur={handleCepBlur}
                        />
                        <ErrorMessage name="zipCode" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                        Logradouro *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="street"
                          name="street"
                          type="text"
                          className="input"
                          placeholder="Rua das Flores"
                        />
                        <ErrorMessage name="street" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                        Número *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="number"
                          name="number"
                          type="text"
                          className="input"
                          placeholder="123"
                        />
                        <ErrorMessage name="number" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="complement" className="block text-sm font-medium text-gray-700">
                        Complemento
                      </label>
                      <div className="mt-1">
                        <Field
                          id="complement"
                          name="complement"
                          type="text"
                          className="input"
                          placeholder="Apto 101"
                        />
                        <ErrorMessage name="complement" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                        Bairro *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="neighborhood"
                          name="neighborhood"
                          type="text"
                          className="input"
                          placeholder="Centro"
                        />
                        <ErrorMessage name="neighborhood" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        Cidade *
                      </label>
                      <div className="mt-1">
                        <Field
                          id="city"
                          name="city"
                          type="text"
                          className="input"
                          placeholder="São Paulo"
                        />
                        <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        Estado *
                      </label>
                      <div className="mt-1">
                        <Field as="select" id="state" name="state" className="input">
                          <option value="">Selecione...</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espírito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </Field>
                        <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="serviceRadius" className="block text-sm font-medium text-gray-700">
                        Raio de Atendimento (km)
                      </label>
                      <div className="mt-1">
                        <Field
                          id="serviceRadius"
                          name="serviceRadius"
                          type="number"
                          min="1"
                          className="input"
                          placeholder="50"
                        />
                        <ErrorMessage name="serviceRadius" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>



                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                        Instagram
                      </label>
                      <div className="mt-1">
                        <Field
                          id="instagram"
                          name="instagram"
                          type="text"
                          className="input"
                          placeholder="@suaempresa"
                        />
                        <ErrorMessage name="instagram" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                        Facebook
                      </label>
                      <div className="mt-1">
                        <Field
                          id="facebook"
                          name="facebook"
                          type="text"
                          className="input"
                          placeholder="suaempresa"
                        />
                        <ErrorMessage name="facebook" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="serviceCities" className="block text-sm font-medium text-gray-700">
                      Cidades de Atendimento *
                    </label>
                    <div className="mt-1">
                      <Field
                        id="serviceCities"
                        name="serviceCities"
                        as="textarea"
                        rows={3}
                        className="input"
                        placeholder="São Paulo, Campinas, Santos, Guarulhos (separadas por vírgula)"
                      />
                      <ErrorMessage name="serviceCities" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="serviceStates" className="block text-sm font-medium text-gray-700">
                      Estados de Atendimento *
                    </label>
                    <div className="mt-1">
                      <Field
                        id="serviceStates"
                        name="serviceStates"
                        as="select"
                        multiple
                        className="input h-32"
                      >
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                      </Field>
                      <ErrorMessage name="serviceStates" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-2"
                    >
                      Continuar
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{
                password: '',
                confirmPassword: '',
                terms: false,
                contractUpload: null
              }}
              validationSchema={Yup.object({
                password: ProviderRegisterSchema.fields.password,
                confirmPassword: ProviderRegisterSchema.fields.confirmPassword,
                terms: ProviderRegisterSchema.fields.terms,
                contractUpload: ProviderRegisterSchema.fields.contractUpload
              })}
              onSubmit={handleSubmitStep2}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="contractUpload" className="block text-sm font-medium text-gray-700">
                      Upload do Contrato Social
                    </label>
                    <div className="mt-1">
                      <input
                        id="contractUpload"
                        name="contractUpload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(event) => {
                          setFieldValue('contractUpload', event.currentTarget.files?.[0] || null);
                        }}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary-50 file:text-primary-700
                          hover:file:bg-primary-100"
                      />
                      <ErrorMessage name="contractUpload" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Senha
                    </label>
                    <div className="mt-1">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        className="input"
                      />
                      <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirme a Senha
                    </label>
                    <div className="mt-1">
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="input"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Field
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                      Eu aceito os{' '}
                      <button type="button" className="font-medium text-primary-600 hover:text-primary-500">
                        termos e condições
                      </button>
                    </label>
                  </div>
                  <ErrorMessage name="terms" component="div" className="mt-1 text-sm text-red-600" />

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={goBackToStep1}
                      className="flex-1 btn-secondary py-2"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 btn-primary py-2"
                    >
                      {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegister;