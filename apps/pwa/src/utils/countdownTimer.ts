import React from 'react';

export function UitlsCountdownTimer(seconds: number) {
  const [remainingTime, setRemainingTime] = React.useState(seconds);

  React.useEffect(() => {
    if (remainingTime <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  };

  return formatTime(remainingTime);
}

// export function CountdownTimer(seconds: number) {
//   const [remainingTime, setRemainingTime] = React.useState(seconds);

//   React.useEffect(() => {
//     if (remainingTime <= 0) {
//       return;
//     }

//     const timer = setInterval(() => {
//       setRemainingTime((prevTime) => prevTime - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
//   };

//   const formatArabicTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;
//     return `${String(minutes)
//       .padStart(2, '0')
//       .replace(/0|1|2|3|4|5|6|7|8|9/g, (char) =>
//         String.fromCharCode(char.charCodeAt(0) + 1632)
//       )} : ${String(seconds)
//       .padStart(2, '0')
//       .replace(/0|1|2|3|4|5|6|7|8|9/g, (char) => String.fromCharCode(char.charCodeAt(0) + 1632))}`;
//   };

//   return formatArabicTime(remainingTime);
// }
