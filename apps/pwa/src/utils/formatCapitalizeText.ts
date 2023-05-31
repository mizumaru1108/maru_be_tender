export const formatCapitalizeText = (text: string) => {
  // const words = 'TEST_(WILL_DELETE)'.toLowerCase().split(/[_+-\s]/);
  const words = text.toLowerCase().split(/[_+-\s]/);
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const finalFormattedWords = capitalizedWords.map((word) => {
    const index = word.indexOf('(');
    if (index !== -1 && word.length > index + 1) {
      const charAfterOpeningBracket = word.charAt(index + 1).toUpperCase();
      return word.slice(0, index + 1) + charAfterOpeningBracket + word.slice(index + 2);
    }
    return word;
  });
  // console.log('finalFormattedWords', finalFormattedWords.join(' '));
  return finalFormattedWords.join(' ');
};

// export const formatCapitalizeText = (text: string) => {
//   const words = text.split(/[_+-\s]/).filter((word) => word.length > 0);

//   const formattedWords = words.map((word) => {
//     const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
//     return capitalizedWord.replace(/([A-Z])/g, ' $1');
//   });

//   const finalFormattedWords = formattedWords.map((word) => {
//     const index = word.indexOf('(');
//     if (index !== -1 && word.length > index + 1) {
//       const charAfterOpeningBracket = word.charAt(index + 1).toUpperCase();
//       return word.slice(0, index + 1) + charAfterOpeningBracket + word.slice(index + 2);
//     }
//     return word;
//   });

//   return finalFormattedWords.join(' ');
// };
