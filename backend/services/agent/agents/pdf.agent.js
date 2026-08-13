export const pdfAgent = async (state) => {
    return {
        ...state,
        aiResponse: state.prompt ?? ""
    }
}
