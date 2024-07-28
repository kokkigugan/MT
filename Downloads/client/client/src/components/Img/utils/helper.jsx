export const loadImage = (uri, desiredWidth, desiredHeight) => {
    let finalWidth = 0;
    let finalHeight = 0;
    const image = new Image();
    image.src = uri;
    image.crossOrigin = "anonymous"; // Ensure cross-origin requests are allowed
  
    return new Promise((resolve, reject) => {
      image.onload = function () {
        const { width, height } = image;
  
        const widthFit = desiredWidth / width; // targetWidth / actual width
        const heightFit = desiredHeight / height; // targetHeight / actual width
        const scale = widthFit > heightFit ? heightFit : widthFit;
  
        finalWidth = width * scale;
        finalHeight = height * scale;
  
        // If the size is less than the desired one, adjust to maintain aspect ratio
        if (finalWidth < desiredWidth) {
          const difference = desiredWidth / finalWidth;
          finalWidth = finalWidth * difference;
          finalHeight = finalHeight * difference;
        }
  
        if (finalHeight < desiredHeight) {
          const difference = desiredHeight / finalHeight;
          finalWidth = finalWidth * difference;
          finalHeight = finalHeight * difference;
        }
  
        // Calculate the initial scale as a percentage
        const initialScale = (finalWidth / width) * 100;
  
        const orientation = height > width ? "portrait" : "landscape";
  
        console.log("Image loaded:", {
          image,
          height: finalHeight,
          width: finalWidth,
          scale: initialScale,
          orientation,
          actualSize: {
            width,
            height,
          },
        });
  
        resolve({
          image,
          height: finalHeight,
          width: finalWidth,
          scale: initialScale,
          orientation,
          actualSize: {
            width,
            height,
          },
        });
      };
  
      image.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(error);
      };
    });
  };
  