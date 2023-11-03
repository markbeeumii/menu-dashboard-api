//Is to reuse component for loading ...

type LoadingProps={
  status? : string;
  isLoading? : boolean;
  loading ? : boolean;
}

export const LoadingCom = (
  { status, 
    isLoading, 
    loading 
  }: LoadingProps) => {

  return(
    <>
      {
        status==="loading" || isLoading || loading? 
          <div className="pre-loading">
            <div className="cover-loader" role="status">
              <span className="loader"></span>
            </div> 
          </div>
        : ''
      }
    </>
  )
}