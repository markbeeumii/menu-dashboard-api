import { MenuContext, PageContext } from "@/pages/_app";
import { Menu, Button, rem } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import { date } from "zod";
import {HiOutlineMenuAlt2} from 'react-icons/hi'

type NavbarProps = {
  user?:any;
  username? : string;
  profile?: string;
}

export const Navbar = ({user, username, profile}: NavbarProps) => {
  //console.log("Navbar User => ", user)
  const router = useRouter()
  const isMenu = useContext(MenuContext)
  const handleLogout =()=>{
    isMenu.setMenu(!isMenu.menu)
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push({pathname:'/login'})
  }
  //loading?<Spinner>Loading...</Spinner>: ''
  const isPage= useContext(PageContext)
  return (
    <>
      <div className="nav-bar border-bottom" >

        <div className="d-none d-flex icon-menu" id="menuicons" >
          <div className="float-start" onClick={()=> isPage.setPage(!isPage.page)} >
            <HiOutlineMenuAlt2 color="black" fontSize={35}/>
          </div>
          
          <div className="float-end d-flex">
          
            <p className="m-0 p-2 text-primary fs-6">{user?.username?user.username:username} </p>
            <Menu width={200} shadow="md" >
          <div className="profile mx-1 px-1" id="center">
            <Menu.Target>
                <img className="img-profile" src={user?.profile_picture?user.profile_picture:profile} alt="" width={40} />
            </Menu.Target>
          </div>
            
              <Menu.Dropdown>
                <Menu.Item component="a" href="https://mantine.dev">
                  Setting
                </Menu.Item>

                <Menu.Item onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
          </Menu>
          </div>
        </div>
        
        <div className="cover-right-profile d-flex justify-content-between text-white px-1" id="pic_profile">
          <div className="p-2 d-flex logo-ezy">
            <img src="../godital.png" width={35} alt="" />
            <h6 className="mx-3 text-primary p-1 ">Ezy menu</h6>
          </div>
          <div className="d-flex">
              <p className="m-0 p-2 text-primary fs-5">{user?.username?user.username:username} </p>
              <Menu width={200} shadow="md" >
              <div className="profile mx-1 px-1" id="center">
                <Menu.Target>
                    <img className="img-profile" src={user?.profile_picture?user.profile_picture:profile} alt="" width={40} />
                </Menu.Target>
              </div>
                
                  <Menu.Dropdown>
                    <Menu.Item component="a" href="https://mantine.dev">
                      Setting
                    </Menu.Item>

                    <Menu.Item onClick={handleLogout}>
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
              </Menu>
          </div>
        </div>
      </div>
    </>
  );
};
