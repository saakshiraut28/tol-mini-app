const presetAmounts = ["0.001", "0.1", "0.5", "1"];

const AmountInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <input
        type="number"
        placeholder="Enter custom amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      <div className="flex flex-wrap gap-2">
        {presetAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => onChange(amt)}
            className={`px-3 py-1 border rounded-md ${
              value === amt
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {amt} ETH
          </button>
        ))}
      </div>
    </div>
  );
};

export default AmountInput;
