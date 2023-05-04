import { useMutation } from "react-query"
import { SetToUpperCase, trimToTwoDecimalPlaces } from "../libs/CapitalizaText"
import Swal from "sweetalert2"
import { AxiosClient_Cate } from "../libs/AxiosClient"
import { useRouter } from "next/router"

type ButtonEditProps={
  inputArray ? : any
  setInputArray ? :any
  checkIsdelete ? :any
  setCheckIsdelete ? :any
  id ? : any
}

export const ButtonEdit = ({id, checkIsdelete,setCheckIsdelete,inputArray, setInputArray}: ButtonEditProps) =>{
  const router = useRouter()
  const {mutate} = useMutation({
    mutationFn: async(id:any) =>{
      return (await AxiosClient_Cate.delete(`/menuprice/delete/${id}`)).data
    },
    onSuccess: ()=>{
      // Swal.fire({
      //   icon: "success",
      //   title: "Success!",
      //   text: `Successfully`,
      //   showConfirmButton: false,
      //   timer: 2000,
      // });
      ///router.push(`/menu/edit`)
      console.log("success")
    },
    onError: (error:any)=>{
      //console.log(error)
      const res = error.response.data.message || error.message
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${res}`,
        showConfirmButton: false,
        timer: 2000,
      });
      //console.log(res)
    }
  })
  const handleChangeInput = (index:any, key:any, value:any,e:any) => {
    e.preventDefault()
    const newInputArray = [...inputArray];
    const newInputObject = { ...newInputArray[index], [key]: value };
    newInputArray[index] = newInputObject;
    setInputArray(newInputArray);
  };
  
  const handleDeleteInput = (index:any,e:any) => {
    e.preventDefault()

   

    //console.log(id[index])

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
         // 
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            `success`
          );
          //router.push(`/menu/list`)

          const newInputArray = [...inputArray];

          const newIsDel = [...checkIsdelete]
          const newIsdelete = { ...newIsDel[index], ['size']: inputArray[index].size, ['menu_code']: inputArray[index].menu_code, ['isDelete']: true};
          newIsDel[index]= newIsdelete
          setCheckIsdelete(newIsDel)
          newInputArray.splice(index, 1);
          setInputArray(newInputArray);

          await mutate(id[index])

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

  };
  
  const handleAddInput = (e:any) => {
    e.preventDefault()
    const newInputArray = [...inputArray, { size: '', price: '' }];
    setInputArray(newInputArray);
  };
  
  //console.log('from edit->',id)

  return(
    <>
    {
        inputArray.map((input:any,index:number)=>{
        return(
          <div key={index+1} className="rowcol mb-4 d-flex justify-content-between">
            <div className="col-01">
              <input
                value={input.size}
                type="text"
                className="input"
                placeholder="size..."
                onChange={(e: any) => handleChangeInput(index,'size',SetToUpperCase(e.target.value),e)}
              />
            </div>
            <div className=" col-01">
                <input type="text"
                  className="input"
                  placeholder= 'price'
                  value={input.price}
                  onChange={(e) => handleChangeInput(index, 'price',trimToTwoDecimalPlaces( e.target.value),e)}
                />
            </div>
             <button type="reset" className="btn btn-primary p-1" onClick={(e:any) => handleDeleteInput(index,e)} >Delete</button> 
          </div>
        )
   })}
      <button 
      type="reset" 
      className="btn btn-info d-flex float-end mb-3 py-1" 
      onClick={handleAddInput}
      >
       Add
      </button>
    </>
  )
}