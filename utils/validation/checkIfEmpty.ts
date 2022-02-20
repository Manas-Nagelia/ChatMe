const checkIfEmpty = (data: string) => {
    let result;
    (data.trim() === "") ? result = true : result = false;
    return result;
}

export default checkIfEmpty;