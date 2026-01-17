import { useExtraction } from '../hooks/useExtraction';

export default function Header() {
  const { startExtraction, extracting, error } = useExtraction();

  const handleExtract = async () => {
    try {
      await startExtraction();
    } catch (err) {
      console.error(err)
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Monday.com CRM Extractor</h1>
          <p className="text-sm opacity-90">Extract and manage your CRM data</p>
        </div>
        <button
          onClick={handleExtract}
          disabled={extracting}
          className={
            `px-4 py-2 rounded-lg font-medium transition-all ${
              extracting 
                ? 'bg-white/20 cursor-not-allowed' 
                : 'bg-white text-purple-600 hover:bg-purple-50'
            }`
          }
        >
          {extracting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⌛</span>
              Extracting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              🔄 Extract Current Board
            </span>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-500/20 border border-red-300 rounded-lg text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
