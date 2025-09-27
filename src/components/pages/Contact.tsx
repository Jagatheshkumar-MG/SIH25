export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-semibold">Contact</h2>
      <p className="text-gray-600 dark:text-gray-300">We'd love to hear from you.</p>
      <form className="space-y-3">
        <input className="w-full p-2 border rounded bg-white dark:bg-gray-900" placeholder="Your email" />
        <textarea rows={5} className="w-full p-2 border rounded bg-white dark:bg-gray-900" placeholder="Your message" />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
      </form>
    </div>
  );
}



