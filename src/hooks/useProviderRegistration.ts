import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, providerService, documentService } from '../services/supabase'
import { Provider, ProviderDocument } from '../services/supabase'

interface UseProviderRegistrationProps {
  onSuccess?: (provider: Provider) => void
  onError?: (error: Error) => void
}

interface RegistrationStep1Data {
  responsibleName: string
  fantasyName: string
  companyName: string
  cnpj: string
  mainPhone: string
  secondaryPhone?: string
  email: string
  zipCode: string
  address: string
  neighborhood: string
  city: string
  state: string
  serviceRadius: number
  website?: string
  socialMedia?: string
}

interface RegistrationStep2Data {
  password: string
  confirmPassword: string
  terms: boolean
  contractUpload: File | null
}

export const useProviderRegistration = ({ onSuccess, onError }: UseProviderRegistrationProps = {}) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<RegistrationStep1Data | null>(null)

  const handleStep1Submit = async (data: RegistrationStep1Data) => {
    try {
      setStep1Data(data)
      setCurrentStep(2)
      setError(null)
    } catch (err) {
      setError('Erro ao avançar para próxima etapa')
      onError?.(err as Error)
    }
  }

  const handleStep2Submit = async (data: RegistrationStep2Data) => {
    if (!step1Data) {
      setError('Dados da etapa 1 não encontrados')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. Criar usuário no sistema de autenticação
      const authData = await authService.signUp(
        step1Data.email,
        data.password,
        'provider'
      )

      if (!authData.user) {
        throw new Error('Falha ao criar usuário')
      }

      // 2. Preparar dados do fornecedor
      const providerData: Omit<Provider, 'id' | 'created_at' | 'updated_at'> = {
        user_id: authData.user.id,
        responsible_name: step1Data.responsibleName,
        fantasy_name: step1Data.fantasyName,
        company_name: step1Data.companyName,
        cnpj: step1Data.cnpj.replace(/\D/g, ''),
        main_phone: step1Data.mainPhone.replace(/\D/g, ''),
        secondary_phone: step1Data.secondaryPhone?.replace(/\D/g, ''),
        whatsapp_phone: step1Data.mainPhone.replace(/\D/g, ''),
        website: step1Data.website,
        instagram: step1Data.socialMedia,
        zip_code: step1Data.zipCode.replace(/\D/g, ''),
        address: step1Data.address,
        neighborhood: step1Data.neighborhood,
        city: step1Data.city,
        state: step1Data.state,
        service_radius_km: step1Data.serviceRadius,
        is_verified: false,
        verification_status: 'pending'
      }

      // 3. Criar fornecedor no banco de dados
      const provider = await providerService.createProvider(providerData)

      // 4. Upload do contrato social se fornecido
      if (data.contractUpload) {
        await documentService.uploadDocument(
          provider.id,
          data.contractUpload,
          'contract'
        )
      }

      // 5. Sucesso
      onSuccess?.(provider)
      
      // Redirecionar para dashboard com mensagem de sucesso
      navigate('/provider-dashboard', {
        state: { 
          message: 'Cadastro realizado com sucesso! Seus dados estão em análise.',
          providerId: provider.id
        }
      })

    } catch (err: any) {
      console.error('Erro no cadastro:', err)
      
      let errorMessage = 'Erro ao realizar cadastro. Tente novamente.'
      
      if (err.message.includes('already registered')) {
        errorMessage = 'Este email já está cadastrado.'
      } else if (err.message.includes('password')) {
        errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.'
      } else if (err.message.includes('cnpj')) {
        errorMessage = 'CNPJ já cadastrado no sistema.'
      }

      setError(errorMessage)
      onError?.(err)
    } finally {
      setIsLoading(false)
    }
  }

  const goBackToStep1 = () => {
    setCurrentStep(1)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  return {
    isLoading,
    error,
    currentStep,
    step1Data,
    handleStep1Submit,
    handleStep2Submit,
    goBackToStep1,
    clearError
  }
}

// Hook para busca de CEP
export const useCepSearch = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [addressData, setAddressData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const searchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    
    if (cleanCep.length !== 8) {
      setError('CEP deve ter 8 dígitos')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()

      if (data.erro) {
        throw new Error('CEP não encontrado')
      }

      setAddressData(data)
      return data
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar CEP')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const clearAddressData = () => {
    setAddressData(null)
    setError(null)
  }

  return {
    isLoading,
    addressData,
    error,
    searchCep,
    clearAddressData
  }
}

// Hook para validação de CNPJ
export const useCnpjValidation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [cnpjData, setCnpjData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const validateCnpj = async (cnpj: string) => {
    const cleanCnpj = cnpj.replace(/\D/g, '')
    
    if (cleanCnpj.length !== 14) {
      setError('CNPJ deve ter 14 dígitos')
      return false
    }

    // Validação básica do CNPJ (dígitos verificadores)
    if (!isValidCnpj(cleanCnpj)) {
      setError('CNPJ inválido')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      // Aqui você pode integrar com a API da Receita Federal
      // Por enquanto, apenas validação local
      setCnpjData({ cnpj: cleanCnpj, isValid: true })
      return true
    } catch (err: any) {
      setError('Erro ao validar CNPJ')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const isValidCnpj = (cnpj: string): boolean => {
    // Implementação da validação de CNPJ
    if (cnpj.length !== 14) return false

    // Elimina CNPJs invalidos conhecidos
    if (/^(\d)\1{13}$/.test(cnpj)) return false

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    let digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    return resultado === parseInt(digitos.charAt(1))
  }

  const clearCnpjData = () => {
    setCnpjData(null)
    setError(null)
  }

  return {
    isLoading,
    cnpjData,
    error,
    validateCnpj,
    clearCnpjData
  }
}