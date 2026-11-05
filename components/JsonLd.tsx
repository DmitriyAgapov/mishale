import type { Thing, WithContext } from "schema-dts";

// Микроразметка schema.org. «<» экранируется, чтобы текст не закрыл тег script.
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
