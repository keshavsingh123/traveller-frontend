export default function Loader() {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      <p className="mt-2 text-gray-500">Generating your trip...</p>
    </div>
  );
}