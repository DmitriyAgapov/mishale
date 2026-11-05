import Image from "next/image";

// Временная страница технического адреса. На следующем этапе — главная по ТЗ §7.2.
export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-(--container-site) flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <Image src="/logo.svg" alt="МИШАЛЕ" width={336} height={139} priority />
      <h1 className="text-h1 font-extrabold md:text-5xl">
        Модульные дома под ключ от производителя в Миассе
      </h1>
      <p className="text-ink-muted max-w-xl">
        Новый сайт в разработке. Это технический адрес, он закрыт от поисковиков.
      </p>
    </div>
  );
}
