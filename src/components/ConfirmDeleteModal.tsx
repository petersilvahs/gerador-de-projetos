import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Button, Divider, Center, Icon, Text
} from '@chakra-ui/react'
import { FiTrash } from 'react-icons/fi'

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  projectName: string
}

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, projectName }: ConfirmDeleteModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent borderRadius="lg" p={6} pt={10} position="relative">
      <Center position="absolute" top={-8} left="50%" transform="translateX(-50%)" bg="purple.500" borderRadius="full" boxSize={16} boxShadow="lg">
        <Icon as={FiTrash as React.ElementType} color="white" boxSize={6} />
      </Center>
      <ModalHeader textAlign="center" color="purple.900">Remover projeto</ModalHeader>
      <Divider mb={4} />
      <ModalBody textAlign="center" color="gray.600">
        Essa ação removerá definitivamente o projeto:
        <Text mt={2} fontWeight="bold" fontSize="lg" color="black">{projectName}</Text>
      </ModalBody>
      <ModalFooter justifyContent="center" gap={4}>
        <Button variant="outline" color="purple.600" borderColor="purple.600" borderRadius="full" onClick={onClose}>
          Cancelar
        </Button>
        <Button bg="purple.600" color="white" borderRadius="full" onClick={onConfirm} _hover={{ bg: 'purple.700' }}>
          Confirmar
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)