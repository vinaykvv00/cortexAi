export const chatAgent = async (state) => {
    return {
        ...state,
        aiResponse: state.prompt ?? ""
    }
}
