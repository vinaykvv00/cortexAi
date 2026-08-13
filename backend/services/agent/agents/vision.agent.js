export const visionAgent = async (state) => {
    return {
        ...state,
        aiResponse: state.prompt ?? ""
    }
}
