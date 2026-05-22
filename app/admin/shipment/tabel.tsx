import Link from "next/link";

type Shipment = {
  id: number;
  resi: string;
  nama_pengirim: string;
  nama_penerima: string;
  status_id: number;
  created_at: string;
};

export default function ShipmentTable({
  shipments,
  loading,
}: {
  shipments: Shipment[];
  loading: boolean;
}) {

  const statusMap: Record<number, string> = {
    1: "Menunggu",
    2: "Dijemput",
    3: "Dalam perjalanan",
    4: "Diantar",
    5: "Terkirim",
    6: "Gagal",
  };

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

              <tr key={i} className="border-b animate-pulse">

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
                  <div className="h-4 w-24 bg-gray-100 rounded"></div>
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

              <td colSpan={6} className="text-center py-10 text-gray-400">
                Data tidak ditemukan
              </td>

            </tr>

          ) : (

            /* DATA */
            shipments.map((item) => (

              <tr key={item.id} className="border-b hover:bg-gray-50 transition">

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
                  <span className="text-sm font-medium">
                    {statusMap[item.status_id] || "-"}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(item.created_at).toLocaleDateString("id-ID")}
                </td>

                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/admin/shipment/${item.id}`}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Detail
                  </Link>
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}