import { supabase } from '../lib/supabaseClient'

export async function getAllStudents(searchPrn = '') {
  let query = supabase.from('students').select('*').order('name', { ascending: true })

  if (searchPrn.trim()) {
    query = query.ilike('prn', `%${searchPrn.trim()}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function upsertStudent(student) {
  const { data, error } = await supabase
    .from('students')
    .upsert(student, { onConflict: 'prn' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uploadFileToDocumentsBucket(file, path) {
  const { error } = await supabase.storage.from('documents').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })
  if (error) throw error

  const { data } = supabase.storage.from('documents').getPublicUrl(path)
  return data.publicUrl
}

export async function insertDocument({ prn, docName, fileUrl }) {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      prn,
      doc_name: docName,
      file_url: fileUrl,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
