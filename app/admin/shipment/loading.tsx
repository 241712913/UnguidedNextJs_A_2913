export default function Loading() {

  return (
    <div className="bg-gray-100 min-h-screen">

      <div className="p-3 space-y-3 animate-pulse">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 shadow">

          <div className="h-6 w-52 bg-white/30 rounded mb-3"></div>

          <div className="h-4 w-40 bg-white/20 rounded"></div>

        </div>

        {/* FILTER */}
        <div className="bg-white p-4 rounded-2xl shadow flex flex-col md:flex-row gap-4">

          <div className="h-12 flex-1 bg-gray-100 rounded-xl"></div>

          <div className="h-12 w-40 bg-gray-100 rounded-xl"></div>

          <div className="h-12 w-52 bg-gray-100 rounded-xl"></div>

        </div>

        {/* TABLE */}
        {[1, 2, 3, 4, 5].map((i) => (

          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow"
          >

            <div className="flex justify-between items-start mb-4">

              <div>

                <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>

                <div className="h-4 w-28 bg-gray-100 rounded"></div>

              </div>

              <div className="h-8 w-24 bg-gray-100 rounded-full"></div>

            </div>

            <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>

            <div className="h-4 w-2/3 bg-gray-100 rounded"></div>

          </div>

        ))}

      </div>

    </div>
  );
}