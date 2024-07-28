import { useDropzone } from "react-dropzone";
import "../comp/FileDrop.css"; // Import the CSS file

export default function FileDropZone({ onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps({
        className: `dropzone ${isDragActive ? "dropzone-active" : ""}`,
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop your file here ...</p>
      ) : (
        <p>Drag & drop a file, or click to select files</p>
      )}
    </div>
  );
}
