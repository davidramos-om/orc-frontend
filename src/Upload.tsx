import { useState } from "react";

type ScanProps = {
  onUploadFile?: (file: File) => void;
};

const Upload = ({ onUploadFile }: ScanProps) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setFile(file);
      onUploadFile?.(file);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">1. Upload Image</h1>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="imageInput"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 108 0m1-4a9 9 0 11-6 8m6 0V9m0 4v4m0 0h4m-4 0H9"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {file && <img src={URL.createObjectURL(file)} className="mt-4" />}
    </>
  );
};
export default Upload;
