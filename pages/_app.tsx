
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import MainLayout from './Layout/MainLayout'
import 'bootstrap/dist/css/bootstrap.css'
import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import '@/styles/main.scss'


export const MenuContext = createContext({ 
  menu: false, 
  setMenu: (menu: boolean) => { } }
  )
export const PageContext = createContext({ 
  page: false, 
  setPage: (page: boolean) => { } })
export const PageActive = createContext({ 
  pageActive: 0, 
  setPageActive: (pageActive: number) => { } })

const queryclient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const[page,setPage]= useState(false)
  const [menu, setMenu] = useState(false)
  const[pageActive, setPageActive] = useState(0)

  useEffect(()=>{
    if(window.localStorage.getItem('token')){
      //router.push('/')
      setMenu(true)
    }else{
      router.push({pathname:'/login'})
      setMenu(false)
    }
  },[])

  return(
    <>
      <QueryClientProvider client = {queryclient} >
        <PageActive.Provider value={{pageActive, setPageActive}}>
          <PageContext.Provider value={{page, setPage}}>
            <MenuContext.Provider value={{ menu, setMenu }}>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </MenuContext.Provider>
          </PageContext.Provider>
        </PageActive.Provider>
      </QueryClientProvider>
    </>
  )
}

