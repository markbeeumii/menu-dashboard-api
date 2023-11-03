import { useMutation, useQuery } from "react-query"
import { AxiosClient_Cate } from "@/src/libs/AxiosClient"
import { Badge, Spinner, Table } from "reactstrap"
import { TbEdit } from "react-icons/tb"
import { AiOutlineDelete } from "react-icons/ai"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { MenuContext } from "@/pages/_app"
import { NumberFixedtoDigit } from "@/src/libs/CapitalizaText"
import Swal from "sweetalert2"
import { LoadingCom } from "@/src/components/LoadingComponent"


export const ListMenu = () =>{
  
  const {data, isLoading, refetch } = useQuery({
    queryKey: 'menus',
    queryFn: async () => {
      return (await AxiosClient_Cate.get('/menus/list')).data.menus
    }
  })

  const[multiplePrice,setMultiplePrice]= useState(0)
  const [loading, setLoading] = useState(false);

  const router = useRouter()


  useEffect(() => {
    const handleStart = () => {
      //console.log(`Loading started: `);
      setLoading(true);
    };

    const handleComplete = () => {
      //console.log(`Loading completed`);
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);


  
  const {mutate,status} = useMutation({
    mutationKey: "category",
    mutationFn: async (id:any) => {
      return await (await AxiosClient_Cate.delete(`/menu/delete/${id}`)).data;
    },
    onSuccess: () =>{
      refetch();
      console.log('success')
    },
   

  });

  const handleEdit = (e:number|any) => {
    setLoading(true);
    router.push(`edit/${e}`) //router.push(`
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  
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

  //Handle view price
  const handleViewPrice=(e:any,p:number)=>{
    e.preventDefault()
    setMultiplePrice(p===multiplePrice?0:p)
  }

  const isMenu = useContext(MenuContext)
  
  
  return(
    <>
      {/*Start Preloader Section*/}
        <LoadingCom
          status={status}
          isLoading={isLoading}
          loading={loading}
        />
      {/*End Preloader Section*/}

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
            <th className="px-5"> Action </th>
          </tr>
        </thead>
        <tbody>
          {
            data?.map((res:any, index:number) =>{
              return(
                <tr key={index}>
                  <th key={index} className="text-primary py-4">  {index+1} </th>
                  <td> <img src={res.thumbnail} width={80} height={60} alt="" /> </td>
                  <td className="py-4"> {res.title_en?res.title_en:"N/A"} </td>
                  <td className="py-4"> {res.title_kh?res.title_kh:"N/A"} </td>
                  <td className="py-4"> {res.title_ch?res.title_ch:"N/A"} </td>
                  <td className="py-4 dropdown-parent "> 
                  { res.Menu_Price.length>0?
                  <>
                    <h6 key={index} className="p-0 m-0 d-flex " style={{cursor:"pointer"}} onClick={(e:any)=>handleViewPrice(e,res.id)}>
                      {res?.Menu_Price[0]?.size} - {res?.Menu_Price[0]?.price} $
                      <svg xmlns="http://www.w3.org/2000/svg" style={{marginLeft:'10px',color:"red",fontWeight:"bold"}}  width="30" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="m7 10l5 5l5-5z"/></svg>
                    </h6>
                    <div className={res.id===multiplePrice?"dropdown-child":"d-none"}>
                    {
                      res.Menu_Price.map((p:any,index:number)=> {
                        return(
                          <h6 key={index} className="p-0">
                            {p.size} - {p.price} $ 
                          </h6> 
                          )
                        }) 
                    }
                  </div>
                  </>
                  : `$ ${NumberFixedtoDigit(res.price)} ` } </td>
                  <td className="py-4"> 
                    {/* <Badge className="" color="warning"> {res?.category.slug?res.category.slug:"N/A"} </Badge>  */}
                    {
                      res.menu_category?.map((x:any,ind:number)=>{
                        return (
                          <span key={ind} style={{marginRight:"2px"}}>
                            <Badge className="" color="warning"> {x.category.slug} </Badge>
                          </span>
                        )
                      })
                    }
                  </td>
                  <td className="py-4 px-0"> 
                    <TbEdit fontSize={25} className="mx-4" color="blue" cursor={'pointer'} onClick={()=> handleEdit(res.id)} />
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