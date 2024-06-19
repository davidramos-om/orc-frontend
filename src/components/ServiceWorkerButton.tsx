import { useRef, useState, useReducer, useEffect } from "react";
import { OEM, createWorker } from "tesseract.js";

import ServiceWorkerLogs from "./ServiceWorkerLogs";

type ScanProps = {
  file?: File;
  languages: string[];
  onScanComplete?: (result: unknown) => void;
};

const prepareWorker = async (
  langs: string[],
  logger: (arg: Tesseract.LoggerMessage) => void
) => {
  const worker = createWorker(langs, OEM.DEFAULT, {
    logger,
  });

  return worker;
};

export default function ServiceWorkerButton({
  file,
  languages,
  onScanComplete,
}: ScanProps) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const updateController = useRef(0);

  const logs = useRef<string[]>([]);
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const jobRef = useRef<Tesseract.ConfigResult | undefined>(undefined);
  const [working, setWorking] = useState(false);

  //? render logs every 500ms to show progress | avoid re-rendering on every log update
  useEffect(() => {
    if (!working) return;

    const interval = setInterval(() => {
      console.log("Interval", updateController.current);
      if (working) {
        console.log("Forcing update");
        updateController.current += 1;
        forceUpdate();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [working]);

  const logger = (message: Tesseract.LoggerMessage) => {
    logs.current.push(
      `Job ID: ${message.jobId}, Progress: ${message.progress}, Status: ${message.status}, Worker ID: ${message.workerId}`
    );
  };

  const handleScanImage = async () => {
    try {
      if (!file) return;

      logs.current = [];
      if (!workerRef.current) {
        const _worker = await prepareWorker(languages, logger);
        logs.current.push("Worker created");
        workerRef.current = _worker;
      }

      const worker = workerRef.current;

      jobRef.current = await worker.load();
      logs.current.push("Job loaded");

      logs.current.push("Recognizing text in image");
      setWorking(true);
      await worker.recognize(file);
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
      <button
        disabled={working}
        onClick={handleScanImage}
        className="w-full px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-opacity-50"
      >
        {working ? "Working..." : "Scan Image with Service Worker"}
      </button>
      {working && (
        <div className="flex flex-col items-start justify-start">
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
