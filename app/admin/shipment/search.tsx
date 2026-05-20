'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <input
      type="text"
      placeholder="Cari shipment..."
      onChange={(e) => handleSearch(e.target.value)}
      className="border px-4 py-2 rounded-lg"
    />
  );
}