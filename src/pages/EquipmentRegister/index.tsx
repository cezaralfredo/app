import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const equipmentCategories = [
  { id: 'munck', name: 'Munck' },
  { id: 'guindaste', name: 'Guindaste' },
  { id: 'empilhadeira', name: 'Empilhadeira' },
  { id: 'pipa', name: 'Pipa (Caminhão Pipa)' },
  { id: 'guincho', name: 'Guincho/Reboque' },
  { id: 'escavadeira', name: 'Escavadeira' },
  { id: 'trator', name: 'Trator' },
  { id: 'betoneira', name: 'Betoneira' },
];

// Esquema de validação base para todos os equipamentos
const BaseEquipmentSchema = Yup.object().shape({
  category: Yup.string().required('Categoria é obrigatória'),
  brand: Yup.string().required('Marca é obrigatória'),
  model: Yup.string().required('Modelo é obrigatório'),
  year: Yup.number()
    .required('Ano de fabricação é obrigatório')
    .min(1950, 'Ano inválido')
    .max(new Date().getFullYear(), 'Ano não pode ser futuro'),
  hourPrice: Yup.number()
    .required('Preço por hora é obrigatório')
    .min(1, 'Preço deve ser maior que zero'),
  dayPrice: Yup.number()
    .required('Preço por dia é obrigatório')
    .min(1, 'Preço deve ser maior que zero'),
  monthPrice: Yup.number()
    .min(0, 'Preço não pode ser negativo'),
  mobilizationFee: Yup.number()
    .required('Taxa de mobilização é obrigatória')
    .min(0, 'Taxa não pode ser negativa'),
  includedDistance: Yup.number()
    .required('Distância incluída é obrigatória')
    .min(0, 'Distância não pode ser negativa'),
  additionalKmPrice: Yup.number()
    .required('Valor por KM adicional é obrigatório')
    .min(0, 'Valor não pode ser negativo'),
  operatorIncluded: Yup.boolean(),
  operatorPrice: Yup.number()
  .when('operatorIncluded', {
    is: (val: boolean) => val === false,
    then: (schema) => schema.min(0, 'Valor não pode ser negativo'),
    otherwise: (schema) => schema.notRequired(),
  }),
  minRentalPeriod: Yup.number()
    .required('Período mínimo de locação é obrigatório')
    .min(1, 'Período deve ser maior que zero'),
  minRentalUnit: Yup.string()
    .required('Unidade de período é obrigatória')
    .oneOf(['hours', 'days'], 'Unidade inválida'),
  photos: Yup.array()
    .min(3, 'Mínimo de 3 fotos requeridas')
    .max(10, 'Máximo de 10 fotos permitidas'),
  videoUrl: Yup.string().url('URL inválida'),
  description: Yup.string(),
  certificates: Yup.array(),
  isActive: Yup.boolean(),
});

// Esquemas específicos por categoria
const MunckSchema = Yup.object().shape({
  loadCapacity: Yup.number()
    .required('Capacidade de carga é obrigatória')
    .min(0.1, 'Capacidade deve ser maior que zero'),
  maxHorizontalReach: Yup.number()
    .required('Alcance máximo horizontal é obrigatório')
    .min(0.1, 'Alcance deve ser maior que zero'),
  maxLiftHeight: Yup.number()
    .required('Altura máxima de elevação é obrigatória')
    .min(0.1, 'Altura deve ser maior que zero'),
  boomType: Yup.string()
    .required('Tipo de lança é obrigatório')
    .oneOf(['articulated', 'telescopic'], 'Tipo de lança inválido'),
  loadMoment: Yup.number()
    .required('Momento de carga é obrigatório')
    .min(0.1, 'Momento deve ser maior que zero'),
  remoteControl: Yup.boolean(),
});

const GuindasteSchema = Yup.object().shape({
  maxLiftCapacity: Yup.number()
    .required('Capacidade máxima de içamento é obrigatória')
    .min(0.1, 'Capacidade deve ser maior que zero'),
  maxBoomHeight: Yup.number()
    .required('Altura máxima com lança é obrigatória')
    .min(0.1, 'Altura deve ser maior que zero'),
  boomLength: Yup.number()
    .required('Comprimento da lança é obrigatório')
    .min(0.1, 'Comprimento deve ser maior que zero'),
  operationRadius: Yup.number()
    .required('Raio de operação é obrigatório')
    .min(0.1, 'Raio deve ser maior que zero'),
  type: Yup.string()
    .required('Tipo é obrigatório')
    .oneOf(['mobile', 'tower', 'crawler'], 'Tipo inválido'),
  extendedBoomCapacity: Yup.number()
    .min(0, 'Capacidade não pode ser negativa'),
});

