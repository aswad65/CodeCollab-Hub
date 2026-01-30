import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const AI_PROMPT = async (prompt) => {
  if (typeof prompt !== "string") {
    throw new Error("Prompt must be a string");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: `
     You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
    Examples: 

    <example>
 
    response: {

    "text": "this is you fileTree structure of the express server",
    "fileTree": {
        "app.js": {
            file: {
                contents: "
                const express = require('express');

                const app = express();


                app.get('/', (req, res) => {
                    res.send('Hello World!');
                });


                app.listen(3000, () => {
                    console.log('Server is running on port 3000');
                })
                "
            
        },
    },

        "package.json": {
            file: {
                contents: "

                {
                    "name": "temp-server",
                    "version": "1.0.0",
                    "main": "index.js",
                    "scripts": {
                        "test": "echo \"Error: no test specified\" && exit 1"
                    },
                    "keywords": [],
                    "author": "",
                    "license": "ISC",
                    "description": "",
                    "dependencies": {
                        "express": "^4.21.2"
                    }
}

                
                "
                
                

            },

        },

    },
    "buildCommand": {
        mainItem: "npm",
            commands: [ "install" ]
    },

    "startCommand": {
        mainItem: "node",
            commands: [ "app.js" ]
    }
}

    user:Create an express application 
   
    </example>


    
       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
 IMPORTANT : don't use file name like routes/index.js
       
    `,
  });

  const generationConfig = {
    responseMimeType: "application/json",
    temperature: 0.2, // Lower temperature = more stable JSON
  };

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const text = result.response.text();
    return JSON.parse(text); 

  } catch (error) {
    console.error("AI Generation Error:", error);
    return { error: "Invalid AI Response", details: error.message };
  }
};







// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";
// dotenv.config();
// // console.log(process.env.GOOGLE_API_KEY);


// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY,
// });

// export const AI_PROMPT = async (prompt) => {
//   if (typeof prompt !== "string") {
//     throw new Error("Prompt must be a string");
//   }

//   const result = await ai.models.generateContent({
//      model: "gemini-2.5-flash-lite", 
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: prompt }],
        
//       },
//     ],
//  generationConfig : {
//   responseMimeType: "application/json",
//   temperature: 0.4,
// },

// systemInstruction : `
// You are an expert in MERN and Development with 10 years of professional experience.
// You always write modular, scalable, and maintainable code following best practices.

// Guidelines you always follow:
// - Break code into reusable modules
// - Use meaningful and understandable comments
// - Maintain previously written code functionality
// - Handle errors and edge cases properly
// - Write clean, readable, and production-ready code
// - Create files only when necessary
// - Never use file names like routes/index.js

// Response format rules:
// - Always respond in JSON
// - Follow the structure shown in the examples
// - When required, return a file tree with file contents



// `

//   });

//   return result.text;
// };







