import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // ✅ Ensure request body is correctly parsed
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    ## 🔍 Code Review Report
    
    ### ❌ Syntax or Logical Mistakes:
    - Identify syntax errors or logic mistakes in the provided code.
    
    ### 🔧 Suggested Improvements:
    - Best practices to improve readability and maintainability.
    
    ### ⚡ Performance Optimizations:
    - Ways to make the code more efficient.
    
    \`\`\`javascript
    ${code}
    \`\`\`
    `;
    
    const result = await model.generateContent(prompt);
    const review = result.response.text();
    
    return NextResponse.json({ review }, { status: 200 });
    
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 });
  }
}
