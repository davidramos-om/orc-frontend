import { useState } from "react";

import Upload from "./components/Upload";
import Scan from "./components/Scan";
import Results from "./components/Results";

function App() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [resultText, setResultText] = useState<unknown>(null);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="lg:w-1/3 h-screen w-full mb-4 lg:mb-0 pr-0 lg:pr-4 bg-blue-100 p-4">
        <Upload onUploadFile={setFile} />
      </div>
      <div className="lg:w-1/3 h-screen w-full mb-4 lg:mb-0 pr-0 lg:pr-4 bg-purple-100 p-4">
        <Scan file={file} onScanComplete={(result) => setResultText(result)} />
      </div>
      <div className="lg:w-1/3 h-screen w-full overflow-y-auto bg-teal-100 p-4 border border-gray-300 p-4">
        <Results resultText={resultText} />
      </div>
    </div>
  );
}

export default App;
