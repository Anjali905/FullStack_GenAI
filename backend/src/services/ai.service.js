const {GoogleGenAI} = require("@google/genai");
const {z} = require("zod");
const{zodToJsonSchema} = require("zod-to-json-schema");
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `You are an AI interview report generator.
                    Return ONLY valid JSON that strictly follows this structure.

                    Do NOT include markdown, explanations, or extra text.
                    Do NOT flatten objects into arrays of strings.
                    Do NOT add extra fields.

                    The JSON MUST have:

                    {
                    "matchScore": <number 0-100>,
                    "title": "<job title>",
                    "technicalQuestions": [
                        {
                        "question": "<string>",
                        "intention": "<string>",
                        "answer": "<string>"
                        }
                    ],
                    "behavioralQuestions": [
                        {
                        "question": "<string>",
                        "intention": "<string>",
                        "answer": "<string>"
                        }
                    ],
                    "skillGaps": [
                        {
                        "skill": "<string>",
                        "severity": "low" | "medium" | "high"
                        }
                    ],
                    "preparationPlan": [
                        {
                        "day": <number>,
                        "focus": "<string>",
                        "tasks": ["<string>", "..."]
                        }
                    ]
                    }

                    Rules:

                    1. technicalQuestions MUST be an array of objects. Each object MUST have keys: question, intention, answer.
                    2. behavioralQuestions MUST be an array of objects. Each object MUST have keys: question, intention, answer.
                    3. skillGaps MUST be an array of objects. Each object MUST have keys: skill, severity (choose low, medium, or high).
                    4. preparationPlan MUST be an array of objects. Each object MUST have keys: day (number), focus (string), tasks (array of strings).
                    Do NOT return:
                    ["question", "Explain...", "intention", "To test..."]
                    Generate:

                    - 5 technicalQuestions
                    - 3 behavioralQuestions
                    - 3 skillGaps
                    - 7 preparationPlan days

                    Example object for technicalQuestions:

                    {
                    "question": "Explain React reconciliation.",
                    "intention": "To test understanding of React rendering.",
                    "answer": "Discuss virtual DOM, diffing algorithm, and reconciliation process."
                    }

                    Example object for behavioralQuestions:

                    {
                    "question": "Tell me about a time you handled a difficult teammate.",
                    "intention": "To evaluate conflict resolution skills.",
                    "answer": "Use the STAR method to describe the situation."
                    }

                    Example object for skillGaps:

                    {
                    "skill": "TypeScript",
                    "severity": "medium"
                    }

                    Example object for preparationPlan:

                    {
                    "day": 1,
                    "focus": "React Fundamentals",
                    "tasks": [
                        "Review React components and hooks",
                        "Practice building reusable components",
                        "Study lifecycle and rendering"
                    ]
                    }

                    Inputs:

                    Resume:
                    ${resume}

                    Self Description:
                    ${selfDescription}

                    Job Description:
                    ${jobDescription}
                    `



    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })
    console.log(response.text);
    return JSON.parse(response.text)


}


module.exports = {generateInterviewReport};