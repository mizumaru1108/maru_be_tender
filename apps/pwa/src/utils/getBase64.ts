export const getBase64Upload = async (file: any) => {
  const src = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const encoded = reader.result!.toString().replace(/^data:(.*,)?/, '');
      resolve(encoded);
    };
  });
  return src;
};
// export const encodeBase64Upload = (file: any): Promise<string> => {
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   return new Promise((resolve, reject) => {
//     reader.onloadend = () => resolve(reader.result!.toString());
//     reader.onerror = (error) => reject(error);
//   });
// };
export const encodeBase64Upload = (file: any): Promise<string> => {
  const src = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result!.toString());
    // reader.onerror = (error) => reject(error);
    // reader.onload = () => {
    //   const encoded = reader.result!.toString().replace(/^data:(.*,)?/, '');
    //   resolve(encoded);
    // };
  });
  return src;
};

export const fileToBinary = (file: any): Promise<Uint8Array> => {
  const src = new Promise<Uint8Array>((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onloadend = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const binaryData = new Uint8Array(arrayBuffer);
      console.log(arrayBuffer);
      return resolve(binaryData);
    };
  });
  return src;
};

export const getArrayBuffer = (file: any): Promise<string> => {
  const reader = new FileReader();
  reader.onload = () => {
    const arrayBuffer = reader.result;
    console.log(arrayBuffer);
  };
  reader.readAsArrayBuffer(file);
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result!.toString());
    reader.onerror = (error) => reject(error);
  });
};

export const getBase64Edit = async (file: any) => {
  const src = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const encoded = reader.result!.toString().replace(/^data:(.*,)?/, '');
      resolve(encoded);
    };
  });
  return src;
};

export const encodeBase64Edit = (file: any): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result!.toString());
    reader.onerror = (error) => reject(error);
  });
};

// export const makeId = (length: number) => {
//   return Math.random().toString().substr(2, length);
// };
