// Função para garantir que só valores UUID válidos são enviados para o Supabase
export function sanitizeUUIDField(value: any): string | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!value || value === '' || value === 'outro' || !uuidRegex.test(value)) return null;
  return value;
} 