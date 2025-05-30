'use client'

import { ChakraProvider, defaultSystem, createSystem, defineConfig } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
      backgroundColor: "#f1f5ff"
    },
  },
  theme: {
    tokens: {
      colors: {
        main: "rgb(213, 69, 130)",
      },
    },
  },
})

const system = createSystem(config)

export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem}>
    {/* <ChakraProvider value={system}> */}
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
