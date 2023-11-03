import { useMutation, useQuery } from "react-query";
import { useContext, useState } from "react";
import { AxiosClient_Cate } from "@/src/libs/AxiosClient";
import Swal from "sweetalert2";
import { 
  SetToUpperCase, 
  capitalizeFirstLetter, 
  replaceSpacesWithDashes, 
  trimToTwoDecimalPlaces } from "@/src/libs/CapitalizaText";
import { MenuContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { Button } from "@/src/components/Button";
import { LoadingCom } from "@/src/components/LoadingComponent";


export const AddMenus = () => {
  const isMenu = useContext(MenuContext)
  //const[checkprice, setCheckPrice]= useState(false)
  const[validate_slug, setValidateSlug] = useState(false)
  const [checkboxValues, setCheckboxValues] = useState(true);
  const [title_en, SetTitle_En] = useState("");
  const [title_kh, SetTitle_Kh] = useState("");
  const [title_ch, SetTitle_Ch] = useState("");
  const[category_ID, setCategory_ID] = useState<number[]>([])
  const [code, SetCode] = useState("");
  const [price, SetPrice] = useState('');
  const [des, SetDes] = useState("");
  const [img, SetImg] = useState('');
  const [isOn, setIsOn] = useState(false);
  const[isSubmit, setIssubmit]= useState(false)
  const[isSuccess, setIssuccess]= useState(false)
  const [inputArray, setInputArray] = useState([{ size: '', price: '',menu_code: ''}]);
  //const [inputArray, setInputArray] = useState([{me:'I like u ',you: 'Sorry,I have a bf already!'}])
  const router = useRouter()

  const {mutate, status } = useMutation({
    mutationFn: async(input:any) =>{
      return (await AxiosClient_Cate.post('/menu/create', input)).data
    },
    onSuccess: ()=>{
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Successfully`,
        showConfirmButton: false,
        timer: 2000,
      });
      router.push(`/menu/list`)
      setIssubmit(true)
    },
    onError: (error:any)=>{
      const res = error.response.data.message
      const sms = res.split('.')[1]
      //console.log("SMS",res)
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${res?res:sms}`,
        showConfirmButton: false,
        timer: 2000,
      });
      //console.log(res)
    }
  })
  
  const {data} = useQuery({
    queryKey: 'categories',
    queryFn: async() => {
      return (await AxiosClient_Cate.get('/categories')).data.categories
    }
  })

  
  const handleChangeBox = (event:any, id:any) => {
    //event.preventDefault()
    const checkbox = event.target
    if(checkbox.checked){
      category_ID.length>=0? setCheckboxValues(false) : setCheckboxValues(true)
      setCategory_ID((prevCategories) => [...prevCategories, id]);
    }else{
      category_ID.length<=1? setCheckboxValues(true) : setCheckboxValues(false)
      setCategory_ID((prevCategories) =>
        prevCategories.filter((categoryId) => categoryId !== id)
      );
      
    }
    
  };


  const handleSubmit= (e:any) =>{
    e.preventDefault();
    let InputFile = (document.getElementById('file-upload')) as HTMLInputElement;
    let file: File | undefined;
    if (InputFile !== null && InputFile.files !== null && InputFile.files.length > 0) {
      file = InputFile.files[0];
    }
    let input :any = {
      title_ch,
      title_en,
      title_kh,
      code,
      price,
      des,
      category_Id: category_ID,
      img: file || ''
     }
    
    const formData = new FormData() as FormData
    formData.append('title_en', input.title_en)
    formData.append('title_kh', input.title_kh)
    formData.append('title_ch', input.title_ch)
    formData.append('code', input.code)
    formData.append('description', input.des)
    formData.append('image', input.img)

    category_ID.forEach((p:any)=>{
      formData.append('category_Id[]', p)
    })
     
    if(isOn===true){
      inputArray.forEach((obj:any, index:number) => {
        for (let key in obj) {
          formData.append(`menu_price[${index}][${key}]`, obj[key]);
        }
      });
    }else{
      formData.append('price', input.price)
    }
    
    setIssubmit(true)
    
    mutate(formData)
  }
  
  
  
  const handleBlur=(e:any) =>{
    const product = data?.map((s:any) => s.products)
    const res = product?.filter((p:any) => p.length>0);
    let check
    for(let i=0; i< res.length; i++){
      res[i]?.filter((p:any) =>{
        if(p.code.toLowerCase() === e.toLowerCase()){
          check=true
        }
      } )
    }
    setValidateSlug(check===undefined?false:check)
  }
  const handelBlurPrice =(e:any) =>{
    if(isNaN(e)){
      SetPrice('')
    }else{
      SetPrice(trimToTwoDecimalPlaces(e))
    }
  }
  const handleFileUpload = (e:any) => {
    if (!e.target.files || e.target.files.length === 0) {
      SetImg('')
    }
    
    const files = e.target.files as FileList;
    if (!files) return;
    
    const file = files[0];
    if (!(file instanceof Blob)) return;
    
    const reader = new FileReader();
  
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imgPreview = document.getElementById("img-show-upload-2") as HTMLImageElement;
      imgPreview.src = e.target?.result as string;
      imgPreview.style.display = "block";
    };
  
    reader.readAsDataURL(file);
  }

  const handleCancel = (e:any) =>{
    e.preventDefault()
    router.push("/menu/list")
  }
 
  const handleMutiple = (e:any)=>{
    const checkbox = document.getElementById("mutipleprice") as HTMLInputElement;
    if(checkbox.checked){
      setIsOn(true)
      SetPrice('')
    }else{
      setIsOn(false)
    } 
  }
  const handelCode = (e:any)=>{
    const currentArray = inputArray;
      const newArray = currentArray.map(item => ({...item, menu_code: e}));
      setInputArray(newArray);
  }
  
  return (
    <>
       {/*Start Preloader Section*/}
        <LoadingCom
            status={status}
          />
        {/*End Preloader Section*/}

      <div className={isMenu.menu?"main-body":"d-none"}>
        <h3 className="text-info">admin/menus</h3>
        <form action="" className="px-1 form03 mt-4" onSubmit={handleSubmit}>
          <div className="rowcol  d-flex justify-content-between">
            <div className="col-01">
              <h6>Menu Title (EN)</h6>
              <input
                value={title_en}
                type="text"
                className="input"
                placeholder="title..."
                onChange={(e: any) => SetTitle_En(capitalizeFirstLetter(e.target.value))}
              />
            </div>
            <div className="col-01">
              <h6>Code</h6>
              <input
                type="text"
                value={code}
                className="input"
                placeholder="title..."
                onChange={(e: any) =>{SetCode(replaceSpacesWithDashes(SetToUpperCase(e.target.value))), handelCode(replaceSpacesWithDashes(SetToUpperCase(e.target.value)))}}
                onBlur={(e:any) => handleBlur(e.target.value)}
              />
              <p className={validate_slug?"text-warning":"d-none"}>Code must be uniqe</p>
            </div>
          </div>
          <div className="rowcol mb-4 d-flex justify-content-between">
            <div className="col-01">
              <h6>Menu Title (KH)</h6>
              <input
              value={title_kh}
                type="text"
                className="input"
                placeholder="title..."
                onChange={(e: any) => SetTitle_Kh(e.target.value)}
              />
            </div>
            <div className="col-01">
              <h6>Menu Title (Chiness)</h6>
              <input
              value={title_ch}
                type="text"
                className="input"
                placeholder="title..."
                onChange={(e: any) => SetTitle_Ch(e.target.value)}
              />
            </div>
          </div>

          <div className="my-3 mb-4">
              <input 
              id="mutipleprice" 
              type="checkbox" 
              width={50} 
              onClick={handleMutiple} 
            />
            <span className="mx-2">Mitiple Price</span>
          </div>

          {isOn?
          <Button
            inputArray={inputArray}
            setInputArray={setInputArray}
          />:
          <div className=" rowcol  d-flex justify-content-between">
            <div className="col-01">
              <h6>Price</h6>
              <input
                value={price}
                type="text"
                className="input"
                placeholder="price..."
                onChange={(e: any) => {handelBlurPrice(e.target.value)}}
              />
            </div>
          </div>
        }
          <div className="description my-4">
            <h6>Description</h6>
            <textarea
              name=""
              id="description"
              placeholder="description..."
              cols={80}
              rows={4}
              value={des}
              onChange={(e: any) => SetDes(e.target.value)}
            />
          </div>

          <div >
            <div className="mb-3 d-flex justify-content-end">
            <button type="reset" className="btn btn-save mx-2" onClick={handleCancel}>Cancel</button>
            {checkboxValues || validate_slug || category_ID===undefined ?<button className="btn btn-add mx-2" disabled >Submit</button>:<button className="btn btn-add mx-2"  >Submit</button>}
            </div>
          </div>
        </form>

        <div className="upload-right">
          <h5>Featured</h5>
          {/* <label  className="custom-file-upload"> Custom Upload </label> */}
          <input
            id="file-upload"
            type="file"
            onChange={(e:any)=>{handleFileUpload(e), SetImg(e.target.value)}}
          />

          <div className="my-2">
              {
                img?<img src="" id="img-show-upload-2"  width={250} height={150} alt="" />:''
              }
          </div>
          <div className="my-2 py-4">
          {
              data?.map((p:any, index:number) => {
                return(
                  <div className="d-flex" key={ index}>
                  <input
                  type="checkbox"
                  //id="checkbox1"
                  width={100}
                  className="box01"
                  onChange={(e:any)=>handleChangeBox(e,p.id)}
                  />
                  <h5 className="mx-3">{p.title_en||p.slug}</h5>
                </div>
                )
              })
             }
          </div>

            
        </div>
        
      </div>
    </>
  );
};


export default AddMenus