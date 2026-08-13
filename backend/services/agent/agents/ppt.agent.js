export const pptAgent = async (state) => {
    return {
        ...state,
        aiResponse: state.prompt ?? ""
    }
}
