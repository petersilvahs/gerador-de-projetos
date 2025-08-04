import React, { useState, useEffect } from 'react'
import {
  Box, Button, Flex, FormControl, FormLabel,
  Heading, Input, Icon, useToast, Image
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { ImageUploader } from '../components/ImageUploader'
import { getStoredProjects, saveProjects } from '../utils/storage'

const DEFAULT_IMAGE = 'Image.png'

export function ProjectForm() {
  const location = useLocation()
  const editingProject = location.state?.project

  const [id, setId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (editingProject) {
      setId(editingProject.id)
      setName(editingProject.name)
      setClient(editingProject.client)
      setStartDate(editingProject.startDate)
      setEndDate(editingProject.endDate)
      setCoverImage(editingProject.coverImage || null)
    }
  }, [editingProject])

  const handleSave = () => {
    if (!name || !client || !startDate || !endDate) {
      toast({
        title: 'Preencha todos os campos obrigatórios.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    const projects = getStoredProjects()

    if (id !== null) {
      const updatedProjects = projects.map((proj: any) =>
        proj.id === id
          ? {
            ...proj,
            name,
            client,
            startDate,
            endDate,
            coverImage: coverImage || DEFAULT_IMAGE,
          }
          : proj
      )
      saveProjects(updatedProjects)
    } else {
      const newProject = {
        id: Date.now(),
        name,
        client,
        startDate,
        endDate,
        coverImage: coverImage || DEFAULT_IMAGE,
        isFavorite: false
      }
      saveProjects([...projects, newProject])
    }

    toast({
      title: 'Projeto salvo com sucesso!',
      status: 'success',
      duration: 2000,
      isClosable: true
    })

    navigate('/')
  }

  return (
    <Box bg="gray.100" minH="100vh">
      <Flex bg="purple.900" color="white" py={3} px={6} justify="center" align="center" position="relative">
        <Image src="/logo.png" alt="Logo" h="16" />
      </Flex>

      <Box maxW="3xl" mx="auto" bg="white" mt={10} p={8} borderRadius="lg" boxShadow="lg">
        <Button
          variant="link"
          color="purple.600"
          mb={4}
          leftIcon={<Icon as={FiArrowLeft as unknown as React.ElementType} />}
          onClick={() => navigate('/')}
        >
          Voltar
        </Button>

        <Heading size="md" mb={6} color="purple.700">
          {id ? 'Editar projeto' : 'Novo projeto'}
        </Heading>

        <FormControl mb={4} isRequired>
          <FormLabel>Nome do projeto (Obrigatório)</FormLabel>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Digite o nome" />
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel>Cliente (Obrigatório)</FormLabel>
          <Input value={client} onChange={e => setClient(e.target.value)} placeholder="Digite o cliente" />
        </FormControl>

        <Flex gap={4} mb={4} direction={{ base: 'column', md: 'row' }}>
          <FormControl isRequired>
            <FormLabel>Data de Início (Obrigatório)</FormLabel>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Data Final (Obrigatório)</FormLabel>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </FormControl>
        </Flex>

        <FormControl>
          <FormLabel>Capa do projeto</FormLabel>
          <ImageUploader coverImage={coverImage} onChange={setCoverImage} />
        </FormControl>

        <Button colorScheme="purple" w="full" mt={6} onClick={handleSave}>
          {id ? 'Atualizar projeto' : 'Salvar projeto'}
        </Button>
      </Box>
    </Box>
  )
}
