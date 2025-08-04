import React, { useState, useEffect } from 'react'
import {
  Box, Button, Flex, FormControl, FormLabel,
  Heading, Input, Text, useToast, Image, Icon, VStack
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'

const LOCAL_STORAGE_KEY = 'gerador-projetos'

export function ProjectForm() {
  const location = useLocation()
  const editingProject = location.state?.project

  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [id, setId] = useState<number | null>(null)

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

    const storedProjects = localStorage.getItem(LOCAL_STORAGE_KEY)
    const projects = storedProjects ? JSON.parse(storedProjects) : []

    if (id !== null) {
      const updatedProjects = projects.map((proj: any) =>
        proj.id === id
          ? {
              ...proj,
              name,
              client,
              startDate,
              endDate,
              coverImage: coverImage || 'Image.png',
            }
          : proj
      )
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects))
    } else {
      const newProject = {
        id: Date.now(),
        name,
        client,
        startDate,
        endDate,
        coverImage: coverImage || 'Image.png',
        isFavorite: false
      }
      const updatedProjects = [...projects, newProject]
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects))
    }

    toast({
      title: 'Projeto salvo com sucesso!',
      status: 'success',
      duration: 2000,
      isClosable: true
    })

    navigate('/')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
          leftIcon={<FiArrowLeft />}
          onClick={() => navigate('/')}
        >
          Voltar
        </Button>

        <Heading size="md" mb={6} color="purple.700">{id ? 'Editar projeto' : 'Novo projeto'}</Heading>

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
          <Box
            border="1px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={6}
            textAlign="center"
            bg="gray.50"
          >
            <VStack spacing={2}>
              <Icon as={FiUpload} boxSize={6} color="gray.400" />
              <Text color="gray.600">Escolha uma imagem .jpg ou .png no seu dispositivo</Text>
              <Button as="label" colorScheme="purple" variant="outline" borderRadius="full" cursor="pointer">
                Selecionar
                <Input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </Button>
              {coverImage && <Image src={coverImage} alt="Capa" maxH="120px" borderRadius="md" mt={2} />}
            </VStack>
          </Box>
        </FormControl>

        <Button colorScheme="purple" w="full" mt={6} onClick={handleSave}>
          {id ? 'Atualizar projeto' : 'Salvar projeto'}
        </Button>
      </Box>
    </Box>
  )
}
