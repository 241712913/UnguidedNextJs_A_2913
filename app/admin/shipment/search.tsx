'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState(searchParams.get('query') || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('query', value);
      } else {
        params.delete('query');
      }

      replace(`${pathname}?${params.toString()}`);
    }, 300); // debounce biar tidak terlalu sering update URL

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      type="text"
      placeholder="Cari shipment..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border px-4 py-2 rounded-lg w-full"
    />
  );
}