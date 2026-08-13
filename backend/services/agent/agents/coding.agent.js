export const codingAgent = async (state) => {
    return {
        ...state,
        aiResponse: state.prompt ?? ""
    }
}
