import React, { useRef, useState } from "react";
import axios from "axios";

const Upload = ({ title, format }) => {
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = new FormData();
    body.append("file", file);

    try {
      const response = await fetch("/api/traceupload", {
        method: "POST",
        body,
      });
    } catch (error) {
      console.error("Failed to submit files.");
      setError("File upload failed");
    }
  };

  const uploadToClient = (event) => {
    setError(null);
    if (
      event.target.files &&
      event.target.files[0] &&
      event.currentTarget.files[0].name.endsWith(format)
    ) {
      const i = event.target.files[0];

      setFile(i);
      setCreateObjectURL(URL.createObjectURL(i));
    } else {
      setError("The file must be " + format);
    }
  };

  const clear = () => {
    setFile(null);
    setCreateObjectURL(null);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (typeof bytes !== "number") return "n/a";
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div>
      <p>{title}</p>

      <div className="form-container">
        {/* Display the files to be uploaded */}
        <div>
          <ul>
            {file && (
              <li key={file.name}>
                <span>
                  {file.name}, {formatBytes(file.size)}{" "}
                  <button onClick={clear}>Clear</button>
                </span>
              </li>
            )}
          </ul>
        </div>

        {!file && (
          <div>
            <button onClick={() => inputRef.current.click()}>
              Select File
            </button>
            <input
              ref={inputRef}
              type="file"
              style={{ display: "none" }}
              onChange={uploadToClient}
              accept={format}
            />
          </div>
        )}
      </div>

      <div className="submit">
        <button onClick={handleSubmit} disabled={!file}>
          Submit
        </button>
        {error && (
          <span style={{ color: "red", fontWeight: "bold" }}>{error}</span>
        )}
      </div>
    </div>
  );
};

export default Upload;
