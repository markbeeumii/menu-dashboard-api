import { useState } from "react";
import { SetToUpperCase, trimToTwoDecimalPlaces } from "../libs/CapitalizaText";
import Swal from "sweetalert2";
import { AxiosClient_Cate } from "../libs/AxiosClient";
import { useMutation } from "react-query";

type ButtonProps={
  inputArray ? : any
  setInputArray ? :any
}


export const Button = ({inputArray, setInputArray}: ButtonProps) => {
  //const [inputArray, setInputArray] = useState([{ size: '', price: '' }]);

  
  const handleChangeInput = (index:any, key:any, value:any,e:any) => {
    e.preventDefault()
    const newInputArray = [...inputArray];
    const newInputObject = { ...newInputArray[index], [key]: value };
    newInputArray[index] = newInputObject;
    setInputArray(newInputArray);
  };
  
  const handleDeleteInput = (index:any,e:any) => {
    e.preventDefault()
    const newInputArray = [...inputArray];
    newInputArray.splice(index, 1);
    setInputArray(newInputArray);
  };
  
  const handleAddInput = (e:any) => {
    e.preventDefault()
    const newInputArray = [...inputArray, { size: '', price: '' }];
    setInputArray(newInputArray);
  };

  // if(valueUpdate){
  //   valueUpdate.forEach((p:any,index:number)=>{
  //     const newInputArray = [...inputArray];
  //     const newInputObject = { ...newInputArray[index], ['size']: p?.size, ['price']: p?.price };
  //     newInputArray[index] = newInputObject;
  //     setInputArray(newInputArray);
  //   })
  // }

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
            <button type="reset" className="btn btn-primary p-1" onClick={(e:any) => handleDeleteInput(index,e)}>Delete</button>
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