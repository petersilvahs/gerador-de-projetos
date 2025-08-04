import React, { useEffect, useState } from 'react'
import {
  Box, Heading, Text, Flex, Input, Button, Switch,
  Select, Grid, useDisclosure, Image, Icon
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiPlus, FiSearch } from 'react-icons/fi'
import { getStoredProjects, saveProjects } from '../utils/storage'
import { formatDate } from '../utils/formatDate'
import { ProjectCard } from '../components/ProjectCard'
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal'

export interface Project {
  id: number
  name: string
  client: string
  startDate: string
  endDate: string
  isFavorite: boolean
  coverImage?: string
}

export function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [sortOption, setSortOption] = useState('alphabetical')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchVisible, setSearchVisible] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setProjects(getStoredProjects())
  }, [location.key])

  const toggleFavorite = (id: number) => {
    const updated = projects.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    saveProjects(updated)
    setProjects(updated)
  }

  const deleteProject = () => {
    if (projectToDelete) {
      const updated = projects.filter(p => p.id !== projectToDelete.id)
      saveProjects(updated)
      setProjects(updated)
      onClose()
    }
  }

  const filteredProjects = projects
    .filter(p => !showOnlyFavorites || p.isFavorite)
    .filter(p => searchTerm.length < 3 || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'alphabetical') return a.name.localeCompare(b.name)
      if (sortOption === 'recent') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      if (sortOption === 'deadline') return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      return 0
    })

  return (
    <Box bg="#F8F7FD" minH="100vh">
      <Flex bg="purple.900" color="white" py={3} px={6} justify="center" align="center" position="relative">
        <Image src="/logo.png" alt="Logo" h="16" />
        <Box position="absolute" right={6}>
          <Icon as={FiSearch as unknown as React.ElementType} boxSize={5} cursor="pointer" onClick={() => setSearchVisible(!searchVisible)} />
        </Box>
      </Flex>

      <Box maxW="7xl" mx="auto" px={6} py={8}>
        <Input
          placeholder="Digite o nome de projeto..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          bg="white"
          borderRadius="full"
          mb={6}
          display={searchVisible ? 'block' : 'none'}
        />

        <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
          <Heading size="lg" color="purple.900">Projetos <Text as="span" color="gray.500">({projects.length})</Text></Heading>
          <Flex gap={4} direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }}>
            <Flex align="center" gap={2}>
              <Switch isChecked={showOnlyFavorites} onChange={e => setShowOnlyFavorites(e.target.checked)} colorScheme="purple" />
              <Text fontSize="sm">Apenas Favoritos</Text>
            </Flex>
            <Select value={sortOption} onChange={e => setSortOption(e.target.value)} maxW="200px" bg="white" borderRadius="md">
              <option value="alphabetical">Ordem alfabética</option>
              <option value="recent">Mais recentes</option>
              <option value="deadline">Próximos à finalização</option>
            </Select>
            <Button
              bg="purple.600"
              color="white"
              borderRadius="full"
              leftIcon={<Icon as={FiPlus as unknown as React.ElementType} />}
              _hover={{ bg: 'purple.700' }}
              onClick={() => navigate('/nova-tarefa')}
            >
              Novo projeto
            </Button>
          </Flex>
        </Flex>

        <Grid templateColumns="repeat(auto-fill, minmax(260px, 1fr))" gap={6}>
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => navigate('/nova-tarefa', { state: { project } })}
              onDelete={() => { setProjectToDelete(project); onOpen() }}
              toggleFavorite={() => toggleFavorite(project.id)}
              formatDate={formatDate}
            />
          ))}
        </Grid>
      </Box>

      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={deleteProject}
        projectName={projectToDelete?.name || ''}
      />
    </Box>
  )
}
