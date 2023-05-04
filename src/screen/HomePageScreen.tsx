import { useMutation, useQuery } from "react-query";
import { Col, Container, Label, Row, Spinner } from "reactstrap";
import { AxiosClient_Cate } from "../libs/AxiosClient";
import { CardCategory } from "../components/CardCategory";
import { useState , useContext} from "react";
import { MenuLeft } from "../components/MenuLeft";
import { Navbar } from "../components/Navbar";
import { MenuContext } from "@/pages/_app";

export const HomePageScreen = () => {
  const [title_en, SetTitle_En] = useState("");
  const [title_kh, SetTitle_Kh] = useState("");
  const [title_ch, SetTitle_Ch] = useState("");
  const [code, SetCode] = useState("");
  const [price, SetPrice] = useState("");
  const [des, SetDes] = useState("");
  const [img, SetImg] = useState("");
  //const[box, setBox] = useState()
  const {mutate} = useMutation({
    mutationFn: async(input:any) =>{
      return (await AxiosClient_Cate.post('/menu/create', input)).data
    },
    onSuccess: ()=>{
      console.log('Success')
    },
    onError: ()=>{
      console.log('error')
    }
  })
  
  // const {data} = useQuery({
  //   queryKey: 'categories',
  //   queryFn: async() => {
  //     return (await AxiosClient_Cate.get('/categories')).data.categories
  //   }
  // })
  // console.log(data)

  const handleChangeBox = (e: any) => {
    e.preventDefault();
    let box = document.getElementById("checkbox1") as HTMLInputElement;

    
     // console.log(box.value);
    
    //console.log(box)
    
  };

  const handleSubmit= (e:any) =>{
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
      img: file || ''
     }
    e.preventDefault();
    const formData = new FormData() as FormData
    formData.append('title_en', input.title_en)
    formData.append('title_kh', input.title_kh)
    formData.append('title_ch', input.title_ch)
    formData.append('code', input.code)
    formData.append('price', input.price)
    formData.append('description', input.des)
    formData.append('image', input.img)

    mutate(formData)
    // const ss = [...formData.values()]
    //console.log([...formData.values()])
    
  }

  const handleSetImage = (e:any) =>{
    e.preventDefault()
    let ImageInput = (document.getElementById('image-upload')) as HTMLElement
    let InputFile = (document.getElementById('file-upload')) as HTMLInputElement
    if(InputFile !== null && InputFile.files !== null && InputFile.files.length > 0){
      SetImg(InputFile.value) 
    }
  }

const isMenu = useContext(MenuContext)
  return (
    <>

      <div className={isMenu.menu?"main-body":"d-none"}>
        <h1 className="text-info m-4">Hello I am from godital 👋 </h1>

        {/* <form action="" className="px-1 form03 mt-4" onSubmit={handleSubmit}>
          <div className="rowcol  d-flex justify-content-between">
            <div className="col-01">
              <h6>Menu Title(EN)</h6>
              <input
                type="text"
                className="input"
                placeholder="title..."
                onChange={(e: any) => SetTitle_En(e.target.value)}
              />
            </div>
            <div className="col-01">
              <h6>Code</h6>
              <input
                type="text"
                className="input"
                placeholder="title..."
                onChange={(e: any) => SetCode(e.target.value)}
              />
            </div>
          </div>
          <div className="rowcol mb-4 d-flex justify-content-between">
            <div className="col-01">
              <h6>Menu Title(KH)</h6>
              <input
                type="text"
                className="input"
                placeholder="title..."
                onChange={(e: any) => SetTitle_Kh(e.target.value)}
              />
            </div>
            <div className="col-01">
              <h6>Menu Title(Chiness)</h6>
              <input
                type="text"
                className="input"
                placeholder="title..."
                onChange={(e: any) => SetTitle_Ch(e.target.value)}
              />
            </div>
          </div>
          <div className="rowcol  d-flex justify-content-between">
            <div className="col-01">
              <h6>Price</h6>
              <input
                type="text"
                className="input"
                placeholder="price..."
                onChange={(e: any) => SetPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="my-4">
            <h6>Description</h6>
            <textarea
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
              <button className="btn btn-add mx-2">Add and Save</button>
              <button type="reset" className="btn btn-save mx-2">Save</button>
            </div>
          </div>
        </form>

        <div className="upload-right">
          <h5>Featured</h5>
          {/* <label  className="custom-file-upload"> Custom Upload </label> x
          <input
            id="file-upload"
            type="file"
            onChange={handleSetImage}
          />

          <div>
            <img id="image-upload" src={img} alt="" />
          </div>
          <div className="my-2">
          {
              data?.map((p:any, index:number) => {
                return(
                  <div className="d-flex" key={ index}>
                  <input
                  type="checkbox"
                  id="checkbox1"
                  className="box01"
                  onChange={handleChangeBox}
                  />
                  <h5 className="mx-3">{p.slug}</h5>
                </div>
                )
              })
             }
          </div>
        </div>*/}
      </div>
    </>
  );
};
