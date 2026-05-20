export default function Loading() {
  return (
    <div className="p-3 space-y-3 animate-pulse">

      {/* HEADER */}
      <div className="bg-white rounded-3xl p-6 shadow">
        <div className="h-6 w-52 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 w-72 bg-gray-100 rounded"></div>
      </div>

      {/* CARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {[1,2,3,4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow"
          >
            <div className="h-5 w-20 bg-gray-200 rounded mb-3"></div>

            <div className="h-8 w-28 bg-gray-100 rounded"></div>
          </div>
        ))}

      </div>

      {/* TABLE */}
      {[1,2,3,4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 shadow"
        >
          <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>

          <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>

          <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
        </div>
      ))}

    </div>
  );
}