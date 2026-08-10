import { Button, HStack } from "@chakra-ui/react"

export const ButtonCallToAction = () => {
  return (
    <HStack>
      <a href="/products" target="_blank" rel="noopener noreferrer">
        <Button variant="outline" colorScheme="yellow">
          Teste nosso Produto!
        </Button>
      </a>
    </HStack>
  )
}