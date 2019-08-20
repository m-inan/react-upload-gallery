export const getBody = xhr => {
  const text = xhr.responseText || xhr.response;

  if (!text) return text;

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

export const bytesToSize = bytes => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) return "0 Byte";

  const log = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Math.round(bytes / Math.pow(1024, log), 2) + " " + sizes[log];
};

export const getEventFiles = event => {
  if (!event.dataTransfer) {
    return [];
  }

  return event.dataTransfer.files;
};

export const isAccepted = (fileType, acceptedFiles) => {
  if (fileType && acceptedFiles) {
    const mimeType = fileType || "";
    const baseMimeType = mimeType.replace(/\/.*$/, "");

    return acceptedFiles.some(type => {
      const validType = type.trim();

      if (validType.endsWith("/*")) {
        return baseMimeType === validType.replace(/\/.*$/, "");
      }

      return mimeType === validType;
    });
  }
  return true;
};

export const getImageDimensions = data => {
  return new Promise(resolve => {
    const image = new Image();

    image.onload = () => {
      const { width, height } = image;

      resolve({ width, height });
    };

    image.src = data;
  });
};

export const arrayMove = (array, from, to) => {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);

  return array;
};
