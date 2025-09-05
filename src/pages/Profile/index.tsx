import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Joao Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    document: '123.456.789-00',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim Primavera',
      city: 'Sao Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    notifications: {
      email: true,
      sms: true,
      push: false
    },
    paymentMethods: [
      { id: 1, type: 'credit_card', last4: '4242', brand: 'Visa', expiry: '12/25' },
      { id: 2, type: 'pix', key: 'joao.silva@email.com', keyType: 'email' }
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData({
        ...userData,
        [parent]: {
          ...((userData[parent as keyof typeof userData] as Record<string, any>) || {}),
          [child]: value
        }
      });
    } else {
      setUserData({
        ...userData,
        [name]: value
      });
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [name]: checked
      }
    });
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  };

  const handleAddPaymentMethod = () => {
    alert('Funcionalidade em desenvolvimento');
  };

  const handleRemovePaymentMethod = (id: string | number) => {
    setUserData({
      ...userData,
      paymentMethods: userData.paymentMethods.filter(method => method.id !== id)
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Editar Perfil
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Salvar Alteracoes
                </button>
              </div>
            )}
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`${activeTab === 'personal' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Dados Pessoais
                </button>
                <button
                  onClick={() => setActiveTab('address')}
                  className={`${activeTab === 'address' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Endereco
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`${activeTab === 'payment' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Metodos de Pagamento
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`${activeTab === 'notifications' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Notificacoes
                </button>
              </nav>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome Completo
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                        CPF
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="document"
                          id="document"
                          value={userData.document}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <Link
                        to="/change-password"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        Alterar senha
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                        Rua
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.street"
                          id="address.street"
                          value={userData.address.street}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.number" className="block text-sm font-medium text-gray-700">
                        Numero
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.number"
                          id="address.number"
                          value={userData.address.number}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="address.complement" className="block text-sm font-medium text-gray-700">
                        Complemento
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.complement"
                          id="address.complement"
                          value={userData.address.complement}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="address.neighborhood" className="block text-sm font-medium text-gray-700">
                        Bairro
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.neighborhood"
                          id="address.neighborhood"
                          value={userData.address.neighborhood}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                        CEP
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.zipCode"
                          id="address.zipCode"
                          value={userData.address.zipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                        Cidade
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.city"
                          id="address.city"
                          value={userData.address.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address.state"
                          id="address.state"
                          value={userData.address.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div className="bg-white shadow sm:rounded-lg divide-y divide-gray-200">
                    {userData.paymentMethods.map((method) => (
                      <div key={method.id} className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            {method.type === 'credit_card' ? (
                              <div>
                                <div className="flex items-center">
                                  <span className="text-lg font-medium text-gray-900">{method.brand}</span>
                                  <span className="ml-2 text-sm text-gray-500">**** {method.last4}</span>
                                </div>
                                <p className="text-sm text-gray-500">Expira em {method.expiry}</p>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center">
                                  <span className="text-lg font-medium text-gray-900">Pix</span>
                                </div>
                                <p className="text-sm text-gray-500">{method.key} ({method.keyType})</p>
                              </div>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {isEditing && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleAddPaymentMethod}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Adicionar Metodo de Pagamento
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications.email"
                          name="email"
                          type="checkbox"
                          checked={userData.notifications.email}
                          onChange={handleNotificationChange}
                          disabled={!isEditing}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifications.email" className="font-medium text-gray-700">
                          Notificacoes por Email
                        </label>
                        <p className="text-gray-500">Receba atualizacoes sobre suas solicitacoes e novidades por email.</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications.sms"
                          name="sms"
                          type="checkbox"
                          checked={userData.notifications.sms}
                          onChange={handleNotificationChange}
                          disabled={!isEditing}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifications.sms" className="font-medium text-gray-700">
                          Notificacoes por SMS
                        </label>
                        <p className="text-gray-500">Receba alertas importantes sobre suas solicitacoes por SMS.</p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications.push"
                          name="push"
                          type="checkbox"
                          checked={userData.notifications.push}
                          onChange={handleNotificationChange}
                          disabled={!isEditing}
                          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifications.push" className="font-medium text-gray-700">
                          Notificacoes Push
                        </label>
                        <p className="text-gray-500">Receba notificacoes em tempo real no seu dispositivo.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
