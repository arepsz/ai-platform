"use client"

import * as z from "zod";
import axios from "axios";
import { Heading } from "@/components/heading"
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import OpenAI from 'openai';
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const CodePage = () => {
    const proModal = useProModal()
    const router = useRouter();
    const [messages, setMessages] = useState<OpenAI.Chat.Completions.ChatCompletionMessageParam[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const userMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam =
            {
              role: 'user',
              content: values.prompt,
            }
            const newMessages = [...messages, userMessage]

            const response = await axios.post("/api/code", {
                messages: newMessages
            })

            setMessages((current) => [...current, userMessage, response.data])

            form.reset()
        } catch (error: any) {
            if(error?.response?.status === 403){
                proModal.onOpen()
            }else{
                toast.error("Something went wrong")
            }
        } finally {
            router.refresh()
        }
    }

    return (
        <div>
            <Heading 
                title="Code Generation"
                description="Generate code by describing what you desire."
                icon={Code}
                iconColor="text-yellow-700"
                bgColor="bg-yellow-700/20"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4
                            px-3 md:px-6 focus-within: shadow-sm
                            grid grid-cols-12 gap-2"
                        >
                            <FormField 
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12
                                    lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="text-white border-0 outline-none
                                                focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Generate a simple React button component"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full"
                            disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="rounded-lg w-full flex
                        items-center justify-center bg-[#595959]">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <div>
                            <Empty label="No converstation started."/>
                        </div>
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div 
                                key={message.content}
                                className={cn(
                                    "text-white p-8 w-full flex items-start gap-x-8 rounded-lg",
                                    message.role === "user" ? "bg-[#595959] border border-black/10" : "bg-[#595959]"
                                    )}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkdown
                                    components={{
                                        pre: ({node, ...props}) => (
                                            <div className="overflow-auto w-full text-white
                                            my-2 bg-black/30 p-2 rounded-lg">
                                                <pre {...props}/>
                                            </div>
                                        ),
                                        code: ({node, ...props}) => (
                                            <code className="bg-black/30 rounded-lg p-1 text-white"
                                            {...props}/>
                                        )
                                    }}
                                    className="text-sm overflow-hidden leading-7"
                                >
                                    {message.content || ""}
                                </ReactMarkdown>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CodePage;