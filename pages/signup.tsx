//import *as z from "zod";
import { joiResolver, useForm, zodResolver } from "@mantine/form";
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
import { AiFillGithub } from "react-icons/ai";
import { BsTelegram, BsFacebook } from "react-icons/bs";
import { useEffect, useState } from "react";
import { Spinner } from "reactstrap";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
import { AxiosClient_Cate } from "@/src/libs/AxiosClient";
import { useRouter } from "next/router";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";
import path from "path";
import Joi from "joi";

export const SignupPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [notifacation, setNotification] = useState(false);
  const [notifacationText, setNotificationText] = useState("");
  const router = useRouter();
  useEffect(() => {
    setLoading(!isLoading);
  }, []);
  const { mutate } = useMutation({
    mutationFn: async (input: any) => {
      return (await AxiosClient_Cate.post("/user/signup", input)).data;
    },
    onSuccess: (res:any) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Successfully`,
        showConfirmButton: false,
        timer: 2000,
      });
      //console.log(res)
      router.push("/");
    },
    onError: (error: any) => {
      const res = error.response.data.message;
      setNotificationText(res);
      setNotification(!notifacation);
      // Swal.fire({
      //   icon: "error",
      //   title: "Error!",
      //   text: `${res}`,
      //   showConfirmButton: false,
      //   timer: 2000,
      // });
    },
  });

  const schema = Joi.object({
    name: Joi.string().min(2).message(
   'Name should have at least 2 letters'),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .message('Invalid email'),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.any().equal(Joi.ref('password'))
                  .required()
                  .label('Confirm password')
                  .options({ messages: { 'any.only': '{{#label}} does not match'} }),
    termsOfService: Joi.boolean().valid(true).required().messages({
                    'any.only': 'You must agree to the terms and conditions to proceed.'
                  })
  });

  

  const handleSubmit = (e: any) => {
    //e ? console.log(e) : console.log("Validate");
    const formData = new FormData() as FormData;
    formData.append("username", e.name);
    formData.append("email", e.email);
    formData.append("password", e.password);
    mutate(formData);
  };

    const form = useForm({
      validate: joiResolver(schema),
      initialValues: {
        name: '',
        email: '',
        password:'',
        confirmPassword:'',
        termsOfService: false
      },
    })
  return (
    <>
      <div className={notifacation ? "d-flex justify-content-end" : "d-none"}>
        <Notification
          w={350}
          icon={<IconX size="1.1rem" />}
          color="red"
          onClick={() => setNotification(!notifacation)}
        >
          {notifacationText}
        </Notification>
      </div>
      <div id="center">
        <div className=" mt-4">
          {isLoading ? (
            <Spinner>Loading...</Spinner>
          ) : (
            
            <Box
              className="bg-light p-2"
              h={620}
              w={480}
              miw={390}
              maw={480}
              mx="auto"
            >
              <h3 className="text-center text-primary">User Create</h3>
              <form
                onSubmit={form.onSubmit((values) => handleSubmit(values))}
                className="p-1"
              >
                <TextInput
                  withAsterisk
                  label="Name"
                  placeholder="John Doe"
                  mt="sm"
                  {...form.getInputProps("name")}
                />
                <TextInput
                  withAsterisk
                  label="Email"
                  placeholder="example@mail.com"
                  {...form.getInputProps("email")}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Password"
                  {...form.getInputProps("password")}
                  withAsterisk
                />
                <PasswordInput
                  mt="sm"
                  label="Confirm password"
                  placeholder="Confirm password"
                  {...form.getInputProps("confirmPassword")}
                  withAsterisk
                />

                <Checkbox
                  mt="md"
                  label="I agree to sell my privacy"
                  {...form.getInputProps("termsOfService", {
                    type: "checkbox",
                  })}
                />

                <Group position="right" mt="xl">
                  <Button type="submit">Submit</Button>
                </Group>
              </form>
              <div id="center">
                <Link href={"/login"}>Login</Link>
              </div>
              <div className="d-block mt-4">
                <div id="center">
                  <Link href={""} className="mx-3 text-secondary">
                    {" "}
                    <AiFillGithub fontSize={30} />{" "}
                  </Link>
                  <Link href={""} className="mx-3 text-secondary">
                    {" "}
                    <BsFacebook fontSize={30} />{" "}
                  </Link>
                  <Link href={""} className="mx-3 text-secondary">
                    {" "}
                    <BsTelegram fontSize={30} />{" "}
                  </Link>
                </div>
              </div>
            </Box>
          )}
        </div>
      </div>
    </>
  );
}

export default SignupPage
