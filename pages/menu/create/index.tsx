import { useMutation, useQuery } from "react-query";
import { Col, Container, Label, Row, Spinner } from "reactstrap";
import { useContext, useState } from "react";
import { AxiosClient_Cate } from "@/src/libs/AxiosClient";
import Swal from "sweetalert2";
import { SetToUpperCase, capitalizeFirstLetter, replaceSpacesWithDashes, trimToTwoDecimalPlaces } from "@/src/libs/CapitalizaText";
import { MenuLeft } from "@/src/components/MenuLeft";
import { Navbar } from "@/src/components/Navbar";
import { MenuContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { Button } from "@/src/components/Button";

export const AddMenus = () => {
  const[checkprice, setCheckPrice]= useState(false)
  const[validate_slug, setValidateSlug] = useState(false)
  const [checkboxValues, setCheckboxValues] = useState(false);
  const [title_en, SetTitle_En] = useState("");
  const [title_kh, SetTitle_Kh] = useState("");
  const [title_ch, SetTitle_Ch] = useState("");
  const[category_ID, setCategory_ID] = useState()
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

  const {mutate} = useMutation({
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
    }
  })
  
  const {data} = useQuery({
    queryKey: 'categories',
    queryFn: async() => {
      return (await AxiosClient_Cate.get('/categories')).data.categories
    }
  })

  
  const handleChangeBox = (event:any, id:any) => {
    const checkbox = event.target
    if(checkbox.checked){
      setCategory_ID(id)
      setCheckboxValues(false)
    }else{
      //console.log('NOT Checked')
      setCheckboxValues(true)
    }
    
  };
  //console.log(category_ID)
  

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
    formData.append('category_Id', input.category_Id)
    formData.append('description', input.des)
    formData.append('image', input.img)
  
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
    //Mutation.mutate(inputArray)

  }
  
  
  
  const handleBlur=(e:any) =>{
    const product = data?.map((s:any) => s.products)
    const res = product?.filter((p:any) => p.length>0);
    //console.log(res)
    //const menu = res[0]?.map((f:any) => f.code.toLowerCase() === e.toLowerCase())
    let check
    for(let i=0; i< res.length; i++){
      res[i]?.filter((p:any) =>{
        if(p.code.toLowerCase() === e.toLowerCase()){
          check=true
        }
      } )
      //ch = false 
    }
    setValidateSlug(check===undefined?false:check)
    
  }
  const handelBlurPrice =(e:any) =>{
    if(isNaN(e)){
      SetPrice('')
    }else{
      //const roundedValue = parseFloat(e).toFixed(2);
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
    SetCode('')
    SetDes('')
    SetImg('')
    SetTitle_Ch('')
    SetTitle_En('')
    SetTitle_Kh('')
    SetPrice('')
  }
 
  const handleMutiple = (e:any)=>{
    //e.preventDefault()
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
  const isMenu = useContext(MenuContext)
  
  return (
    <>

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
          <div className="my-2">
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
                  <h5 className="mx-3">{p.slug}</h5>
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