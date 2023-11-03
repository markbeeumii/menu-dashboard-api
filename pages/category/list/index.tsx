import { useMutation, useQuery } from "react-query"
import { AxiosClient_Cate } from "@/src/libs/AxiosClient"
import { Spinner, Table } from "reactstrap"
import { AiOutlineDelete, AiOutlineOrderedList, AiOutlineTable } from "react-icons/ai"
import { TbEdit } from "react-icons/tb"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { MenuContext } from "@/pages/_app"
import Swal from "sweetalert2"
import { LoadingCom } from "@/src/components/LoadingComponent"

export const ListCategory = () =>{
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

  const {data, isLoading, refetch, status} = useQuery({
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

  const handleEdit=(e:any|number)=>{
    setLoading(true);
    router.push(`edit/${e}`) 
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }

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
      {/*Start Preloader Section*/}
          <LoadingCom
            status={status}
            isLoading={isLoading}
            loading={loading}
          />
      {/*End Preloader Section*/}

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
            <th className="px-5"> Action </th>
          </tr>
        </thead>
        <tbody>
          {
            data?.map((res:any, index:number) =>{
              return(
                <tr key={index}>
                  <th key={index} scope="row" className="text-primary py-4">  {index+1} </th>
                  <td className="py-4"> {res.title_en?res.title_en: 'N/A'} </td>
                  <td className="py-4"> {res.title_kh?res.title_kh:"N/A"} </td>
                  <td className="py-4"> {res.title_ch?res.title_ch:"N/A"} </td>
                  <td className="py-4 text-info"> {res.slug?res.slug:"N/A"} </td>
                  <td> <img src={res.thumbnail?res.thumbnail:"../img_loading.jpeg"} width={110} height={70} alt="" /> </td>
                  <td className="py-4 px-0"> 
                    <span className={res.slug==="uncategorized"?"d-none":""}>
                      <TbEdit fontSize={25} className="mx-4 justify-content-start" color="blue" cursor={'pointer'} onClick={()=> handleEdit(res.slug)} />
                      <AiOutlineDelete color="red" fontSize={25} className={"mx-4"} cursor={'pointer'} aria-disabled onClick={()=> handleDelete(res?.slug==="uncategorized"?'':res.id) } />
                    </span>
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
