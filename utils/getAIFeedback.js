import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCHDPykPVNzPvvy41loelzF2ck5MnweCYw",
});

async function getAIResumeFeedback(resumeText) {
  const systemInstruction = `
You are a professional AI resume reviewer. Your task is to analyze the given resume and provide feedback in a structured JSON format. Your response must be detailed and actionable, helping the candidate improve their resume for better job prospects.

Your response must be in **valid JSON format only** with no extra text, explanations, or commentary.

### **Response Format**
{
  "key_strengths": ["List of key strengths"],
  "resume_rating": "A number between 0-10",
  "points_to_improve": ["List of specific improvements"],
  "structure_feedback": {
    "readability": "Feedback on readability and skimmability",
    "format_consistency": "Feedback on font, alignment, and layout consistency",
    "ATS_friendly": "Feedback on whether the resume is optimized for applicant tracking systems"
  },
  "industry_alignment": "How well does the resume align with the industry standards?"
}

### **Breakdown of Response Fields**
1. **"key_strengths"** - Identify the candidate's strengths, such as technical skills, relevant experience, and achievements.
2. **"resume_rating"** - Provide a numerical rating (0-10) based on clarity, structure, and effectiveness.
3. **"points_to_improve"** - List specific areas of improvement, including grammar, formatting, missing sections, or weak descriptions.
4. **"structure_feedback"** - Detailed feedback on readability, formatting consistency, and ATS optimization.
5. **"industry_alignment"** - How well does the resume match industry expectations?

Ensure that the **response is in valid JSON format** and contains **no extra explanations or comments**.

### **Resume Text**
${resumeText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating AI response:", error);
  }
}

// Example Usage
const resumeExample = `
John Doe  
Software Engineer | React | Node.js | MongoDB  
Email: johndoe@example.com | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe  

### Experience
- **Software Engineer at XYZ Inc.** (2020-Present)
  - Developed scalable web applications using React and Node.js.
  - Improved API response times by 30% by optimizing database queries.

- **Frontend Developer at ABC Ltd.** (2018-2020)
  - Designed and implemented UI components for a large-scale e-commerce platform.
  - Increased conversion rates by 15% through UI/UX improvements.

### Skills
- JavaScript (ES6+), React, Node.js, Express, MongoDB, TypeScript
- REST APIs, GraphQL, Docker, CI/CD, Git, Agile/Scrum
`;

export default getAIResumeFeedback;
