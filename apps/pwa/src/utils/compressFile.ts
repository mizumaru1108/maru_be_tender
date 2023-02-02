import imageCompression from 'browser-image-compression';
import { useState } from 'react';

interface ICompressOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
}

/** Compression hook */
export const useCompress = () => {
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const [progress, setProgress] = useState<number>(0);

  const compress = async (file: File, options: ICompressOptions): Promise<File> => {
    try {
      setIsCompressing(true);
      setProgress(0);

      const compressedFile = await imageCompression(file, {
        ...options,
        onProgress: (progress) => {
          setProgress(progress);
          // console.log({ progress });
        },
      });

      setProgress(0);
      setIsCompressing(false);
      return await Promise.resolve(compressedFile);
    } catch (err) {
      setProgress(0);
      setIsCompressing(false);
      return await Promise.reject(err);
    }
  };

  return { progress, isCompressing, compress };
};
