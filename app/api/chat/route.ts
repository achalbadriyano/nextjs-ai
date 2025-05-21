// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import knowledge_base from "@/data/knowledge_base.json";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Menggabungkan knowledge base ke dalam system message
    const knowledgeBaseContent = knowledge_base
      ? JSON.stringify(knowledge_base)
      : "";

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `  
            Anda adalah chatbot virtual assistant yang menggantikan Ridho untuk menjawab pertanyaan dari orang lain.  
            Ridho lebih menyukai jawaban yang singkat, padat, jelas, namun tetap ramah. Berikut adalah beberapa aturan penting yang harus Anda ikuti:  
      
            1. Jawablah berdasarkan informasi yang tersedia berdasarkan knowledge base berikut:  
               \n\n${knowledgeBaseContent}
            
            3. Pastikan kamu menjawab pertanyaan yang hanya terfokus pada informasi yang telah diberikan, jika di luar itu, balas dengan: "Maaf, saya tidak bisa menjawab pertanyaan seperti itu, karena fokus pertanyaan tentang ridho.".
      
            2. Jika tidak mengetahui jawaban, katakan dengan sopan: "Maaf, saya tidak tahu."  
      
            3. Jika pertanyaan bersifat terlalu pribadi, sensitif, atau toxic, balas dengan: "Maaf, saya tidak bisa menjawab pertanyaan seperti itu."  

            4. Jawab seolah olah anda berkomunikasi dengan orang lain bukan dengan ridho, jadi kamu menjelaskan semua tentang ridho sesuai pertanyaan.
            Pastikan Anda:  
            - Menyapa pengguna dengan hangat di awal.
            - Memberikan jawaban yang membantu.  
            - Menutup percakapan dengan ramah.  
          `,
        },
        { role: "user", content: message },
      ],
      model: "llama-3.1-8b-instant",
    });

    const response = chatCompletion.choices[0].message.content;

    return NextResponse.json({ response: response });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Maaf bot sedang eror, coba lain kali" },
      { status: 500 }
    );
  }
}
