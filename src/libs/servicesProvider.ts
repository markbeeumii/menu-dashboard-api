

//Function check valid slug 
export const isValidSlug =  (e: string , data: any | any[], skip? : string)=>{
  if(!skip){
    const res = data?.map((p:any) => p.slug?.toLowerCase() === e?.toLowerCase());
    let val : boolean = false;
    for(let i=0; i< res.length; i++){
      if(res[i]===true){
        val = true;
        break;
      }else {
        val = false;
      }
    }
    return val;
  }else{
    const res = data?.map((p:any) => {
      if(p?.slug?.toLocaleLowerCase() !== skip?.toLocaleLowerCase()){
        return p.slug
      }else{
        return null
      }
    })?.filter((f:any,i:number)=> f !== null)
    const slug = res?.map((x:any) => x.toLowerCase() === e?.toLowerCase())
    let val : boolean = false;
    for(let i=0; i < slug.length; i++){
      if(slug[i]===true){
        val = true;
        break;
      }else {
        val = false;
      }
    }
    return val;
  }
}

