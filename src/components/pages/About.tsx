export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">About</h2>
      <p className="text-gray-600 dark:text-gray-300">
        Our mission is to enable households to conserve water through data-driven rooftop rainwater harvesting assessments.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">Simple assessments</div>
        <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">Local weather & soil</div>
        <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">AI recommendations</div>
        <div className="p-3 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">Actionable reports</div>
      </div>
    </div>
  );
}



