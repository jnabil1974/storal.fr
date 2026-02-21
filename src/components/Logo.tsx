import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center">
      <picture>
        <source srcSet="/images/logo-storal.webp" type="image/webp" />
        <Image
          src="/images/logo-storal.png"
          alt="STORAL - Store, Protection Solaire, Menuiserie"
          width={181}
          height={73}
          className="h-[57px] w-auto"
          priority
        />
      </picture>
    </div>
  );
}
