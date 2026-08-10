import { Button, HStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export const ButtonCallToAction = () => {
  return (
    <HStack>
      <Link to="/products">
        <Button variant="outline" colorScheme="yellow">
          Teste nosso Produto!
        </Button>
      </Link>
    </HStack>
  )
}