import { useState } from "react";
import axios from "axios";
import ServiceWorkerButton from "./ServiceWorkerButton";

type ScanProps = {
  file?: File;
  onScanComplete?: (result: unknown) => void;
};

const languages = [
  {
    code: "jpn",
    name: "Japanese",
  },
  {
    code: "eng",
    name: "English",
  },
];

const Scan = ({ file, onScanComplete }: ScanProps) => {
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<{ code: string; name: string }>(
    languages[0]
  );

  const handleScanImage = async () => {
    try {
      if (!file) {
        setError("Please select a file to upload");
        return;
      }

      const filename = Date.now() + file.name;
      const data = new FormData();
      data.append("name", filename);
      data.append("image", file);
      data.append("language", language.code);

      const res = await axios.post("http://localhost:3000/upload", data);
      console.dir({ res }, { depth: null });
      setError(null);
      onScanComplete?.(res.data);
    } catch (error) {
      if (error instanceof Error)
        setError("Error uploading image: " + error.message);
      else setError("An error occurred uploading the image");
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">2. Scan Image</h1>
      <p className="mb-2 text-md text-gray-800">
        Select the language of the text in the image
      </p>
      <select
        className="w-full px-4 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        value={language.code}
        onChange={(e) => {
          const selectedLanguage = languages.find(
            (lang) => lang.code === e.target.value
          );
          if (selectedLanguage) setLanguage(selectedLanguage);
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <hr className="my-4" />
      <button
        onClick={handleScanImage}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Scan Image
      </button>
      <hr className="my-4" />
      <ServiceWorkerButton
        file={file}
        languages={[language.code]}
        onScanComplete={onScanComplete}
      />
      {error && <p className="text-center text-red-500">{error}</p>}
    </>
  );
};

export default Scan;