const EmpilhadeiraSchema = Yup.object().shape({
  loadCapacity: Yup.number()
    .required('Capacidade de carga é obrigatória')
    .min(0.1, 'Capacidade deve ser maior que zero'),
  maxLiftHeight: Yup.number()
    .required('Altura máxima de elevação é obrigatória')
    .min(0.1, 'Altura deve ser maior que zero'),
  fuelType: Yup.string()
    .required('Tipo de combustível é obrigatório')
    .oneOf(['electric', 'lpg', 'diesel'], 'Tipo de combustível inválido'),
  forkType: Yup.string()
    .required('Tipo de garfo é obrigatório'),
  forkWidth: Yup.number()
    .min(0, 'Largura não pode ser negativa'),
  towerType: Yup.string()
    .required('Torre é obrigatória')
    .oneOf(['triplex', 'duplex', 'simple'], 'Tipo de torre inválido'),
});

const PipaSchema = Yup.object().shape({
  tankCapacity: Yup.number()
    .required('Capacidade do tanque é obrigatória')
    .min(1, 'Capacidade deve ser maior que zero'),
  pumpType: Yup.string()
    .required('Tipo de bomba é obrigatório'),
  flowRate: Yup.number()
    .required('Vazão é obrigatória')
    .min(0.1, 'Vazão deve ser maior que zero'),
  hoseLength: Yup.number()
    .required('Comprimento da mangueira é obrigatório')
    .min(0.1, 'Comprimento deve ser maior que zero'),
  waterType: Yup.string()
    .required('Tipo de água transportada é obrigatório'),
});

const GuinchoSchema = Yup.object().shape({
  towingCapacity: Yup.number()
    .required('Capacidade de reboque é obrigatória')
    .min(0.1, 'Capacidade deve ser maior que zero'),
  type: Yup.string()
    .required('Tipo é obrigatório')
    .oneOf(['platform', 'deltawing'], 'Tipo inválido'),
  platformLength: Yup.number()
    .required('Comprimento da plataforma é obrigatório')
    .min(0.1, 'Comprimento deve ser maior que zero'),
  service24h: Yup.boolean(),
  vehicleTypes: Yup.array()
    .of(Yup.string())
    .required('Tipos de veículos atendidos é obrigatório')
    .min(1, 'Selecione pelo menos um tipo de veículo'),
});

const EscavadeiraSchema = Yup.object().shape({
  operationalWeight: Yup.number()
    .required('Peso operacional é obrigatório')
    .min(0.1, 'Peso deve ser maior que zero'),
  maxDiggingDepth: Yup.number()
    .required('Profundidade máxima de escavação é obrigatória')
    .min(0.1, 'Profundidade deve ser maior que zero'),
  bucketCapacity: Yup.number()
    .required('Capacidade da caçamba é obrigatória')
    .min(0.01, 'Capacidade deve ser maior que zero'),
  type: Yup.string()
    .required('Tipo é obrigatório')
    .oneOf(['hydraulic', 'pc', 'crawler', 'wheeled'], 'Tipo inválido'),
  maxReach: Yup.number()
    .required('Alcance máximo é obrigatório')
    .min(0.1, 'Alcance deve ser maior que zero'),
});

const TratorSchema = Yup.object().shape({
  power: Yup.number()
    .required('Potência é obrigatória')
    .min(1, 'Potência deve ser maior que zero'),
  type: Yup.string()
    .required('Tipo é obrigatório')
    .oneOf(['crawler', 'wheeled'], 'Tipo inválido'),
  traction: Yup.string()
    .required('Tração é obrigatória')
    .oneOf(['4x4', '4x2'], 'Tração inválida'),
  availableImplements: Yup.array()
    .of(Yup.string())
    .required('Implementos disponíveis é obrigatório')
    .min(1, 'Selecione pelo menos um implemento'),
  closedCabin: Yup.boolean(),
});

const BetoneiraSchema = Yup.object().shape({
  capacity: Yup.number()
    .required('Capacidade é obrigatória')
    .min(0.1, 'Capacidade deve ser maior que zero'),
  type: Yup.string()
    .required('Tipo é obrigatório')
    .oneOf(['fixed', 'mobile', 'truck'], 'Tipo inválido'),
  motorType: Yup.string()
    .required('Tipo de motor é obrigatório')
    .oneOf(['electric', 'diesel'], 'Tipo de motor inválido'),
  productionPerHour: Yup.number()
    .required('Produção por hora é obrigatória')
    .min(0.1, 'Produção deve ser maior que zero'),
  selfLoading: Yup.boolean(),
});

