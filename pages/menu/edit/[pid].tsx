import { MenuContext } from "@/pages/_app";
import { ButtonEdit } from "@/src/components/ButtonEdit";
import { LoadingCom } from "@/src/components/LoadingComponent";
import { AxiosClient_Cate, baseURL } from "@/src/libs/AxiosClient";
import { SetToUpperCase, capitalizeFirstLetter, imgUpload, replaceSpacesWithDashes, trimToTwoDecimalPlaces } from "@/src/libs/CapitalizaText";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";

export const EditMenu = ({category,menu}:any) =>{
  const router = useRouter()
  const {pid} = router.query
  const upID= Number(pid)

  const[arrListMenu, setArraylistMenu]= useState([])
  const[checkprice, setCheckPrice]= useState(false)
  const[validate_slug, setValidateSlug] = useState(menu?.code?false:true)
  const [checkboxValues, setCheckboxValues] = useState(false);
  const [title_en, SetTitle_En] = useState(menu?menu.title_en:"");
  const [title_kh, SetTitle_Kh] = useState(menu?menu.title_kh:"");
  const [title_ch, SetTitle_Ch] = useState(menu?menu.title_ch:"");
  const[category_ID, setCategory_ID] = useState<any[]>(
    menu?.menu_category? menu.menu_category?.map((g:any)=> g.category_id)
    :menu.category_Id)
  const [code, SetCode] = useState(menu?menu.code:"");
  const [price, SetPrice] = useState(menu?menu.price:null);
  const [des, SetDes] = useState(menu?menu.description:"");
  const [img, SetImg] = useState("");
  const [isOn, setIsOn] = useState(menu.price===null?true:false);
  const[isSubmit, setIssubmit]= useState(false)
  const[isSuccess, setIssuccess]= useState(false)
  const [inputArray, setInputArray] = useState([{ size: '', price: '',menu_code : code}]);
  const[checkIsdelete, setCheckIsdelete] = useState([{size: '',menu_code: '', isDelete: false}])

  useState(() => {
    if (menu.Menu_Price.length>0) {
      setInputArray(menu.Menu_Price.map((p:any) => p));
    }else{
      const newInputArray = [...inputArray];
      const newInputObject = { ...newInputArray[0], ['menu_code'] : menu.code };
      newInputArray[0] = newInputObject;
      setInputArray(newInputArray);
    }
  },);

  const {mutate, status} = useMutation({
    mutationFn: async(input:any) =>{
      return (await AxiosClient_Cate.patch(`/menu/update/${upID}`, input)).data
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
    }
  })
  const {data} = useQuery({
    queryKey: 'categories',
    queryFn: async () => {
      return (await AxiosClient_Cate.get('/categories')).data.categories
    }
  })

  const handleChangeBox = (event:any) => {
    setCheckboxValues(false)
    //console.log(event)
    let BoxInput = document.getElementsByClassName('box01')[event-1] as HTMLInputElement
    if(BoxInput?.checked){
      setCategory_ID(event)
      setCheckboxValues(false)
    }else{
      setCheckboxValues(true)
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
    //formData.append('category_Id', input.category_Id)
    formData.append('description', input.des)
    formData.append('image', input.img)

    //Loop multiple categories
    category_ID.forEach((p:any)=>{
      formData.append('category_Id[]', p)
    })

    if(isOn===true){
      inputArray.forEach((obj:any, index:number) => {
        for (let key in obj) {
          formData.append(`menu_price[${index}][${key}]`, obj[key]);
        }
      });

      checkIsdelete.forEach((obj:any, index:number) => {
        for (let key in obj) {
          formData.append(`isDelete[${index}][${key}]`, obj[key]);
        }
      });

    }else{
      formData.append('price', input.price)
    }
    
    mutate(formData)
    
  }
  
  const handleSetImage = (e:any) =>{
    e.preventDefault()
    let ImageInput = (document.getElementById('image-upload')) as HTMLElement
    let InputFile = (document.getElementById('file-upload')) as HTMLInputElement
    if(InputFile !== null && InputFile.files !== null && InputFile.files.length > 0){
      SetImg(InputFile.value) 
    }
  }
  const handleBlur=(e:any) =>{
    const product = data?.map((s:any) => s.products)
    const res = product?.filter((p:any) => p.length>0);
    
    let check:any
    if(menu.code===e){
      setValidateSlug(false)
    }else{
    for(let j=0; j< res.length;j++){
      res[j]?.filter((p:any) =>{
        if(p.code.toLowerCase() === e.toLowerCase()){
          check=true
        }
      } )
    }
    setValidateSlug(check===undefined?false:check)
  }
   
  }
  
  const handelBlurPrice =(e:any) =>{
    if(isNaN(e)){
      SetPrice('')
    }else{
      SetPrice(trimToTwoDecimalPlaces(e))
    }
  }

  const handleClickCheckBox = (e: React.ChangeEvent<HTMLInputElement>, slug: any)=>{
    
    if (e.target.checked) {
      category_ID.length>=0? setCheckboxValues(false) : setCheckboxValues(true)
      setCategory_ID((prevCategories) => [...prevCategories, slug]);
    } else {
      category_ID.length<=1? setCheckboxValues(true) : setCheckboxValues(false)
      setCategory_ID((prevCategories) =>
        prevCategories.filter((categoryId) => categoryId !== slug)
      );
    }
    
  }
  

  const handleFileUpload = (e:any) => {
    if (!e.target.files || e.target.files.length === 0){
      SetImg('')
    }
    const files = e.target.files as FileList;
    if (!files) return;
    const file = files[0];
    if (!(file instanceof Blob)) return;
  
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (!(e.target?.result)) {
        console.log('Cancel File')
        return;
      }
      const imgPreview = document.getElementById("img-show-upload-3") as HTMLImageElement;
      imgPreview.src = e.target?.result as string;
      imgPreview.style.display = "block";
    };
  
    reader.readAsDataURL(file);
  }

  const handleCancel = (e:any) =>{
    e.preventDefault()
    router.push('/menu/list')
  }
  const handleMutiple = (e:any)=>{
    //e.preventDefault()
    const checkbox = document.getElementById("mutipleprice1") as HTMLInputElement;
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

  return(
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
                value={code}
                type="text"
                className="input"
                placeholder="title..."
                onChange={(e: any) => {SetCode(replaceSpacesWithDashes(SetToUpperCase(e.target.value))), handelCode(e.target.value)}}
                onBlur={(e:any) =>handleBlur(e.target.value) }
              />
              <p className={validate_slug?"text-warning":"d-none"}>Code must be uniqe</p>
            </div>
          </div>
          <div className="rowcol mb-4 d-flex justify-content-between">
            <div className="col-01">
              <h6>Menu Title (KH) </h6>
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
              id="mutipleprice1" 
              type="checkbox" 
              width={50} 
              onClick={handleMutiple} 
              checked={isOn}
            />
             
            <span className="mx-2">Mitiple Price</span>
          </div>

          {isOn===true?

                <ButtonEdit
                inputArray={inputArray}
                setInputArray={setInputArray}
                checkIsdelete={checkIsdelete}
                setCheckIsdelete={setCheckIsdelete}
                id={menu?.Menu_Price?.map((p:any)=> p.id)}
              /> 
          
          :
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



          <div className="my-4">
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

          <div>
            <div className="d-flex justify-content-end">
            <button type="reset" className="btn btn-save mx-2" onClick={handleCancel}>Cancel</button>
            {checkboxValues || validate_slug || category_ID===undefined ?<button type="submit" className="btn btn-add mx-2" disabled >Update</button>:<button type="submit" className="btn btn-add mx-2"  >Update</button>}
            </div>
          </div>
        </form>

        <div className="upload-right">
          <h5>Featured</h5>
          <input
            id="file-upload"
            type="file"
            onChange={(e:any)=>{handleFileUpload(e),SetImg(e.target.value)}}
          />

          <div className="my-2">
            {
              img===''?<img  src={menu.thumbnail} width={250} height={150}  alt="" /> : <img id="img-show-upload-3" width={250} height={150} src="" alt="" />
            }
          </div>
          <div className="my-2">
           {
            data?.map((p:any, index:number) => {
              return(
                <div className="d-flex" key={ index}>
                <input
                key={index}
                type="checkbox"
                name="myCheckboxGroup[]"
                width={100}
                className="box01"
                value={index+1}
                //value="checkboxValue"
                onChange={(e:any)=> handleClickCheckBox(e,p.id)}
                checked={
                  //menu?.menu_category?.some((ex:any)=> ex.category_id === p.id? true : false)
                  category_ID?.includes(p.id)?true: false
                }
                />
                <h5 className="mx-3">{p.title_en || p.slug}  </h5>
              </div>
              )
            })
           }

          {/*
             checkedBox? data?.map((p:any, index:number) => {
              return(
                <div className="d-flex" key={ index}>
                <input
                key={index}
                type="checkbox"
                name="myCheckboxGroup[]"
                width={100}
                className="box01"
                value={index+1}
                //value="checkboxValue"
                onChange={(e:any)=> {handleClickCheckBox(e,p.id),setCheckedBox(false)}}
                checked={
                  //menu?.menu_category?.some((ex:any)=> ex.category_id === p.id? true : false)
                  category_ID?.some((ex:any)=>{
                    if(ex.category_id === p.id){
                      return true
                    }
                  })
                }
                />
                <h5 className="mx-3">{p.title_en || p.slug} {p.id} </h5>
              </div>
              )
            })
            :
            data?.map((p:any, index:number) => {
              return(
                <div className="d-flex" key={ index}>
                <input
                type="checkbox"
                name="myCheckboxGroup[]"
                width={100}
                className="box01"
                value={index+1}
                //value="checkboxValue"
                onChange={(e:any)=>handleClickCheckBox(e,p.id)}
                />
                <h5 className="mx-3">{p.title_en || p.slug} </h5>
              </div>
              )
            })
          */}
          </div>
        </div>
      </div>
    </>
  )
}

export default EditMenu

export async function getServerSideProps(context: any) {
  const { pid } = context.query;
  const res = (await axios.get(baseURL+`/menu/${pid}`)).data.menu
  const category = res?.menu_category
  //console.log(res)
  return {
    props: {
      menu: res,
      category
    },
  };
}