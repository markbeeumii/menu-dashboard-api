import { MenuContext } from "@/pages/_app";
import { AxiosClient_Cate, baseURL } from "@/src/libs/AxiosClient";
import { capitalizeFirstLetter, handleFileUpload, imgUpload, trimAndDashToLower } from "@/src/libs/CapitalizaText";
import axios from "axios";
import { useRouter } from "next/router";
import { useState,useContext } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery } from "react-query";
import { isValidSlug } from "@/src/libs/servicesProvider";
import { LoadingCom } from "@/src/components/LoadingComponent";


const BaseURL = process.env.NEXT_URL_CATEGORY?process.env.NEXT_URL_CATEGORY: ''

export const ViewCategory = ({  category }: any) => {
  const router = useRouter();
  const { pid } = router.query;
  const [title_en, SetTitle_En] = useState(category?.title_en);
  const [title_kh, SetTitle_Kh] = useState(category?.title_kh);
  const [title_ch, SetTitle_Ch] = useState(category?.title_ch);
  const [slug, SetSlug] = useState(category?.slug);
  const [des, SetDes] = useState(category?.description);
  const[imgcheck, SetImg]= useState('')
  const[validate_slug, setValidateSlug] = useState(category?.slug?false:true)

  const {data} = useQuery({
    queryKey: 'categories',
    queryFn: async() => {
      return (await AxiosClient_Cate.get('/categories')).data.categories
    }
  })
  const { mutate, status } = useMutation({
    mutationKey: "category",
    mutationFn: async (input: any) => {
      return (await AxiosClient_Cate.patch(`/category/update/${pid}`, input))
        .data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message
      if(message?.split(" ")[0]==="This"){
        setValidateSlug(true)
      }else{
        setValidateSlug(false)
      }
      
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Successfully`,
        showConfirmButton: false,
        timer: 2000,
      });
      router.push(`/category/list`)
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let InputFile = document.getElementById("file-upload") as HTMLInputElement;
    let file: File | undefined;
    if (
      InputFile !== null &&
      InputFile.files !== null &&
      InputFile.files.length > 0
    ) {
      file = InputFile.files[0];
    }
    let input = {
      title_ch,
      title_en,
      title_kh,
      slug,
      des,
      img: file || "",
    };
    const Dataform = new FormData() as FormData;
    Dataform.append("title_en", input.title_en);
    Dataform.append("title_kh", input.title_kh);
    Dataform.append("title_ch", input.title_ch);
    Dataform.append("slug", input.slug);
    Dataform.append("description", input.des);
    Dataform.append("image", input.img);
    //console.log(input);
    mutate(Dataform);
  };
  const handleOnBlur = (e:any) =>{
    if(!e){
      setValidateSlug(true)
    }else{
      setValidateSlug(false)
      let ch = isValidSlug(e,data,String(pid))
      setValidateSlug(ch===undefined?false:ch)
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
      const imgPreview = document.getElementById("img-show-upload-1") as HTMLImageElement;
      imgPreview.src = e.target?.result as string;
      imgPreview.style.display = "block";
    };
  
    reader.readAsDataURL(file);
  }

  const handleBlueTitleEn= (e:any)=>{
    //isValidSlug => Calling function from outisde(another files)
    const save = isValidSlug(trimAndDashToLower(e?.target.value),data,String(pid));
      if(!save){
        SetSlug(trimAndDashToLower(title_en))
        setValidateSlug(false)
      }else{
        SetSlug(trimAndDashToLower(title_en))
        setValidateSlug(true)
      }
  }

  const handelCancel = (e:any) =>{
    e.preventDefault()
    router.push('/category/list')
  }

  const isMenu = useContext(MenuContext)
  
  return (
    <>
      {/*Start Preloader Section*/}
          <LoadingCom
            status={status}
          />
      {/*End Preloader Section*/}

      <div className={isMenu.menu?"main-body":"d-none"}>
        <h3 className="text-info">admin/categories/edit</h3>
        <div className="mt-3">
          <form action="" className="px-1 form03 mt-4" onSubmit={handleSubmit}>
            <div className="rowcol  d-flex justify-content-between">
              <div className="col-01">
                <h6>Category Title (EN)</h6>
                <input
                  value={title_en}
                  type="text"
                  className="input"
                  placeholder="title..."
                  onChange={(e: any) => SetTitle_En(capitalizeFirstLetter(e.target.value))}
                  onBlur={handleBlueTitleEn}
                />
                <div className="py-1">
                  <p className={ !title_en ?" m-0 p-0":"d-none"} style={{color:"red"}}>The title en must required</p>
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
                  onBlur={(e: any) => handleOnBlur(e.target.value)}
                />
                <p className={validate_slug && slug?"":"d-none"} style={{color:"red"}}>This slug is already in used</p>
                <p className={validate_slug && !slug?"":"d-none"} style={{color:"red"}}>slug must required</p>
              </div>
            </div>
            <div className="rowcol mb-4 d-flex justify-content-between">
              <div className="col-01">
                <h6>Category Title (KH)</h6>
                <input
                  value={title_kh}
                  type="text"
                  className="input"
                  placeholder="title..."
                  onChange={(e: any) => SetTitle_Kh(e.target.value)}
                />
              </div>
              <div className="col-01">
                <h6>Category Title (Chiness)</h6>
                <input
                  value={title_ch}
                  type="text"
                  className="input"
                  placeholder="title..."
                  onChange={(e: any) => SetTitle_Ch(e.target.value)}
                />
              </div>
            </div>

            <div className="my-4">
              <h6>Description</h6>
              <textarea
                value={des}
                name=""
                id="description"
                placeholder="description..."
                cols={80}
                rows={4}
                onChange={(e: any) => SetDes(e.target.value)}
              />
            </div>

            <div>
              <div className="d-flex justify-content-end">
                <button type="reset" className="btn btn-save mx-2" onClick={handelCancel}>
                  Cancel
                </button>
                {validate_slug?<button className="btn btn-add mx-2" disabled >Update</button>:<button className="btn btn-add mx-2">Update</button>}
                
              </div>
            </div>
          </form>

          <div className="upload-right">
            <h5>Featured</h5>
            <input
              id="file-upload"
              type="file"
              //value={category.thumbnail}
              onChange={(e:any)=> {handleFileUpload(e),SetImg(e.target.value)}}
              //(e: any) => SetImg(e.target.value)
            />
            <div className="mt-3 px-4">
              {
                imgcheck===''?<img id="" src={category.thumbnail} width={250} height={150} alt="" />:<img id="img-show-upload-1" src='' width={250} height={150} alt="" />
              }
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCategory;

export async function getServerSideProps(context: any) {
  const { pid } = context.query;
  const res = (await axios.get(baseURL+`/category/${pid}`)).data.category;
 
  return {
    props: {
      //products:res,
      category: res,
    },
  };
}

{
  /*         
        <div className={table?"mt-3":"mt-3 d-none"}>
          <div className="row">
            {
            products.length===0?<h1 className="text-warning">No menus yet</h1>:  products?.map((p:any, index:number) =>{
                return(
                  <Col md={4} key={p.id} className="p-2">
                  <CardCategory
                  id={p.id}
                  code={p.code}
                  title_en={p.title_en}
                  title_kh={ p.title_kh}
                  title_ch={p.title_ch}
                  thumbnail={p.thumbnail}
                  description= {p.description}
                  price={p.price}
                  />
                </Col>
                )
              })
            }
          </div>
        </div>

        <div className={list?"mt-3":" d-none"}>
          {
            products?.map((res:any, index:number) =>{
              return(
                <div key={index} className="my-3 d-flex justify-content-around">
                  <h5 className="text-primary">{index+1}</h5>
                  <img src={res.thumbnail} width={150} alt="" />
                  <h4>{res.slug}</h4>
                  <div>
                    <h5>{res.title_en}</h5>
                    <h5>{res.title_kh}</h5>
                    <h5>{res.title_ch}</h5>
                  </div>
              </div>
              )
            })
          }
        </div>
*/
}
