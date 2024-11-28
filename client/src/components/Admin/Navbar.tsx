import { Box, Flex, Text, Container } from '@chakra-ui/react'

const Navbar = () => {

  return (
    <Container>
      <Box  px={4} my={4} borderRadius={"5"}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {/* LEFT SIDE */}
          <Flex justifyContent={"center"} alignItems="center" gap={3} display={{ base: "nopne", sm: "flex"}}>
            <img src='Golang.png' alt='logo' width={100} height={50} />
            <Text fontSize={"40"}>+</Text>
            <img src='react.png' alt='logo' width={50} height={50} />
            <Text fontSize={"40"}>+</Text>
            <img src='typescript.png' alt='logo' width={50} height={50} />
            <Text fontSize={"40"}>+</Text>
            <img src='vite.svg' alt='logo' width={50} height={50} />
          </Flex>
          {/* RIGHT SIDE */}
          <Flex gap={3} alignItems={"center"}>
            <Text fontSize={"lg"} fontWeight={500}>
            Admin Pages
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Container>
  )
}
export default Navbar