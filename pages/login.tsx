import { z, Schema, ZodSchema } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  NumberInput,
  TextInput,
  Button,
  Box,
  Group,
  Checkbox,
  PasswordInput,
  Notification,
} from "@mantine/core";

import {AiFillGithub} from 'react-icons/ai'
import {BsTelegram, BsFacebook} from 'react-icons/bs'
import { useContext, useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
import { AxiosClient_Cate } from "@/src/libs/AxiosClient";
import { useRouter } from "next/router";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";
import { MenuContext } from "./_app";

export const LoginPage = () => {
  const [isLoading, setLoading] = useState(false);
  const[notifacation, setNotification] = useState(false)
  const[notifacationText, setNotificationText] = useState("")
  const router = useRouter()
  const isMenu = useContext(MenuContext)
  useEffect(() => {
    const time = setTimeout(() => {
      setLoading(false);
    }, 800);
    return ()=> clearTimeout(time)
  }, []);
  const {mutate} = useMutation({
    mutationFn: async(input:any) =>{
      return (await AxiosClient_Cate.post('/user/login', input)).data
    },
    onSuccess: (token:any)=>{
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Successfully`,
        showConfirmButton: false,
        timer: 2000,
      });
      //console.log(token?.token)
      localStorage.setItem('token',token?.token)
      isMenu.setMenu(!isMenu.menu)
      router.push('/')
    },
    onError: (error:any)=>{
      const res = error.response.data.message
      setNotificationText(res)
      setNotification(true)
      // Swal.fire({
      //   icon: "error",
      //   title: "Error!",
      //   text: `${res}`,
      //   showConfirmButton: false,
      //   timer: 2000,
      // });
    }
  })
  
  const schema = z.object({
    //name: z.string().min(2, { message: "Name should have at least 2 letters" }),
    email: z.string().email({ message: "Invalid email" }),
    age: z
      .number()
      .min(18, { message: "You must be at least 18 to create an account" }),
    termsOfService: z.boolean().refine((value) => value === true, {
      message: "You must agree to the terms of service",
    }),
    password: z.string().min(6,{ message: "password must be more than 6 charaters" }),
  });

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      //name: "",
      email: "",
      age: 18,
      password: '',
      termsOfService: false,
    },
  });

  const handleSubmit = (e: any) => {
    //e ? console.log(e) : console.log("Validate");
    const formData = new FormData() as FormData
    formData.append('username', e.name)
    formData.append('email',e.email)
    formData.append('password', e.password)
    mutate(formData)
  };
  isLoading?<Spinner>Loading...</Spinner>:''
  return (
    <>
      <div className={notifacation?"position-absolute top-0 end-0":"d-none"}>
        <Notification color="yellow" h={70} w={350} icon={<IconX size="1.1rem" />}  onClick={()=>setNotification(!notifacation)}>
          {notifacationText}
        </Notification>
      </div>
      <div className="container-fluid mt-3">
        <div className="row">
        <div className="col-6 border-end">
          <div id="login-form p-0">
          <div className="mt-4" id="center">
              <Box className="form-login m-0"  h={600} w={800} miw={380} maw={480} mx="auto">
                <h3 className="text-center text-primary">User Login</h3>
                <form
                  onSubmit={form.onSubmit((values) => handleSubmit(values))}
                  className="px-2"
                >
                  {/* <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="John Doe"
                    mt="sm"
                    {...form.getInputProps("name")}
                  /> */}
                  <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="example@mail.com"
                    {...form.getInputProps("email")}
                    className="my-1"
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Password"
                    {...form.getInputProps("password")}
                    className="my-1"

                  />
                  <Checkbox
                    mt="md"
                    label="I agree to sell my privacy"
                    {...form.getInputProps("termsOfService", {
                      type: "checkbox",
                    })}
                    className="my-1"

                  />

                  <Group position="right" mt="xl">
                    <Button type="submit">Submit</Button>
                  </Group>
                </form>
                {/* <div id="center d-none">
                  <Link href={''}>Singup</Link>
                </div> */}
                <div className="d-block mt-4">
                  <div id="center">
                    <Link href={''} className="mx-3 text-secondary"> <AiFillGithub fontSize={30}  /> </Link>
                    <Link href={''} className="mx-3 text-secondary"> <BsFacebook fontSize={30}  /> </Link>
                    <Link href={''} className="mx-3 text-secondary"> <BsTelegram fontSize={30} /> </Link>
                  </div>
                  </div>
              </Box>
          </div>
          </div>
        </div>
        <div className="col-6 " id="col-6-slide">
          <img src="../loginpage.svg" alt="" />
        </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
