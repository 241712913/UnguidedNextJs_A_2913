import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div className="flex items-center gap-3 text-white">
      <div className="relative h-16 w-36 overflow-hidden sm:h-20 sm:w-44">
        <Image
          src="/LogoSK.png"
          alt="SahabatKargo.id"
          fill
          className="object-contain"
        />
      </div>
      <span className="sr-only">SahabatKargo.id</span>
    </div>
  );
}
