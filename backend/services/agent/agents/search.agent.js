export const searchAgent = async (state) => {
    return {
        ...state,
        aiResponse: state.prompt ?? ""
    }
}
