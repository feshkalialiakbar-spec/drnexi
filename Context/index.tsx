'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface StatesContextProps {
  permissions: [string[], string[], number[]]
  setPermissions: (value: [string[], string[], number[]]) => void
}

const StatesContext = createContext<StatesContextProps | undefined>(undefined)

export const StatesProvider = ({ children }: { children: ReactNode }) => {
  const [permissions, setPermissions] = useState<
    [string[], string[], number[]]
  >([[''], [''], [0]])

  return (
    <StatesContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </StatesContext.Provider>
  )
}
export const useStates = () => {
  const context = useContext(StatesContext)
  if (!context) {
    throw new Error('productStates Provider')
  }
  return context
}
