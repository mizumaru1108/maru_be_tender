//  // if (!binary) {
//       //   const trimmedString = 56;
//       //   base64Data.length > 40
//       //     ? base64Data.substring(0, 40 - 3) + '...'
//       //     : base64Data.substring(0, length);
//       //   throw new BadRequestException(
//       //     `Image payload ${i} is not a valid base64 data: ${trimmedString}`,
//       //   );
//       // }

// import { BadRequestException } from "@nestjs/common";

// export const validateBase64Data = (base64Data: string): string => {
//   const trimmedString = 56;
//   return base64Data > 40 ? base64Data.substring(0, 40 - 3) + '...' : base64Data.substring(0, length);
//   throw new BadRequestException(
//     `Image payload is not a valid base64 data: ${trimmedString}`,
//   );
// }
