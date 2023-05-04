import { useMutation, useQuery } from "react-query"
import Category from "../create"
import { AxiosClient_Cate } from "@/src/libs/AxiosClient"
import { MenuLeft } from "@/src/components/MenuLeft"
import { Navbar } from "@/src/components/Navbar"
import { Badge, Spinner, Table } from "reactstrap"
import { TbEdit } from "react-icons/tb"
import { AiOutlineDelete } from "react-icons/ai"
import { useRouter } from "next/router"
import { useContext } from "react"
import { MenuContext } from "@/pages/_app"
import { NumberFixedtoDigit } from "@/src/libs/CapitalizaText"
import Swal from "sweetalert2"
//import {} from 'react'


export const ListMenu = () =>{
  const router = useRouter()
  const {data, isLoading, refetch} = useQuery({
    queryKey: 'menus',
    queryFn: async () => {
      return (await AxiosClient_Cate.get('/menus')).data.menus
    }
  })
  const { mutate } = useMutation({
    mutationKey: "category",
    mutationFn: async (id:any) => {
      return await (await AxiosClient_Cate.delete(`/menu/delete/${id}`)).data;
    },
    onSuccess: () =>{
      refetch();
      console.log('success')
    },

  });
  
  const handleDelete = (id:any) => {
    //e.preventDefault()

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-1',
        cancelButton: 'btn btn-danger mx-1'
      },
      buttonsStyling: false
    })
  
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            `success`
          );
          await mutate(id);
          router.push(`/menu/list`)

          return true;
        } catch (error:any) {
          const res = error.response.data.message;
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: `${res}`,
            showConfirmButton: false,
            timer: 2000,
          });
          return false;
        }
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
        return false;
      }
    })
  }

  isLoading?<Spinner>Loading...</Spinner>:''
  const isMenu = useContext(MenuContext)
  return(
    <>

    <div className={isMenu.menu?"main-body":"d-none"}>
      <h3 className="text-info">admin/categories</h3>

      <div className="mt-4 px-1">
      <Table hover responsive>
        <thead className="bg-ddd text-success">
          <tr>
            <th>  # </th>
            <th> Feature Image</th>
            <th> Title En </th>
            <th> Title KH </th>
            <th> Title Ch </th>
            <th> Price </th>
            <th> Categories </th>
            <th> Action </th>
          </tr>
        </thead>
        <tbody>
          {
            data?.map((res:any, index:number) =>{
              return(
                <tr key={index}>
                  <th key={index} className="text-primary py-4">  {index+1} </th>
                  <td> <img src={res.thumbnail} width={80} height={60} alt="" /> </td>
                  <td className="py-4"> {res.title_en} </td>
                  <td className="py-4"> {res.title_kh} </td>
                  <td className="py-4"> {res.title_ch} </td>
                  <td className="py-4"> 
                  { res.Menu_Price.length>0?
                    res.Menu_Price.map((p:any,index:number)=> {
                    return(
                        <h6 key={index} className="p-0">{p.size} - {p.price} $</h6> 
                    )
                  }) 
                  : `$ ${NumberFixedtoDigit(res.price)} ` } </td>
                  <td className="py-4"> <Badge className="" color="warning"> {res?.category.slug} </Badge></td>
                  <td className="py-4"> 
                    <TbEdit fontSize={25} className="mx-4" color="blue" cursor={'pointer'} onClick={()=> router.push(`edit/${res.id}`)} />
                    <AiOutlineDelete color="red" fontSize={25} className="mx-4" cursor={'pointer'} onClick={ ()=>handleDelete(res.id)} />
                  </td>
                  
                </tr>
              )
            })
          }
          
        </tbody>
      </Table>
        {/* {
          data?.map((p:any,index:number) => {
            return(
              <div key={index} className="my-3 d-flex justify-content-around">
                <img src={p.thumbnail} width={250} alt="" />
                <h4>{p.slug}</h4>
                <div>
                  <h5>{p.title_en}</h5>
                  <h5>{p.title_kh}</h5>
                  <h5>{p.title_ch}</h5>
                </div>
              </div>
            )
          })
        } */}
      </div>

    </div>
    </>
  )
}

export default ListMenu