import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

import {increaseApiLimit, checkApiLimit} from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const {messages} = body

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
          }
          if (!openai.apiKey) {
            return new NextResponse('OpenAI API Key not configured', { status: 500 });
          }
          if (!messages) {
            return new NextResponse('Messages are required', { status: 400 });
          }
          
          const isPro = await checkSubscription()
          const freeTrial = await checkApiLimit()
          if(!freeTrial && !isPro){
            return new NextResponse("Free trial has expired.", {status: 403})
          }

          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages,
          });
          
          if(!isPro) {
            await increaseApiLimit();
          }
          
          return NextResponse.json(response.choices[0].message);
      
    } catch (error) {
        console.log("[CONVERSATIN_ERROR]", error);
        return new NextResponse("Internal error", {status: 500})
    }
}