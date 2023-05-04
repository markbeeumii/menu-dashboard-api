import { MenuLeft } from "@/src/components/MenuLeft"
import { Navbar } from "@/src/components/Navbar"
import router, { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { Spinner } from "reactstrap"
import { MenuContext } from "../_app"
import { AxiosClient_Cate, CurrectUser } from "@/src/libs/AxiosClient"
import { useQuery } from "react-query"
import axios from "axios"
import { error } from "console"

export const MainLayout = ({children}:any) =>{
  //const[menuLeftShow, setmenuLeftShow] = useState(false)

  const[token, setToken] = useState(()=>{
    let storedToken;
    if (typeof window !== 'undefined') {
      storedToken = localStorage.getItem('token');
    }
    return storedToken !== null ? storedToken : '';
  })
  const[username, setUsername]= useState('')
  const[profile, setProfile]= useState('')
  const[user, setUser]= useState({})
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProfile(localStorage.getItem('profile')||'')
      setUsername(localStorage.getItem('username')||'')
    }
  }, []);
  const {data, isLoading, isError} = useQuery({
    queryKey: "cuurentUser",
    queryFn: () => CurrectUser(token),
  })

  const handleSetUser= ()=>{
    //console.log("Handle User Left")
    if(data){
      localStorage.setItem('username',data?.username)
      localStorage.setItem('profile',data?.profile_picture)
      setProfile(localStorage.getItem('profile')||'')
      setUsername(localStorage.getItem('username')||'')
    }
  }
  //console.log("ME LOCAL =>",token)
  const isMenu = useContext(MenuContext)
  isLoading?<Spinner>Loading...</Spinner>:''
  return(
    <>
      {isMenu.menu? 
        <>
          <MenuLeft handleSetUser={handleSetUser}  /> 
          <Navbar 
            user={data} 
            username={username} 
            profile={profile} 
            />
          <main>
              {children}
          </main> 
        </> :<main>
              {children}
            </main> 
      }
      
        
    </>
  )
}

export default MainLayout

// export async function getServerSideProps(context:any) {
//   const res = (await axios.get(`http://localhost:4004/api/v1/user/me`)).data
//   return {
//     props: {
//      data: res
//     }
//   }
// }