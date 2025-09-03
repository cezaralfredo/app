import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProviderRegisterSchema = Yup.object().shape({
  responsibleName: Yup.string()
    .min(2, 'Nome muito curto')
    .max(50, 'Nome muito longo')
    .required('Nome do responsável é obrigatório'),
  fantasyName: Yup.string()
    .required('Nome fantasia é obrigatório'),
  companyName: Yup.string()
    .required('Razão social é obrigatória'),
  cnpj: Yup.string()
    .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, 'CNPJ inválido. Use o formato: 00.000.000/0000-00')
    .required('CNPJ é obrigatório'),
  mainPhone: Yup.string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999')
    .required('Telefone principal é obrigatório'),
  secondaryPhone: Yup.string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999')
    .nullable(),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  zipCode: Yup.string()
    .matches(/^\d{5}-\d{3}$/, 'CEP inválido. Use o formato: 00000-000')
    .required('CEP é obrigatório'),
  address: Yup.string()
    .required('Endereço é obrigatório'),
  city: Yup.string()
    .required('Cidade é obrigatória'),
  state: Yup.string()
    .required('Estado é obrigatório'),
  serviceRadius: Yup.number()
    .min(1, 'Raio de atendimento deve ser maior que 0')
    .required('Raio de atendimento é obrigatório'),
  website: Yup.string()
    .url('URL inválida'),
  socialMedia: Yup.string(),
  password: Yup.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
  terms: Yup.boolean()
    .oneOf([true], 'Você deve aceitar os termos e condições'),
  contractUpload: Yup.mixed()
    .required('Upload do contrato social é obrigatório')
});

const ProviderRegister: React.FC = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleSubmitStep1 = (values: any) => {
    setFormData(values);
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmitStep2 = async (values: any) => {
    try {
      // Aqui seria implementada a lógica de registro com backend
      // Combinando dados do step 1 com step 2
      const completeData = { ...formData, ...values };
      console.log('Registro de prestador com:', completeData);
      
      // Simular registro bem-sucedido e redirecionar
      navigate('/provider-dashboard', { 
        state: { message: 'Cadastro realizado com sucesso! Agora você pode adicionar seus equipamentos.' } 
      });
    } catch (error) {
      setRegisterError('Falha no cadastro. Tente novamente.');
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
                responsibleName: '',
                fantasyName: '',
                companyName: '',
                cnpj: '',
                mainPhone: '',
                secondaryPhone: '',
                email: '',
                zipCode: '',
                address: '',
                city: '',
                state: '',
                serviceRadius: 50,
                website: '',
                socialMedia: ''
              }}
              validationSchema={Yup.object({
                responsibleName: ProviderRegisterSchema.fields.responsibleName,
                fantasyName: ProviderRegisterSchema.fields.fantasyName,
                companyName: ProviderRegisterSchema.fields.companyName,
                cnpj: ProviderRegisterSchema.fields.cnpj,
                mainPhone: ProviderRegisterSchema.fields.mainPhone,
                secondaryPhone: ProviderRegisterSchema.fields.secondaryPhone,
                email: ProviderRegisterSchema.fields.email,
                zipCode: ProviderRegisterSchema.fields.zipCode,
                address: ProviderRegisterSchema.fields.address,
                city: ProviderRegisterSchema.fields.city,
                state: ProviderRegisterSchema.fields.state,
                serviceRadius: ProviderRegisterSchema.fields.serviceRadius,
                website: ProviderRegisterSchema.fields.website,
                socialMedia: ProviderRegisterSchema.fields.socialMedia
              })}
              onSubmit={handleSubmitStep1}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="responsibleName" className="block text-sm font-medium text-gray-700">
                      Nome do Responsável
                    </label>
                    <div className="mt-1">
                      <Field
                        id="responsibleName"
                        name="responsibleName"
                        type="text"
                        className="input"
                      />
                      <ErrorMessage name="responsibleName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="fantasyName" className="block text-sm font-medium text-gray-700">
                      Nome Fantasia
                    </label>
                    <div className="mt-1">
                      <Field
                        id="fantasyName"
                        name="fantasyName"
                        type="text"
                        className="input"
                      />
                      <ErrorMessage name="fantasyName" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                      Razão Social
                    </label>
                    <div className="mt-1">
                      <Field
                        id="companyName"
                        name="companyName"
                        type="text"
                        className="input"
                      />
                      <ErrorMessage name="companyName" component="div" className="mt-1 text-sm text-red-600" />
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

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="input"
                      />
                      <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        CEP
                      </label>
                      <div className="mt-1">
                        <Field
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          placeholder="00000-000"
                          className="input"
                        />
                        <ErrorMessage name="zipCode" component="div" className="mt-1 text-sm text-red-600" />
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
                        />
                        <ErrorMessage name="serviceRadius" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Endereço Completo
                    </label>
                    <div className="mt-1">
                      <Field
                        id="address"
                        name="address"
                        type="text"
                        className="input"
                      />
                      <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        Cidade
                      </label>
                      <div className="mt-1">
                        <Field
                          id="city"
                          name="city"
                          type="text"
                          className="input"
                        />
                        <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        Estado
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
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                      Website (opcional)
                    </label>
                    <div className="mt-1">
                      <Field
                        id="website"
                        name="website"
                        type="text"
                        placeholder="https://www.seusite.com.br"
                        className="input"
                      />
                      <ErrorMessage name="website" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700">
                      Instagram/Facebook (opcional)
                    </label>
                    <div className="mt-1">
                      <Field
                        id="socialMedia"
                        name="socialMedia"
                        type="text"
                        placeholder="@suaempresa"
                        className="input"
                      />
                      <ErrorMessage name="socialMedia" component="div" className="mt-1 text-sm text-red-600" />
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
                      <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                        termos e condições
                      </a>
                    </label>
                  </div>
                  <ErrorMessage name="terms" component="div" className="mt-1 text-sm text-red-600" />

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
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