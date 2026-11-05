import { describe, expect, it } from "vitest";
import { formatArea, formatPrice, keepUnits, maskPhone, pluralModules } from "./format";

const N = " ";

describe("форматирование", () => {
  it("цены с неразрывными пробелами", () => {
    expect(formatPrice(1290000)).toBe(`1${N}290${N}000${N}₽`);
    expect(formatPrice(943000)).toBe(`943${N}000${N}₽`);
  });

  it("площадь", () => {
    expect(formatArea(20)).toBe(`20${N}м²`);
    expect(formatArea(12.5)).toBe(`12,5${N}м²`);
  });

  it("склонение модулей", () => {
    expect(pluralModules(1)).toBe("1 модуль");
    expect(pluralModules(2)).toBe("2 модуля");
    expect(pluralModules(5)).toBe("5 модулей");
    expect(pluralModules(12)).toBe("12 модулей");
    expect(pluralModules(22)).toBe("22 модуля");
  });

  it("маска телефона", () => {
    expect(maskPhone("")).toBe("");
    expect(maskPhone("9")).toBe("+7 (9");
    expect(maskPhone("8912")).toBe("+7 (912)");
    expect(maskPhone("89123456789")).toBe("+7 (912) 345-67-89");
    expect(maskPhone("+7 912 345 67 89 00")).toBe("+7 (912) 345-67-89");
  });

  it("склеивает число с единицей", () => {
    expect(keepUnits("Модульный дом 45 м²")).toBe(`Модульный дом 45${N}м²`);
    expect(keepUnits("3 модуля")).toBe(`3${N}модуля`);
    expect(keepUnits("2,5 × 6 м и 100 мм")).toBe(`2,5 × 6${N}м и 100${N}мм`);
    expect(keepUnits("5 машин")).toBe("5 машин");
  });
});
