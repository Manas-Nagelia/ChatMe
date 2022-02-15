const removeWhitespace = (data: string) => {
  return data.trim().replace(/ +/g, "");
};

export default removeWhitespace;
