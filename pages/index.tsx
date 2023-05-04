import Head from 'next/head'
import { Inter } from '@next/font/google'
import { HomePageScreen } from '@/src/screen/HomePageScreen'
import { useEffect } from 'react'
import { useRouter } from 'next/router'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  useEffect(()=>{
    if(window.localStorage.getItem('token')){
      router.push('/')
    }else{
      router.push({pathname:'/login'})
    }
 
  },[])
  return (
    <>
      <Head>
        <title>Ezy Menu Admin @mark_bee </title>
        <meta name="description" content=" Power by Mark bee" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     <HomePageScreen/>
    </>
  )
}
