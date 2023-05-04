import axios from "axios";

export const AxiosClient_Cate = axios.create({baseURL: process.env.NEXT_PUBLIC_FOOD_URL})
export const baseURL = String(process.env.NEXT_PUBLIC_FOOD_URL)

export const CurrectUser = async (token:any) =>{
  if (!token) {
    throw Error('No token')
  }
  const res:any = await axios.get(process.env.NEXT_PUBLIC_FOOD_URL+'/user/me',{
    headers:{
      Authorization: `Bearer ${token}`,
    },
  })
  if(!res){
    throw Error('Fail to get cuurect user!')
  }
  return res.data.user
}