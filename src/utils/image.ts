export const readImageFile = (
  file: File,
  callback: (result: string) => void
) => {
  const reader = new FileReader()
  reader.onloadend = () => {
    callback(reader.result as string)
  }
  reader.readAsDataURL(file)
}
