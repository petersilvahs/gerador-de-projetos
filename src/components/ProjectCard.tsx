import {
  Box, Text, Flex, Image, IconButton, Menu, MenuButton, MenuList,
  MenuItem, Divider, Icon
} from '@chakra-ui/react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import { FiMoreHorizontal, FiEdit2, FiTrash } from 'react-icons/fi'
import { MdCalendarToday } from 'react-icons/md'

interface ProjectCardProps {
  project: any
  onEdit: (project: any) => void
  onDelete: (project: any) => void
  toggleFavorite: (id: number) => void
  formatDate: (date: string) => string
}

export const ProjectCard = ({ project, onEdit, onDelete, toggleFavorite, formatDate }: ProjectCardProps) => {
  return (
    <Box borderRadius="xl" overflow="hidden" boxShadow="sm" bg="white" position="relative">
      <Box bg="purple.400" h="120px" position="relative" display="flex" alignItems="center" justifyContent="center">
        {project.coverImage ? (
          <Image src={project.coverImage} alt="Capa" objectFit="cover" w="full" h="full" />
        ) : (
          <Text color="white" fontWeight="bold" fontSize="lg">Placeholder</Text>
        )}
        <Flex position="absolute" bottom={2} right={2} gap={1}>
          <IconButton
            size="sm"
            variant="ghost"
            onClick={() => toggleFavorite(project.id)}
            aria-label="Favorito"
            icon={
              <Icon
                as={(project.isFavorite ? FaStar : FaRegStar) as unknown as React.ElementType}
                color={project.isFavorite ? "#FFD700" : "#FFF"}
              />
            }
          />
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Icon as={FiMoreHorizontal as unknown as React.ElementType} />}
              variant="solid"
              aria-label="Mais opções"
            />
            <MenuList>
              <MenuItem icon={<Icon as={FiEdit2 as unknown as React.ElementType} />} onClick={() => onEdit(project)}>Editar</MenuItem>
              <MenuItem icon={<Icon as={FiTrash as unknown as React.ElementType} />} onClick={() => onDelete(project)}>Remover</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <Box p={4}>
        <Text fontWeight="bold" fontSize="lg" color="purple.900">{project.name}</Text>
        <Text fontSize="md" color="gray.600">
          <Text as="span" fontWeight="bold" color="gray.800">Cliente:</Text> {project.client}
        </Text>
        <Divider my={3} />
        <Flex align="center" gap={3} fontSize="md" color="gray.600" mb={1}>
          <Icon as={MdCalendarToday as unknown as React.ElementType} boxSize={5} />
          <Text>{formatDate(project.startDate)}</Text>
        </Flex>
        <Flex align="center" gap={3} fontSize="md" color="gray.600">
          <Icon as={MdCalendarToday as unknown as React.ElementType} boxSize={5} />
          <Text>{formatDate(project.endDate)}</Text>
        </Flex>
      </Box>
    </Box>
  )
}
