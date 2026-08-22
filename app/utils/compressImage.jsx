import imageCompression from "browser-image-compression";
export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    console.log(
      "Original:",
      (file.size / 1024 / 1024).toFixed(2),
      "MB"
    );

    console.log(
      "Compressed:",
      (compressedFile.size / 1024 / 1024).toFixed(2),
      "MB"
    );

    return compressedFile;
  } catch (error) {
    console.error(error);
    return file;
  }
};