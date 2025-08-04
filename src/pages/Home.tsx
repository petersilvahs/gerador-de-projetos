import React, { useEffect, useState } from 'react'
import {
  Box, Heading, Text, Flex, Input, Button, Switch,
  Select, Grid, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Image, Icon, Menu,
  MenuButton, MenuList, MenuItem, IconButton, Divider, Center, List, ListItem, ListIcon
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiPlus, FiSearch, FiMoreHorizontal, FiEdit2, FiTrash, FiClock } from 'react-icons/fi'
import { FaRegStar, FaStar } from 'react-icons/fa'
import { MdCalendarToday } from 'react-icons/md'

interface Project {
  id: number
  name: string
  client: string
  startDate: string
  endDate: string
  isFavorite: boolean
  coverImage?: string
}

const LOCAL_STORAGE_KEY = 'gerador-projetos'

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

  const loadProjects = () => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      try {
        setProjects(JSON.parse(stored))
      } catch {
        setProjects([])
      }
    } else {
      setProjects([])
    }
  }

  useEffect(() => {
    loadProjects()
  }, [location.key])

  const toggleFavorite = (id: number) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const deleteProject = () => {
    if (projectToDelete) {
      setProjects(prev => {
        const updated = prev.filter(p => p.id !== projectToDelete.id)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
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

  const handleEdit = (project: Project) => {
    navigate('/nova-tarefa', { state: { project } })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    <Box bg="#F8F7FD" minH="100vh">
      <Flex bg="purple.900" color="white" py={3} px={6} justify="center" align="center" position="relative">
        <Image src="/logo.png" alt="Logo" h="16" />
        <Box position="absolute" right={6}>
          <Icon as={FiSearch} boxSize={5} cursor="pointer" onClick={() => setSearchVisible(!searchVisible)} />
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
              leftIcon={<FiPlus />}
              _hover={{ bg: 'purple.700' }}
              onClick={() => navigate('/nova-tarefa')}
            >
              Novo projeto
            </Button>
          </Flex>
        </Flex>

        <Grid templateColumns="repeat(auto-fill, minmax(260px, 1fr))" gap={6}>
          {filteredProjects.map(project => (
            <Box key={project.id} borderRadius="xl" overflow="hidden" boxShadow="sm" bg="white" position="relative">
              <Box bg="purple.400" h="120px" position="relative" display="flex" alignItems="center" justifyContent="center">
                {project.coverImage ? (
                  <Image src={project.coverImage} alt="Capa" objectFit="cover" w="full" h="full" />
                ) : (
                  <Text color="white" fontWeight="bold" fontSize="lg">Placeholder</Text>
                )}
                <Flex position="absolute" bottom={2} right={2} gap={1}>
                  <IconButton size="sm" variant="ghost" onClick={() => toggleFavorite(project.id)} aria-label="Favorito">
                    {project.isFavorite ? <FaStar color="#FFD700" /> : <FaRegStar color="#FFF" />}
                  </IconButton>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreHorizontal />}
                      variant="solid"
                      aria-label="Mais opções"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEdit2 />} onClick={() => handleEdit(project)}>Editar</MenuItem>
                      <MenuItem icon={<FiTrash />} onClick={() => { setProjectToDelete(project); onOpen() }}>Remover</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Box>
              <Box p={4}>
                <Text fontWeight="bold" fontSize="lg" color="purple.900">{project.name}</Text>
                <Text fontSize="md" color="gray.600"><Text as="span" fontWeight="bold" color="gray.800">Cliente:</Text> {project.client}</Text>
                <Divider my={3} />
                <Flex align="center" gap={3} fontSize="md" color="gray.600" mb={1}>
                  <MdCalendarToday size={20} /> <Text>{formatDate(project.startDate)}</Text>
                </Flex>
                <Flex align="center" gap={3} fontSize="md" color="gray.600">
                  <MdCalendarToday size={20} /> <Text>{formatDate(project.endDate)}</Text>
                </Flex>
              </Box>
            </Box>
          ))}
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" p={6} pt={10} position="relative">
          <Center position="absolute" top={-8} left="50%" transform="translateX(-50%)" bg="purple.500" borderRadius="full" boxSize={16} boxShadow="lg">
            <Icon as={FiTrash} color="white" boxSize={6} />
          </Center>
          <ModalHeader textAlign="center" color="purple.900">Remover projeto</ModalHeader>
          <Divider mb={4} />
          <ModalBody textAlign="center" color="gray.600">
            Essa ação removerá definitivamente o projeto:
            <Text mt={2} fontWeight="bold" fontSize="lg" color="black">{projectToDelete?.name}</Text>
          </ModalBody>
          <ModalFooter justifyContent="center" gap={4}>
            <Button variant="outline" color="purple.600" borderColor="purple.600" borderRadius="full" onClick={onClose}>
              Cancelar
            </Button>
            <Button bg="purple.600" color="white" borderRadius="full" onClick={deleteProject} _hover={{ bg: 'purple.700' }}>
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
