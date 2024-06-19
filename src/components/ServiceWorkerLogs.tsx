type Props = {
  logs: string[];
};

export default function ServiceWorkerLogs({ logs }: Props) {
  return (
    <>
      <h2 className="text-xl font-bold">Logs</h2>
      <ul className="list-disc pl-4 h-96 overflow-y-auto border border-gray-300 p-4 rounded-lg">
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </>
  );
}
