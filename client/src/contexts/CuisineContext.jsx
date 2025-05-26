import { createContext, useContext, } from 'react'

export const CuisineContext = createContext()

export const useCusines = () => useContext(CuisineContext)
