import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from "reactstrap";
import { useRouter } from "next/router";

type CardProps={
  id ? : number;
  code ? : string;
  title_en ? : string;
  title_kh ? : string;
  title_ch ? : string;
  description ? : string;
  thumbnail ? : string;
  slug ? : string
  price ? : number
}

export const CardCategory = ({price,id,code, title_en, title_kh, title_ch,thumbnail, description, slug}: CardProps) => {
  const router = useRouter()
  return (
    <>
      <Card style={{ width: "25rem", height: "29.9rem"}}  className="cursor-pointer" onClick={()=> code?'':router.push(`/category/${slug}`)} >
        <img src={thumbnail} alt="" width={'100%'} height={'58%'} className="object-fit cursor-pointer"/>
        <CardBody>
          {/* <CardTitle tag="h5" className="bg-success"> {code} </CardTitle> */}
          {code?<Button>{code}</Button>: ''}
          <CardSubtitle className="mb-2 text-muted">
             <h4 className="text-info"> </h4>
          </CardSubtitle>
          <h4>{title_en}</h4>
          <h4>{title_kh}</h4>
          <h4>{title_ch}</h4>
          {price? <h4>{price}</h4>: ''}
          <CardText className="text-limit">
            {description}
          </CardText>
        </CardBody>
      </Card> 
    </>
  );
};
