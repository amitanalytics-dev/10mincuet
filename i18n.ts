// @ts-ignore — next-intl is installed as a bundled dep under .next-intl-* in Next.js 16
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }: { locale: string }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
