import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Operator } from "@/components/legal/Operator";
import { Section } from "@/components/ui/Section";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  alternates: { canonical: "/soglasie" },
};

// С 01.09.2025 согласие оформляется отдельно от других документов (152-ФЗ, ст. 9) — поэтому своя страница.
// Черновик исполнителя, до запуска проверяет юрист компании.
export default async function ConsentPage() {
  const s = await getSettings();
  return (
    <>
      <Breadcrumbs items={[{ href: "/soglasie", label: "Согласие на обработку персональных данных" }]} />
      <Section className="pt-6 md:pt-8">
        <article className="prose-legal flex max-w-3xl flex-col gap-4 text-lg">
          <h1 className="text-h1 font-extrabold md:text-4xl">Согласие на обработку персональных данных</h1>
          <p>
            Отправляя форму на сайте mishale74.ru, я свободно, своей волей и в своём интересе даю согласие
            оператору:
          </p>
          <Operator settings={s} />
          <p>на обработку моих персональных данных на следующих условиях.</p>
          <p>
            <strong>Данные:</strong> имя, номер телефона, удобный способ связи, сведения, указанные в форме
            (проект, комплектация, ответы на вопросы, комментарий), а также технические данные: страница
            отправки, рекламные метки, идентификатор Яндекс Метрики.
          </p>
          <p>
            <strong>Цель:</strong> связаться со мной по заявке, подобрать проект, рассчитать стоимость,
            подготовить и заключить договор.
          </p>
          <p>
            <strong>Действия:</strong> сбор, запись, систематизация, накопление, хранение, уточнение,
            использование, передача (предоставление, доступ) в систему учёта заявок оператора, блокирование,
            удаление, уничтожение — с использованием средств автоматизации и без них.
          </p>
          <p>
            <strong>Срок:</strong> до достижения целей обработки или до отзыва согласия. Согласие можно
            отозвать в любой момент, написав оператору
            {s.email ? ` на ${s.email}` : ""}.
          </p>
          <p>
            Подробнее — в{" "}
            <Link href="/politika" className="text-brand underline">
              политике обработки персональных данных
            </Link>
            .
          </p>
        </article>
      </Section>
    </>
  );
}
