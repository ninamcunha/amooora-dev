import { supabase } from '../infra/supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface UploadImageResult {
  url: string;
  path: string;
  error?: string;
}

/**
 * Valida arquivo de imagem antes do upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Verificar tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato de imagem não suportado. Use JPG, PNG ou WEBP.',
    };
  }

  // Verificar tamanho
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Imagem muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Faz upload de uma imagem para o Supabase Storage
 * @param file Arquivo de imagem
 * @param folder Pasta onde salvar (ex: 'avatars', 'events')
 * @param fileName Nome do arquivo (opcional, será gerado se não fornecido)
 * @returns URL pública da imagem ou erro
 */
export async function uploadImage(
  file: File,
  folder: string = 'avatars',
  fileName?: string
): Promise<UploadImageResult> {
  try {
    // Validar arquivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        url: '',
        path: '',
        error: validation.error,
      };
    }

    // Obter usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        url: '',
        path: '',
        error: 'Usuário não autenticado',
      };
    }

    // Gerar nome único do arquivo
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const finalFileName = fileName || `${user.id}_${timestamp}_${randomString}.${fileExt}`;
    const filePath = `${folder}/${finalFileName}`;

    // Fazer upload
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false, // Não sobrescrever arquivos existentes
      });

    if (error) {
      console.error('Erro ao fazer upload:', error);
      return {
        url: '',
        path: '',
        error: `Erro ao fazer upload: ${error.message}`,
      };
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return {
        url: '',
        path: filePath,
        error: 'Erro ao obter URL pública da imagem',
      };
    }

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload',
    };
  }
}

/**
 * Remove uma imagem do Supabase Storage
 */
export async function deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) {
      console.error('Erro ao deletar imagem:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao deletar imagem',
    };
  }
}

/**
 * Atualiza avatar do perfil do usuário
 */
export async function updateProfileAvatar(avatarUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ avatar: avatarUrl })
      .eq('id', user.id);

    if (error) {
      console.error('Erro ao atualizar avatar:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar avatar',
    };
  }
}
