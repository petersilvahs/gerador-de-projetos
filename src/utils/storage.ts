const LOCAL_STORAGE_KEY = 'gerador-projetos'

export const getStoredProjects = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveProjects = (projects: any[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects))
}
