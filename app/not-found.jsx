export default function NotFound() {
return (
<main className="min-h-screen flex items-center justify-center bg-white px-6">
    <div className="text-center">
    <h1 className="text-8xl font-bold text-gray-900">
        404
    </h1>

    <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found
    </h2>

    <p className="mt-2 text-gray-500">
        Sorry, the page you are looking for does not exist.
    </p>

    <a
        href="/"
        className="inline-block mt-6 rounded-lg bg-orange-500 px-6 py-3 text-white font-medium hover:bg-orange-600 transition"
    >
        Go Home
    </a>
    </div>
</main>
);
}