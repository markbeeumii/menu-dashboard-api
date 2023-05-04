import Link from "next/dist/client/link"
import {GrFormNext} from 'react-icons/gr'
import submenus from "./DataMenu"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { PageActive, PageContext } from "@/pages/_app"
import {BsChevronDown} from 'react-icons/bs'
import { IconCalendarStats, IconChevronLeft, IconChevronRight ,
  IconLock, IconNotes,IconGauge,IconPresentationAnalytics,IconFileAnalytics, IconAdjustments
} from '@tabler/icons-react';

import { type } from "os"

type MenuLeftProps={
  handleSetUser? :any
}


export const MenuLeft= ({handleSetUser}:MenuLeftProps) =>{
  const [active, setActive] = useState(0)
  const router = useRouter()
  const menus = submenus
  
  const isPage = useContext(PageContext)
  const isPageActive = useContext(PageActive)
  
  return(
    <>

        <div className="menu-left border-end bg-light" id="menu-pc" onClick={handleSetUser}>
          {/* {isPage.page?<h3 className="text-white m-0 p-2 mt-1">Admin Dashboard</h3>:''} */}
        <ul>
          {
            menus.map((p:any, index:number) => {
              return(
                <span  className="cover-link" key={index} >
                  <button   className={index===active?"link bg-info":"link"} onClick={()=> {setActive(index),router.push(`${p.url}`)}} >
                     {p.name}  
                     {index===0?"": index===active?<BsChevronDown color="white" fontSize={20} />:<GrFormNext color="white" fontSize={20} />} 
                  
                 </button> 
                 <ul className={active===index?'': 'd-none'} onClick={()=>setActive(active===index?active:0)}>

                 {
                  p.children? p.children.map((s:any, i:number) => {
                    return(
                        <Link className="link3"  href={s.url} key={i} > {s.name} </Link>
                    )
                  }) : ''
                 }
                </ul> 

                </span>
              )
            })
          }
          {/* <button  className="link  "> 
          Categories 
            <nav><GrFormNext className="gr-next" /> </nav>
          </button> 
        <Link href={''} className="link"> Menus </Link> */}
        </ul>
      </div>



      {
        isPage.page?<div className="menu-left border-end bg-light" id="menu-phone" onClick={handleSetUser}>
        {/* {isPage.page?<h3 className="text-white m-0 p-2 mt-1">Admin Dashboard</h3>:''} */}
        <ul >
          {
            menus.map((p:any, index:number) => {
              return(
                <span  className="cover-link" key={index} >
                  <button   className={index===active?"link bg-menu":"link"} onClick={()=> {setActive(index),router.push(`${p.url}`)}} >
                    {p.name}  
                    {index===0?"": index===active?<BsChevronDown color="white" fontSize={18} />:<GrFormNext color="white" fontSize={20} />} 
                  
                </button> 
                <ul className={active===index?'': 'd-none'} onClick={()=>setActive(active===index?active:0)}>

                {
                  p.children? p.children.map((s:any, i:number) => {
                    return(
                        <Link className="link3"  href={s.url} key={i} > {s.name} </Link>
                    )
                  }) : ''
                }
                </ul> 

                </span>
              )
            })
          }
          {/* <button  className="link  "> 
          Categories 
            <nav><GrFormNext className="gr-next" /> </nav>
          </button> 
          <Link href={''} className="link"> Menus </Link> */}
        </ul> 
    </div>:''
      }
 
    </>
  )
}



export async function getStaticPaths() {
  const paths = submenus.map((submenu) => ({
    params: { submenu: submenu.url.substring(1) }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }:any) {
  const submenu = submenus.find((s) => s.url === `/${params.submenu}`);

  return { props: { submenu } };
}




/*
      <div className={isPage.page?"d-none":"menu-left border-end"} onClick={handlesetUser}>
        {/* {isPage.page?<h3 className="text-white m-0 p-2 mt-1">Admin Dashboard</h3>:''} 
        <ul >
          {
            menus.map((p:any, index:number) => {
              return(
                <span  className="cover-link" key={index} onClick={handleActive}>
                  <button   className={index===active?"link bg-info":"link"} onClick={()=> {setActive(index),router.push(`${p.url}`)}} >
                     {p.name}  
                     {index===0?"": index===active?<BsChevronDown color="white" fontSize={20} />:<GrFormNext color="white" fontSize={20} />} 
                  
                 </button> 
                 <ul className={active===index?'': 'd-none'} onClick={()=>setActive(active===index?active:0)}>

                 {
                  p.children? p.children.map((s:any, i:number) => {
                    return(
                        <Link className="link3"  href={s.url} key={i} > {s.name} </Link>
                    )
                  }) : ''
                 }
                </ul> 

                </span>
              )
            })
          }
          {/* <button  className="link  "> 
          Categories 
            <nav><GrFormNext className="gr-next" /> </nav>
          </button> 
          <Link href={''} className="link"> Menus </Link> 
        </ul>
      </div>
   
*/