const EquipmentRegister: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Função para obter o esquema de validação específico da categoria
  const getCategorySchema = (category: string) => {
    switch (category) {
      case 'munck':
        return MunckSchema;
      case 'guindaste':
        return GuindasteSchema;
      case 'empilhadeira':
        return EmpilhadeiraSchema;
      case 'pipa':
        return PipaSchema;
      case 'guincho':
        return GuinchoSchema;
      case 'escavadeira':
        return EscavadeiraSchema;
      case 'trator':
        return TratorSchema;
      case 'betoneira':
        return BetoneiraSchema;
      default:
        return Yup.object();
    }
  };

  // Função para obter os valores iniciais específicos da categoria
  const getCategoryInitialValues = (category: string) => {
    const baseValues = {
      category,
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      hourPrice: '',
      dayPrice: '',
      monthPrice: '',
      mobilizationFee: '',
      includedDistance: 10,
      additionalKmPrice: '',
      operatorIncluded: true,
      operatorPrice: '',
      minRentalPeriod: 4,
      minRentalUnit: 'hours',
      photos: [],
      videoUrl: '',
      description: '',
      certificates: [],
      isActive: true,
    };

    switch (category) {
      case 'munck':
        return {
          ...baseValues,
          loadCapacity: '',
          maxHorizontalReach: '',
          maxLiftHeight: '',
          boomType: 'articulated',
          loadMoment: '',
          remoteControl: false,
        };
      case 'guindaste':
        return {
          ...baseValues,
          maxLiftCapacity: '',
          maxBoomHeight: '',
          boomLength: '',
          operationRadius: '',
          type: 'mobile',
          extendedBoomCapacity: '',
        };
      case 'empilhadeira':
        return {
          ...baseValues,
          loadCapacity: '',
          maxLiftHeight: '',
          fuelType: 'diesel',
          forkType: '',
          forkWidth: '',
          towerType: 'duplex',
        };
      case 'pipa':
        return {
          ...baseValues,
          tankCapacity: '',
          pumpType: '',
          flowRate: '',
          hoseLength: '',
          waterType: '',
        };
      case 'guincho':
        return {
          ...baseValues,
          towingCapacity: '',
          type: 'platform',
          platformLength: '',
          service24h: false,
          vehicleTypes: [],
        };
      case 'escavadeira':
        return {
          ...baseValues,
          operationalWeight: '',
          maxDiggingDepth: '',
          bucketCapacity: '',
          type: 'hydraulic',
          maxReach: '',
        };
      case 'trator':
        return {
          ...baseValues,
          power: '',
          type: 'wheeled',
          traction: '4x4',
          availableImplements: [],
          closedCabin: false,
        };
      case 'betoneira':
        return {
          ...baseValues,
          capacity: '',
          type: 'mobile',
          motorType: 'electric',
          productionPerHour: '',
          selfLoading: false,
        };
      default:
        return baseValues;
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 10));
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newCertificates = Array.from(e.target.files);
      setCertificates(prev => [...prev, ...newCertificates]);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Aqui seria implementada a lógica de registro com backend
      // Combinando dados do formulário com arquivos
      const formData = new FormData();
      
      // Adicionar dados do formulário
      Object.keys(values).forEach(key => {
        if (key !== 'photos' && key !== 'certificates') {
          formData.append(key, values[key]);
        }
      });
      
      // Adicionar fotos
      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });
      
      // Adicionar certificados
      certificates.forEach((cert, index) => {
        formData.append(`certificate_${index}`, cert);
      });
      
      console.log('Registro de equipamento com:', values, photos, certificates);
      
      // Simular registro bem-sucedido e redirecionar
      navigate('/provider/dashboard', {
        replace: true,
        state: { success: true, message: 'Equipamento cadastrado com sucesso!' }
      });
    } catch (error) {
      setRegisterError('Falha no cadastro do equipamento. Tente novamente.');
    }
  };

  // Renderizar campos específicos da categoria
  const renderCategoryFields = (category: string) => {
    switch (category) {
      case 'munck':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="loadCapacity" className="block text-sm font-medium text-gray-700">
                  Capacidade de Carga (ton)*
                </label>
                <Field
                  id="loadCapacity"
                  name="loadCapacity"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="loadCapacity" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label htmlFor="maxHorizontalReach" className="block text-sm font-medium text-gray-700">
                  Alcance Máximo Horizontal (m)*
                </label>
                <Field
                  id="maxHorizontalReach"
                  name="maxHorizontalReach"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="maxHorizontalReach" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="maxLiftHeight" className="block text-sm font-medium text-gray-700">
                  Altura Máxima de Elevação (m)*
                </label>
                <Field
                  id="maxLiftHeight"
                  name="maxLiftHeight"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="maxLiftHeight" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label htmlFor="boomType" className="block text-sm font-medium text-gray-700">
                  Tipo de Lança*
                </label>
                <Field as="select" id="boomType" name="boomType" className="input">
                  <option value="articulated">Articulada</option>
                  <option value="telescopic">Telescópica</option>
                </Field>
                <ErrorMessage name="boomType" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="loadMoment" className="block text-sm font-medium text-gray-700">
                  Momento de Carga (ton.m)*
                </label>
                <Field
                  id="loadMoment"
                  name="loadMoment"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="loadMoment" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label htmlFor="remoteControl" className="block text-sm font-medium text-gray-700">
                  Controle Remoto
                </label>
                <div className="mt-2">
                  <Field
                    id="remoteControl"
                    name="remoteControl"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remoteControl" className="ml-2 text-sm text-gray-700">
                    Possui controle remoto
                  </label>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'guindaste':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="maxLiftCapacity" className="block text-sm font-medium text-gray-700">
                  Capacidade Máxima de Içamento (ton)*
                </label>
                <Field
                  id="maxLiftCapacity"
                  name="maxLiftCapacity"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="maxLiftCapacity" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label htmlFor="maxBoomHeight" className="block text-sm font-medium text-gray-700">
                  Altura Máxima com Lança (m)*
                </label>
                <Field
                  id="maxBoomHeight"
                  name="maxBoomHeight"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="maxBoomHeight" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="boomLength" className="block text-sm font-medium text-gray-700">
                  Comprimento da Lança (m)*
                </label>
                <Field
                  id="boomLength"
                  name="boomLength"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="boomLength" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label htmlFor="operationRadius" className="block text-sm font-medium text-gray-700">
                  Raio de Operação (m)*
                </label>
                <Field
                  id="operationRadius"
                  name="operationRadius"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="operationRadius" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo*
                </label>
                <Field as="select" id="type" name="type" className="input">
                  <option value="mobile">Móvel</option>
                  <option value="tower">Torre</option>
                  <option value="crawler">Sobre Esteiras</option>
                </Field>
                <ErrorMessage name="type" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              <div>
                <label htmlFor="extendedBoomCapacity" className="block text-sm font-medium text-gray-700">
                  Capacidade com Lança Estendida (ton)
                </label>
                <Field
                  id="extendedBoomCapacity"
                  name="extendedBoomCapacity"
                  type="number"
                  step="0.1"
                  className="input"
                />
                <ErrorMessage name="extendedBoomCapacity" component="div" className="mt-1 text-sm text-red-600" />
              </div>
            </div>
          </>
        );
      
      // Outros casos para as demais categorias seriam implementados de forma similar
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Cadastro de Equipamento
        </h1>

        {registerError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
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

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {!selectedCategory ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Selecione a categoria do equipamento</h2>
                <select
                  className="input w-full"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Selecione uma categoria...</option>
                  {equipmentCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <Formik
                initialValues={getCategoryInitialValues(selectedCategory)}
                validationSchema={Yup.object().shape({
                  ...BaseEquipmentSchema.fields,
                  ...getCategorySchema(selectedCategory).fields
                })}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values }) => (
                  <Form className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Cadastro de {equipmentCategories.find(c => c.id === selectedCategory)?.name}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('')}
                        className="text-primary-600 hover:text-primary-500"
                      >
                        Alterar categoria
                      </button>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                            Marca*
                          </label>
                          <Field
                            id="brand"
                            name="brand"
                            type="text"
                            className="input"
                          />
                          <ErrorMessage name="brand" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                            Modelo*
                          </label>
                          <Field
                            id="model"
                            name="model"
                            type="text"
                            className="input"
                          />
                          <ErrorMessage name="model" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                          Ano de Fabricação*
                        </label>
                        <Field
                          id="year"
                          name="year"
                          type="number"
                          min="1950"
                          max={new Date().getFullYear()}
                          className="input w-32"
                        />
                        <ErrorMessage name="year" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Especificações Técnicas</h3>
                      {renderCategoryFields(selectedCategory)}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Preços e Condições</h3>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="hourPrice" className="block text-sm font-medium text-gray-700">
                            Preço por Hora (R$)*
                          </label>
                          <Field
                            id="hourPrice"
                            name="hourPrice"
                            type="number"
                            step="0.01"
                            className="input"
                          />
                          <ErrorMessage name="hourPrice" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label htmlFor="dayPrice" className="block text-sm font-medium text-gray-700">
                            Preço por Dia (R$)*
                          </label>
                          <Field
                            id="dayPrice"
                            name="dayPrice"
                            type="number"
                            step="0.01"
                            className="input"
                          />
                          <ErrorMessage name="dayPrice" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label htmlFor="monthPrice" className="block text-sm font-medium text-gray-700">
                            Preço Mensal (R$)
                          </label>
                          <Field
                            id="monthPrice"
                            name="monthPrice"
                            type="number"
                            step="0.01"
                            className="input"
                          />
                          <ErrorMessage name="monthPrice" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label htmlFor="mobilizationFee" className="block text-sm font-medium text-gray-700">
                            Taxa de Mobilização/Desmobilização (R$)*
                          </label>
                          <Field
                            id="mobilizationFee"
                            name="mobilizationFee"
                            type="number"
                            step="0.01"
                            className="input"
                          />
                          <ErrorMessage name="mobilizationFee" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <label htmlFor="includedDistance" className="block text-sm font-medium text-gray-700">
                            Distância Incluída no Preço Base (km)*
                          </label>
                          <Field
                            id="includedDistance"
                            name="includedDistance"
                            type="number"
                            className="input"
                          />
                          <ErrorMessage name="includedDistance" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label htmlFor="additionalKmPrice" className="block text-sm font-medium text-gray-700">
                            Valor por KM Adicional (R$)*
                          </label>
                          <Field
                            id="additionalKmPrice"
                            name="additionalKmPrice"
                            type="number"
                            step="0.01"
                            className="input"
                          />
                          <ErrorMessage name="additionalKmPrice" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center mt-6">
                            <Field
                              id="operatorIncluded"
                              name="operatorIncluded"
                              type="checkbox"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="operatorIncluded" className="ml-2 block text-sm text-gray-900">
                              Operador Incluído no Preço
                            </label>
                          </div>
                        </div>
                      </div>

                      {!values.operatorIncluded && (
                        <div className="mt-4">
                          <label htmlFor="operatorPrice" className="block text-sm font-medium text-gray-700">
                            Valor Adicional do Operador (R$)
                          </label>
                          <Field
                            id="operatorPrice"
                            name="operatorPrice"
                            type="number"
                            step="0.01"
                            className="input w-64"
                          />
                          <ErrorMessage name="operatorPrice" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label htmlFor="minRentalPeriod" className="block text-sm font-medium text-gray-700">
                            Período Mínimo de Locação*
                          </label>
                          <div className="flex items-center">
                            <Field
                              id="minRentalPeriod"
                              name="minRentalPeriod"
                              type="number"
                              min="1"
                              className="input w-24"
                            />
                            <Field as="select" id="minRentalUnit" name="minRentalUnit" className="input ml-2">
                              <option value="hours">Horas</option>
                              <option value="days">Dias</option>
                            </Field>
                          </div>
                          <ErrorMessage name="minRentalPeriod" component="div" className="mt-1 text-sm text-red-600" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Fotos e Documentação</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fotos do Equipamento* (mínimo 3, máximo 10)
                        </label>
                        <div className="flex items-center">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-primary-50 file:text-primary-700
                              hover:file:bg-primary-100"
                          />
                        </div>
                        {photos.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">{photos.length} foto(s) selecionada(s)</p>
                          </div>
                        )}
                        {photos.length < 3 && (
                          <p className="mt-1 text-sm text-red-600">Mínimo de 3 fotos requeridas</p>
                        )}
                      </div>

                      <div className="mt-4">
                        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
                          Vídeo de Operação (URL do YouTube/Drive)
                        </label>
                        <Field
                          id="videoUrl"
                          name="videoUrl"
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="input"
                        />
                        <ErrorMessage name="videoUrl" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="mt-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Observações/Diferenciais
                        </label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={3}
                          className="input"
                        />
                        <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certificados/Documentação (PDF)
                        </label>
                        <input
                          type="file"
                          accept=".pdf"
                          multiple
                          onChange={handleCertificateUpload}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary-50 file:text-primary-700
                            hover:file:bg-primary-100"
                        />
                        {certificates.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">{certificates.length} certificado(s) selecionado(s)</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center">
                        <Field
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Equipamento ativo e disponível para locação
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary py-2 px-4"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || photos.length < 3}
                        className="btn-primary py-2 px-4"
                      >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar Equipamento'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentRegister;
