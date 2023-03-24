import { UserProvider } from '@/context'
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }) {
  return (
  <UserProvider>
    <ChakraProvider>
    <Component {...pageProps} />
    </ChakraProvider>
    </UserProvider>
  )
}
