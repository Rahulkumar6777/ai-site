"use client";

import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { amountOption, formSchema, resolutionOption } from "./constants";

import axios from "axios";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import OpenAI from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const ImagePage = () => {
  const router = useRouter();

  const [images,setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "512x512"
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setImages([]);
      const response = await axios.post("/api/image", values);

      const urls = response.data.map((image: {url: string}) => image.url );

      setImages(urls);
      form.reset();
    } catch (error: any) {
      //ToDo: Open Pro model
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Image Generation"
        description="Turn your prompt into an image"
        icon={ImageIcon}
        iconColor="text-pink-600"
        bgColor="bg-pink-600/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-6">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Tree Image"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            <FormField 
              
              control={form.control}
              name="amount"
              render={({field})=>(
                <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                          defaultValue={field.value}
                          
                          
                          />

                          
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {
                          amountOption.map((option) =>(
                            <SelectItem 
                            key={option.value}
                            value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                </FormItem>
              )}
              
              
              />
              <FormField 
              
              control={form.control}
              name="resolution"
              render={({field})=>(
                <FormItem className="col-span-12 lg:col-span-2">
                    <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                          defaultValue={field.value}
                          
                          
                          />

                          
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {
                          resolutionOption.map((option) =>(
                            <SelectItem 
                            key={option.value}
                            value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                </FormItem>
              )}
              
              
              />

              <Button
                className="col-span-12 lg:col-span-2 w-full bg-violet-500 hover:bg-violet-700"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <Empty label="No images generated" />
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
