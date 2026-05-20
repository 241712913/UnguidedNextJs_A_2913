type Shipment = {
  id: number;
  resi: string;
  nama_pengirim: string;
  nama_penerima: string;
  status: string;
  created_at: string;
};

export default function ShipmentTable({
  shipments,
  loading,
}: {
  shipments: Shipment[];
  loading: boolean;
}) {

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50 border-b">

          <tr>

            <th className="px-6 py-4 text-left text-sm text-gray-600">
              Resi
            </th>

            <th className="px-6 py-4 text-left text-sm text-gray-600">
              Pengirim
            </th>

            <th className="px-6 py-4 text-left text-sm text-gray-600">
              Penerima
            </th>

            <th className="px-6 py-4 text-left text-sm text-gray-600">
              Status
            </th>

            <th className="px-6 py-4 text-left text-sm text-gray-600">
              Tanggal
            </th>

            <th className="px-6 py-4 text-center text-sm text-gray-600">
              Aksi
            </th>

          </tr>

        </thead>

        <tbody>

          {/* SKELETON */}
          {loading ? (

            [1, 2, 3, 4, 5].map((i) => (

              <tr
                key={i}
                className="border-b animate-pulse"
              >

                <td className="px-6 py-4">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-32 bg-gray-100 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-32 bg-gray-100 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-8 w-24 bg-gray-100 rounded-full"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
                </td>

                <td className="px-6 py-4">
                  <div className="h-4 w-16 bg-gray-100 rounded mx-auto"></div>
                </td>

              </tr>

            ))

          ) : shipments.length === 0 ? (

            /* EMPTY */
            <tr>

              <td
                colSpan={6}
                className="text-center py-10 text-gray-400"
              >
                Data tidak ditemukan
              </td>

            </tr>

          ) : (

            /* DATA */
            shipments.map((item) => (

              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="px-6 py-4 text-green-600 font-medium">
                  {item.resi}
                </td>

                <td className="px-6 py-4">
                  {item.nama_pengirim}
                </td>

                <td className="px-6 py-4">
                  {item.nama_penerima}
                </td>

                <td className="px-6 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status ===
                      "Menunggu Pick Up"

                        ? "bg-yellow-100 text-yellow-600"

                        : item.status ===
                          "Terkirim"

                        ? "bg-green-100 text-green-600"

                        : item.status ===
                          "Dijemput"

                        ? "bg-blue-100 text-blue-600"

                        : item.status ===
                          "Dalam perjalanan"

                        ? "bg-cyan-100 text-cyan-600"

                        : item.status ===
                          "Sedang diantar"

                        ? "bg-purple-100 text-purple-600"

                        : "bg-red-100 text-red-600"
                    }`}
                  >

                    {item.status}

                  </span>

                </td>

                <td className="px-6 py-4 text-gray-500">

                  {new Date(
                    item.created_at
                  ).toLocaleDateString(
                    "id-ID"
                  )}

                </td>

                <td className="px-6 py-4 text-center">

                  <button className="text-green-600 hover:underline text-sm">

                    Detail

                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}