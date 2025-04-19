"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form} from "@/components/ui/form"
import Link from "next/link";
import {toast} from "sonner";
import FormFields from "@/components/FormFields";
import {useRouter} from "next/navigation";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email:z.string().email(),
        password: z.string().min(3),
    })
}

const AuthForm = ({type}:{type: FormType}) => {
    const formSchema = authFormSchema(type);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type === "sign-up") {
                toast.success("Account created successfully.Please Sign in")
                router.push(`/sign-in`)
            }else{
                toast.success("Sign in successfully.")
                router.push(`/`)
            }
        }catch(err){
            console.log(err);
            toast.error(`There was an error: ${err}`)
        }
    }

    const isSignIn = type === "sign-in"
    return (
        <div className={`card-border lg:min-w-[566px]`}>
            <div className={`flex flex-col gap-6 card py-14 px-10`}>
                <div className={`flex flex-row gap-2 justify-center`}>
                    <Image src="/logo.svg" alt="Logo" height={32}
                           width={38} />
                    <h2 className={`text-primary-100`}>PrepWise</h2>
                </div>
    <h3>Practice job interview with AI</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {!isSignIn && (
                        <FormFields
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Your Name"
                        />
                    ) }
                    <FormFields
                        control={form.control}
                        name="email"
                        label="Email"
                        placeholder="Your Email"
                        type="email"
                    />
                    <FormFields
                        control={form.control}
                        name="password"
                        label="Password"
                        placeholder="Your Password"
                        type="password"
                    />
                    <Button className={`btn-primary w-full`} type="submit">{isSignIn ? "Sign in" : "Create an Account"}</Button>
                </form>
            </Form>

                <p className={`text-center`}>
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link href={isSignIn ? `/sign-up` : `/sign-in`} className={`font-bold text-user-primary ml-1`}>
                        {isSignIn ? "Sign up" : "Sign in"}
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default AuthForm
