import dotenv from "dotenv"
dotenv.config()

const createFallbackModel = (content = "chat") => ({
    invoke: async () => ({ content })
})

let groqModel
let geminiModel
let openrouterModel

const loadGroqModel = async () => {
    if (groqModel) {
        return groqModel
    }

    try {
        const { ChatGroq } = await import("@langchain/groq")
        groqModel = new ChatGroq({
            model: "openai/gpt-oss-120b"
        })
    } catch (error) {
        console.warn("Falling back to a stub Groq model:", error?.message ?? error)
        groqModel = createFallbackModel()
    }

    return groqModel
}

const loadGeminiModel = async () => {
    if (geminiModel) {
        return geminiModel
    }

    try {
        const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai")
        geminiModel = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash"
        })
    } catch (error) {
        console.warn("Falling back to a stub Gemini model:", error?.message ?? error)
        geminiModel = createFallbackModel()
    }

    return geminiModel
}

const loadOpenRouterModel = async () => {
    if (openrouterModel) {
        return openrouterModel
    }

    try {
        const { ChatOpenRouter } = await import("@langchain/openrouter")
        openrouterModel = new ChatOpenRouter({
            model: "deepseek/deepseek-chat",
            temperature: 0,
            maxTokens: 2500
        })
    } catch (error) {
        console.warn("Falling back to a stub OpenRouter model:", error?.message ?? error)
        openrouterModel = createFallbackModel()
    }

    return openrouterModel
}


export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return loadGroqModel();
        case "search":
            return loadGroqModel();
        case "coding":
            return loadOpenRouterModel();
        case "imageAnalyzer":
            return loadGeminiModel();

        default:
            return loadGroqModel();
    }
}

