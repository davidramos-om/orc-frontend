type ResultsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resultText?: any;
};

export default function Results({ resultText }: ResultsProps) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">3. Results</h1>
      <div className="flex items-center justify-center">
        <textarea
          value={resultText}
          readOnly
          rows={10}
          className="w-full h-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        />
      </div>
    </>
  );
}
