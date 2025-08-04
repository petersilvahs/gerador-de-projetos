import { Box, Button, Icon, Input, Text, VStack, Image } from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'

interface Props {
  coverImage: string | null
  onChange: (base64: string) => void
}

export const ImageUploader = ({ coverImage, onChange }: Props) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => onChange(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <Box border="1px dashed" borderColor="gray.300" borderRadius="md" p={6} textAlign="center" bg="gray.50">
      <VStack spacing={2}>
        <Icon as={FiUpload as unknown as React.ElementType} boxSize={6} color="gray.400" />
        <Text color="gray.600">Escolha uma imagem .jpg ou .png no seu dispositivo</Text>
        <Button as="label" colorScheme="purple" variant="outline" borderRadius="full" cursor="pointer">
          Selecionar
          <Input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
        {coverImage && <Image src={coverImage} alt="Capa" maxH="120px" borderRadius="md" mt={2} />}
      </VStack>
    </Box>
  )
}
