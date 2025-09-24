import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Nome muito curto')
    .max(50, 'Nome muito longo')
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  phone: Yup.string()
    .matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Formato inválido. Use (99) 99999-9999')
    .required('Telefone é obrigatório'),
  document: Yup.string()
    .required('CPF/CNPJ é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas não conferem')
    .required('Confirmação de senha é obrigatória'),
  terms: Yup.boolean()
    .oneOf([true], 'Você deve aceitar os termos e condições')
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    try {
      // Aqui seria implementada a lógica de registro com backend
      // Por enquanto, apenas simulamos um registro bem-sucedido
      console.log('Registro com:', values);
      
      // Simular registro bem-sucedido e redirecionar
      navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' } });
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Crie sua conta</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            entre com sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              document: '',
              password: '',
              confirmPassword: '',
              terms: false
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {registerError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
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

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome Completo
                  </label>
                  <div className="mt-1">
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className="input"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
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
                      autoComplete="email"
                      className="input"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefone (WhatsApp)
                  </label>
                  <div className="mt-1">
                    <Field
                      id="phone"
                      name="phone"
                      type="text"
                      placeholder="(99) 99999-9999"
                      className="input"
                    />
                    <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                <div>
                  <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                    CPF ou CNPJ
                  </label>
                  <div className="mt-1">
                    <Field
                      id="document"
                      name="document"
                      type="text"
                      className="input"
                    />
                    <ErrorMessage name="document" component="div" className="mt-1 text-sm text-red-600" />
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

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-2"
                  >
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Faça login
              </a>
            </p>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              É uma empresa prestadora de serviços?{' '}
              <Link to="/provider/register" className="font-medium text-primary-600 hover:text-primary-500">
                Cadastre-se como prestador
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;