import { MenuContext } from "@/pages/_app";
import { LoadingCom } from "@/src/components/LoadingComponent";
import { AxiosClient_Cate } from "@/src/libs/AxiosClient";
import { 
  capitalizeFirstLetter, 
  handleFileUpload, 
  trimAndDashToLower } from "@/src/libs/CapitalizaText";
import { isValidSlug } from "@/src/libs/servicesProvider";

import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";

export const Category = () =>{
  const[validate_slug, setValidateSlug] = useState(false)
  const [title_en, SetTitle_En] = useState("");
  const [title_kh, SetTitle_Kh] = useState("");
  const [title_ch, SetTitle_Ch] = useState("");
  const [slug, SetSlug] = useState("");
  const [des, SetDes] = useState("");
  const[checkImg, setCheckImg]= useState('')
  const[sms_titleEn,setSms_titleEn]=useState('')
  const router = useRouter()
  const[sms_slugError,setSms_slugError]= useState('')


  const {data} = useQuery({
    queryKey: 'categories',
    queryFn: async() => {
      return (await AxiosClient_Cate.get('/categories')).data.categories
    }
  })
  const {mutate, status} = useMutation({
    mutationKey: 'categories',
    mutationFn: async (input:any) =>{
      return (await AxiosClient_Cate.post('/category/create', input)).data
    },
    onError: (error:any) =>{
      const res = error.response.data.message
      const sms = res.split('.')[1]
      if(res.split(' ')[0]==="slug" || res.split(' ')[0]==="Slug"){
        setSms_slugError(res)
        setValidateSlug(true)
      }else{
        setSms_titleEn(sms)
        setValidateSlug(false)
      }
    } ,
    //onL
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Successfully`,
        showConfirmButton: false,
        timer: 2000,
      });
      router.push(`/category/list`)
      //setPreloading(true)
    }
  })

  
  const handleSubmit = (e:any) =>{
    e.preventDefault()
    let InputFile = (document.getElementById('file-upload')) as HTMLInputElement;
    let file: File | undefined;
    if (InputFile !== null && InputFile.files !== null && InputFile.files.length > 0) {
      file = InputFile.files[0];
    }
    let input ={
      title_ch,
      title_en,
      title_kh,
      slug,
      des,
      img: file || ''
    }

    const Dataform = new FormData() as FormData
    Dataform.append('title_en', input.title_en)
    Dataform.append('title_kh', input.title_kh)
    Dataform.append('title_ch', input.title_ch)
    Dataform.append('slug', input.slug)
    Dataform.append('description', input.des)
    Dataform.append('image', input.img)
    //console.log("File=> ",file?.type,file?.name)
    mutate(Dataform)
    
  }

  const handleBlur=(e:any) =>{
    if(!e){
      setValidateSlug(true)
    }else{
      setValidateSlug(false)
      const ch = isValidSlug(e,data); //isValidSlug => Calling function from outisde(another files)
      setValidateSlug(ch===undefined?false:ch)
    }
  }
  const handleBlueTitleEn= (e:any)=>{
    const res = isValidSlug(trimAndDashToLower(e.target.value), data);  //isValidSlug => Calling function from outisde(another files)
    if(!res){
      SetSlug(trimAndDashToLower(title_en))
      setValidateSlug(false)
    }else{
      SetSlug(trimAndDashToLower(title_en))
      setValidateSlug(true)
    }
    
  }
  
  const handleFileUpload = (e:any) => {
    if (!e.target.files || e.target.files.length === 0) {
      //console.log('No file selected');
      setCheckImg('')
    }
    const files = e.target.files as FileList;
    if (!files) return;
    const file = files[0];
    if (!(file instanceof Blob)) return;
    const reader = new FileReader();
  
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imgPreview = document.getElementById("img-show-upload") as HTMLImageElement;
      imgPreview.src = e.target?.result as string;
      imgPreview.style.display = "block";
    };
  
    reader.readAsDataURL(file);
  }


  const handleCancel = (e:any) =>{
    e.preventDefault()
    router.push("/category/list")
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
        <h3 className="text-info">admin/category/create</h3>
        <form action="" className="px-1 form03 mt-4" onSubmit={handleSubmit}>
          <div className="rowcol  d-flex justify-content-between mb-2">
            <div className="col-01 py-1">
              <h6>Category Title (EN)</h6>
              <input
                type="text"
                value={title_en}
                className="input"
                placeholder="title..."
                onChange={(e: any) => {SetTitle_En(capitalizeFirstLetter(e.target.value)),setSms_titleEn(e.target.value?"":"The title must required")}}
                onBlur={handleBlueTitleEn}
              />
              <div className="py-1">
                <p className={sms_titleEn && !title_en ?" m-0 p-0":"d-none"} style={{color:"red"}}>{sms_titleEn}</p>
              </div>
            </div>
            <div className="col-01">
              <h6>Slug (uniqe)</h6>
              <input
                value={slug}
                type="text"
                className="input"
                placeholder="slug..."
                onChange={(e: any) => SetSlug(e.target.value)}
                onBlur={(e:any) => handleBlur(e.target.value)}
              />
              <p className={validate_slug && slug?"":"d-none"} style={{color:"red"}}>This slug is already in used</p>
              <p className={validate_slug && !slug?"":"d-none"} style={{color:"red"}}>slug must required</p>
              {/* <p className={sms_slugError && !slug ?"text-warning":"d-none"}>{sms_slugError}</p> */}
            </div>
          </div>
          <div className="rowcol mb-4 d-flex justify-content-between">
            <div className="col-01">
              <h6>Category Title (KH)</h6>
              <input
                type="text"
                className="input"
                value={title_kh}
                placeholder="title..."
                onChange={(e: any) => SetTitle_Kh(e.target.value)}
              />
            </div>
            <div className="col-01">
              <h6>Category Title (Chiness)</h6>
              <input
                type="text"
                className="input"
                value={title_ch}
                placeholder="title..."
                onChange={(e: any) => SetTitle_Ch(e.target.value)}
              />
            </div>
          </div>
          

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

          <div>
            <div className="d-flex justify-content-end">
              <button type="reset" className="btn btn-save mx-2" onClick={handleCancel}>Cancel</button>
              {validate_slug?<button className="btn btn-add mx-2" disabled >Submit</button>:<button type="submit" className="btn btn-add mx-2"  >Submit</button>}
            </div>
          </div>
        </form>

        <div className="upload-right">
          <h5>Featured</h5>
          <input
            id="file-upload"
            type="file"
            onChange={(e:any) => {handleFileUpload(e), setCheckImg(e.target.value)}}
          />

          <div className="my-2">
            {
              checkImg===''?'':<img src="" id="img-show-upload"  width={250} height={150} alt="" />
            }  
          </div>
        </div>
      </div>
    </>
  )
}

export default Category;

