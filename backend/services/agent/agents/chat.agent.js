import { getModel } from "../config/llmModels.js"

export const chatAgent = async (state) => {
    try {
        const llm = await getModel("chat")
        const response = await llm.invoke(state.prompt)

        return {
            ...state,
            aiResponse: response.content,
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to generate chat"
        }
    }
}