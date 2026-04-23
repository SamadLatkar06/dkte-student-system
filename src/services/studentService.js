import { supabase } from '../lib/supabaseClient'

export async function getStudentByPrn(prn) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('prn', prn)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getDocumentsByPrn(prn) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('prn', prn)
    .order('uploaded_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
