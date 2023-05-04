import { useMutation, useQuery } from "react-query"
import Category from "../create"
import { AxiosClient_Cate } from "@/src/libs/AxiosClient"
import { CardCategory } from "@/src/components/CardCategory"
import { MenuLeft } from "@/src/components/MenuLeft"
import { Navbar } from "@/src/components/Navbar"
import { Spinner, Table } from "reactstrap"
import { AiOutlineDelete, AiOutlineOrderedList, AiOutlineTable } from "react-icons/ai"
import { TbEdit } from "react-icons/tb"
import { useRouter } from "next/router"
import { useContext } from "react"
import { MenuContext } from "@/pages/_app"
import Swal from "sweetalert2"

export const ListCategory = () =>{
  const router = useRouter()
  const {data, isLoading, refetch} = useQuery({
    queryKey: 'categories',
    queryFn: async () => {
      return (await AxiosClient_Cate.get('/categories')).data.categories
    }
  })
  
  const { mutate } = useMutation({
    mutationKey: "category",
    mutationFn: async (id:any) => {
      return await (await AxiosClient_Cate.delete(`/category/delete/${id}`)).data;
    },
    onSuccess: () =>{
      refetch();
      console.log('success')
    },
    onError: (error:any)=>{
     // console.log(error)
    }
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
          await mutate(id);
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            `success`
          );
          router.push(`/category/list`)
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

      <div className="mt-4 px-2">
      <Table hover responsive>
        <thead>
          <tr>
            <th>  # </th>
            <th> Title EN </th>
            <th> Title Kh </th>
            <th> Title Ch </th>
            <th> Slug </th>
            <th> Featured Image</th>
            <th> Action </th>
          </tr>
        </thead>
        <tbody>
          {
            data?.map((res:any, index:number) =>{
              return(
                <tr key={index}>
                  <th key={index} scope="row" className="text-primary py-4">  {index+1} </th>
                  <td className="py-4"> {res.title_en} </td>
                  <td className="py-4"> {res.title_kh} </td>
                  <td className="py-4"> {res.title_ch} </td>
                  <td className="py-4 text-info"> {res.slug} </td>
                  <td> <img src={res.thumbnail} width={110} height={70} alt="" /> </td>
                  <td className="py-4"> 
                    <TbEdit fontSize={25} className="mx-4" color="blue" cursor={'pointer'} onClick={()=> router.push(`edit/${res.slug}`)} />
                    <AiOutlineDelete color="red" fontSize={25} className="mx-4" cursor={'pointer'} onClick={()=> handleDelete(res.id) } />
                  </td>
                  
                </tr>
              )
            })
          }
          
        </tbody>
      </Table>
    </div>
 </div>
    </>
  )
}

export default ListCategory


         {/* {
            data?.map((res:any, index:number) =>{
              return(
              <div className="row p-1" key={index} >
                <div className="col-md-2 mb-4">
                  <h5 className="text-primary">{index+1}</h5>
                </div>

                <div className="col-md-6 mb-4">
                  <h4>{res.slug}</h4>
                </div>
                <div className="col-md-4 mb-4">
                  <h4>{res.slug}</h4>
                </div>
              </div> 
              )
            })
          } 
        </div>

 {
  data?.map((p:any, index:number) => {
    return(
        <div key={index} className="col-md-4">
          <CardCategory
            id={p.id}
            title_en={p.title_en}
            title_ch={p.title_ch}
            title_kh={p.title_kh}
            description={p.description}
            thumbnail={p.thumbnail}
            slug={p.slug}
          />
        </div>
    )
  })
} 
</div>

 {
  data?.map((p:any) => {
    return(
      <div className="d-flex justify-content-around">
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
