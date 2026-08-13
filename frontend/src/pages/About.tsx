export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-deep-maroon text-center">About Us</h1>
      <div className="mt-8 bg-white rounded-2xl shadow border border-[#e2d3c0] p-8">
        <h2 className="text-2xl font-bold text-deep-maroon">Ahaa emi Ruchi</h2>
        <p className="mt-4 text-gray-600">
          <strong>Swachhamaina... Acchamaina... Telugu Ruchi</strong>
        </p>
        <p className="mt-2 text-gray-600">
          We bring authentic Telugu homemade pickles and sweets to your doorstep.
          Every jar is made with love, just like Amma's kitchen.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-amber-50 p-4 rounded-xl text-center">
            <p className="text-3xl">🥒</p>
            <p className="font-semibold mt-1">Authentic Pickles</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl text-center">
            <p className="text-3xl">🍬</p>
            <p className="font-semibold mt-1">Traditional Sweets</p>
          </div>
        </div>
      </div>
    </div>
  );
}