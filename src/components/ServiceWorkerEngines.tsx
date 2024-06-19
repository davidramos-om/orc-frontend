import { OEM } from "tesseract.js";

type Props = {
  onSelectedEngine: (engine: OEM) => void;
};

export default function ServiceWorkerEngines({ onSelectedEngine }: Props) {
  return (
    <div className="flex items-center justify-center">
      <label className="mr-2" htmlFor="engine">
        OCR Engine:
      </label>
      <select
        value={OEM.TESSERACT_LSTM_COMBINED}
        name="engine"
        id="engine"
        onChange={(e) => {
          const engine = e.target.value as unknown as OEM;
          onSelectedEngine(engine);
        }}
      >
        <option value={OEM.TESSERACT_ONLY}>Tesseract Only</option>
        <option value={OEM.LSTM_ONLY}>LSTM Only</option>
        <option value={OEM.TESSERACT_LSTM_COMBINED}>Tesseract + LSTM</option>
        <option value={OEM.DEFAULT}>Default</option>
      </select>
    </div>
  );
}
