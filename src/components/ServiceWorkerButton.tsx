import { useRef, useState, useReducer, useEffect } from "react";
import { InitOptions, OEM, createWorker } from "tesseract.js";

import ServiceWorkerLogs from "./ServiceWorkerLogs";
import ServiceWorkerEngines from "./ServiceWorkerEngines";

type ScanProps = {
  file?: File;
  languages: string[];
  onScanComplete?: (result: unknown) => void;
};

const prepareWorker = async (
  langs: string[],
  engine: OEM,
  logger: (arg: Tesseract.LoggerMessage) => void
) => {
  const options: Partial<Tesseract.WorkerOptions> = {
    logger,
  };

  const config: string | Partial<InitOptions> = {
    load_bigram_dawg: "true",
    load_system_dawg: "true",
    load_freq_dawg: "true",
    load_punc_dawg: "true",
  };

  const worker = createWorker(langs, engine, options, config);

  return worker;
};

export default function ServiceWorkerButton({
  file,
  languages,
  onScanComplete,
}: ScanProps) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const updateController = useRef(0);
  const [engine, setEngine] = useState<OEM>(OEM.TESSERACT_LSTM_COMBINED);

  const logs = useRef<string[]>([]);
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const jobRef = useRef<Tesseract.ConfigResult | undefined>(undefined);
  const [working, setWorking] = useState(false);

  //? render logs every 500ms to show progress | avoid re-rendering on every log update
  useEffect(() => {
    if (!working) return;

    const interval = setInterval(() => {
      if (working) {
        updateController.current += 1;
        forceUpdate();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [working]);

  const logger = (message: Tesseract.LoggerMessage) => {
    const pPercentage = (message.progress * 100).toFixed(2) + "%";
    logs.current.push(
      `Job ID: ${message.jobId}, Progress: ${pPercentage}, Status: ${message.status}, Worker ID: ${message.workerId}`
    );
  };

  const handleScanImage = async () => {
    try {
      if (!file) return;

      logs.current = [];

      logs.current.push(
        `Creating worker with parameters ${languages}, ${engine}`
      );
      workerRef.current = await prepareWorker(languages, engine, logger);
      logs.current.push("Worker created");

      const worker = workerRef.current;

      jobRef.current = await worker.load(jobRef.current?.jobId);
      logs.current.push("Job loaded");

      logs.current.push("Recognizing text in image");
      setWorking(true);
      const { data } = await worker.recognize(file);
      console.dir({ data }, { depth: null });
      onScanComplete?.(data.text);
      logs.current.push("Text recognized");
    } catch (error) {
      console.error("An error occurred scanning the image", error);
    } finally {
      setWorking(false);
      handleTerminateWorker();
    }
  };

  const handleTerminateWorker = async () => {
    try {
      if (workerRef.current) {
        await workerRef.current.terminate(jobRef?.current?.jobId);
        logs.current.push("Worker terminated");
      }
      setWorking(false);
    } catch (error) {
      console.error("An error occurred terminating the worker", error);
    }
  };

  return (
    <>
      <ServiceWorkerEngines onSelectedEngine={setEngine} />
      <button
        disabled={working}
        onClick={handleScanImage}
        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${
      working
        ? "bg-gray-400 text-gray-700 cursor-not-allowed focus:ring-gray-400"
        : "bg-lime-500 text-white hover:bg-lime-700 focus:ring-lime-500"
    }`}
      >
        {working ? "Working..." : "Scan Image using Service Worker"}
      </button>
      {working && (
        <div className="flex flex-col items-center justify-center">
          <hr className="my-4" />
          <button
            onClick={handleTerminateWorker}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Terminate Worker
          </button>
        </div>
      )}
      {logs.current.length > 0 && <ServiceWorkerLogs logs={logs.current} />}
    </>
  );
}
