export type StatusType = "Menunggu" | "Transit" | "Diantar" | "Selesai";

export interface Shipment {
  id: string;
  resi: string;
  date: string;

  from: string;
  to: string;

  sender: string;
  receiver: string;

  weight: string;
  price: string;

  courier?: string;
  status: StatusType;

  logs: {
    title: string;
    desc: string;
    time: string;
  }[];
}

export const shipments: Shipment[] = [
  {
    id: "1",
    resi: "SK-13FQ6216128",
    date: "24 Maret 2026",
    from: "DIY",
    to: "Bandung",
    sender: "Yemima Saragih",
    receiver: "Budi Santoso",
    weight: "1 kg",
    price: "Rp 15.000",
    courier: "Ahmad Kurniawan",
    status: "Menunggu",
    logs: [
      {
        title: "Pesanan dibuat",
        desc: "Menunggu pickup kurir",
        time: "24 Mar 2026, 08:00",
      },
    ],
  },
  {
    id: "2",
    resi: "SK-20260412-029",
    date: "30 Maret 2026",
    from: "Babarsari",
    to: "Jl. Soekarno Hatta",
    sender: "Lulu",
    receiver: "Lala",
    weight: "1.2 kg",
    price: "Rp 20.000",
    status: "Selesai",
    logs: [
      {
        title: "Paket diterima",
        desc: "Diterima oleh penerima",
        time: "30 Mar 2026, 15:00",
      },
      {
        title: "Kurir mengantar",
        desc: "Menuju alamat tujuan",
        time: "30 Mar 2026, 14:00",
      },
      {
        title: "Dalam perjalanan",
        desc: "Paket menuju kota tujuan",
        time: "30 Mar 2026, 11:00",
      },
    ],
  },
  {
    id: "3",
    resi: "SK-8HJK29XMPL",
    date: "19 Maret 2026",
    from: "Jakarta Selatan",
    to: "Bandung",
    sender: "Andi",
    receiver: "Rina",
    weight: "2 kg",
    price: "Rp 25.000",
    status: "Transit",
    logs: [
      {
        title: "Sudah dipickup",
        desc: "Paket diambil kurir",
        time: "19 Mar 2026, 09:00",
      },
      {
        title: "Dalam perjalanan",
        desc: "Menuju gudang transit",
        time: "19 Mar 2026, 12:00",
      },
    ],
  },
];