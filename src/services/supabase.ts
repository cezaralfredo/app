import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript para as tabelas
export interface User {
  id: string
  email: string
  user_type: 'client' | 'provider'
  created_at: string
  updated_at: string
  is_active: boolean
  last_login?: string
}

export interface Provider {
  id: string
  user_id: string
  responsible_name: string
  responsible_document?: string
  fantasy_name: string
  company_name: string
  cnpj: string
  state_registration?: string
  municipal_registration?: string
  main_phone: string
  secondary_phone?: string
  whatsapp_phone?: string
  website?: string
  instagram?: string
  facebook?: string
  zip_code: string
  address: string
  number?: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  service_radius_km: number
  service_cities?: string[]
  service_states?: string[]
  contract_document_url?: string
  cnpj_document_url?: string
  is_verified: boolean
  verification_status: 'pending' | 'approved' | 'rejected'
  verification_notes?: string
  created_at: string
  updated_at: string
  verified_at?: string
}

export interface ProviderDocument {
  id: string
  provider_id: string
  document_type: 'contract' | 'cnpj' | 'id_card' | 'other'
  document_name: string
  document_url: string
  file_name: string
  file_size?: number
  mime_type?: string
  is_verified: boolean
  uploaded_at: string
  verified_at?: string
  verification_notes?: string
}

export interface EquipmentCategory {
  id: string
  name: string
  description?: string
  icon?: string
  is_active: boolean
  created_at: string
}

export interface Equipment {
  id: string
  provider_id: string
  category_id?: string
  name: string
  description?: string
  brand?: string
  model?: string
  year?: number
  plate?: string
  weight_kg?: number
  dimensions?: string
  power_hp?: number
  capacity_kg?: number
  is_available: boolean
  availability_status: 'available' | 'rented' | 'maintenance' | 'unavailable'
  daily_rate: number
  weekly_rate?: number
  monthly_rate?: number
  minimum_rental_days: number
  current_location?: string
  latitude?: number
  longitude?: number
  created_at: string
  updated_at: string
}

export interface EquipmentImage {
  id: string
  equipment_id: string
  image_url: string
  is_primary: boolean
  alt_text?: string
  upload_order: number
  uploaded_at: string
}

// Serviços de autenticação
export const authService = {
  async signUp(email: string, password: string, userType: 'client' | 'provider') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType
        }
      }
    })

    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

// Serviços de fornecedores
export const providerService = {
  async createProvider(providerData: Omit<Provider, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('providers')
      .insert(providerData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProviderById(id: string) {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getProviderByUserId(userId: string) {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  },

  async updateProvider(id: string, updates: Partial<Provider>) {
    const { data, error } = await supabase
      .from('providers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async searchProviders(filters: {
    city?: string
    state?: string
    serviceRadius?: number
    equipmentCategory?: string
  }) {
    let query = supabase
      .from('providers')
      .select('*')
      .eq('is_verified', true)

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`)
    }

    if (filters.state) {
      query = query.eq('state', filters.state)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }
}

// Serviços de documentos
export const documentService = {
  async uploadDocument(providerId: string, file: File, documentType: ProviderDocument['document_type']) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${providerId}/${Math.random()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('provider-documents')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('provider-documents')
      .getPublicUrl(fileName)

    const documentData: Omit<ProviderDocument, 'id' | 'uploaded_at'> = {
      provider_id: providerId,
      document_type: documentType,
      document_name: file.name,
      document_url: urlData.publicUrl,
      file_name: fileName,
      file_size: file.size,
      mime_type: file.type,
      is_verified: false
    }

    const { data, error } = await supabase
      .from('provider_documents')
      .insert(documentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProviderDocuments(providerId: string) {
    const { data, error } = await supabase
      .from('provider_documents')
      .select('*')
      .eq('provider_id', providerId)
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data
  }
}

// Serviços de equipamentos
export const equipmentService = {
  async createEquipment(equipmentData: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('equipment')
      .insert(equipmentData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getEquipmentByProvider(providerId: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select('*, equipment_categories(*)')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async searchEquipment(filters: {
    category?: string
    city?: string
    state?: string
    minRate?: number
    maxRate?: number
    availability?: boolean
  }) {
    let query = supabase
      .from('equipment')
      .select('*, providers(*), equipment_categories(*)')
      .eq('is_available', true)

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters.city) {
      query = query.ilike('providers.city', `%${filters.city}%`)
    }

    if (filters.state) {
      query = query.eq('providers.state', filters.state)
    }

    if (filters.minRate !== undefined) {
      query = query.gte('daily_rate', filters.minRate)
    }

    if (filters.maxRate !== undefined) {
      query = query.lte('daily_rate', filters.maxRate)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }
}

// Serviços de categorias
export const categoryService = {
  async getAllCategories() {
    const { data, error } = await supabase
      .from('equipment_categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return data
  },

  async getCategoryById(id: string) {
    const { data, error } = await supabase
      .from('equipment_categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}