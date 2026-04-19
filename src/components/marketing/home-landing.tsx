import Image from "next/image";
import Link from "next/link";
import { Camera, Clock, Sun } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { cn } from "@/lib/utils";

const GALLERY = [
  { src: "/hero/slide-1.png", alt: "סטודיו צילום — תאורה ורקע" },
  { src: "/hero/slide-2.png", alt: "רקע אינסוף לבן" },
  { src: "/hero/slide-3.png", alt: "חלל צילום עם ציוד" },
  { src: "/hero/slide-4.png", alt: "תאורת סטודיו מקצועית" },
] as const;

const STUDIO_FOR_PHOTOGRAPHERS = [
  "מרחב עבודה: חלל מרווח בגודל 4×8 מטר, המאפשר צילום גוף מלא בנוחות.",
  "תאורה מקצועית: 2 פלאשים Godox AD600 Pro ו-3 פלאשים Elinchrom.",
  "ציוד עזר: מגוון סופטבוקסים, רפלקטורים, רקעים צבעוניים ורקעים מגנטיים ייעודיים לצילום מוצר.",
  "אביזרים (Props): כסאות בר, כורסאות, ספסל ילדים, מצלמות עתיקות, גרמופון ואביזרים משתנים נוספים.",
  "עמדת איפור: פינה ייעודית, מוארת ומאובזרת להתארגנות דוגמנים/ות ולקוחות.",
] as const;

const STUDIO_FOR_EVENTS = [
  "הקרנה וסאונד: מקרן איכותי על מסך ענק ורמקול למוזיקה או הגברה.",
  "אירוח מודולרי: שולחנות מתקפלים וכסאות שניתן לסדר ככיתה או כחלל ישיבות.",
  "תשתית דיגיטלית: WiFi מהיר ואפשרות לחיבור קווי (LAN) ישירות לראוטר – אידיאלי ל-Tethering או לסטרימינג.",
] as const;

const COMFORT = [
  "מיזוג: 2 מזגנים חזקים לשמירה על טמפרטורה נעימה בכל עונות השנה.",
  "אירוח: מטבחון מאובזר, שירותים וחצר רחבה להפסקות והתרעננות.",
  "מיקום: לב באר שבע ברחוב בזל 31, עם חניה נוחה (כחול-לבן) ממש ליד הסטודיו.",
] as const;

const PRICING = [
  "שעה בודדת (עד 3 שעות): 150 ש״ח לשעה.",
  "השכרה מעל 3 שעות: 120 ש״ח לשעה.",
  "מסלולים ארוכים: אפשרות להשכרה יומית, שבועית או חודשית בתנאים מעולים (בהתאם לחוזה מסודר).",
] as const;

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul
      className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-neutral-700 dark:text-zinc-300 sm:text-base"
      dir="rtl"
    >
      {items.map((line) => (
        <li key={line} className="flex gap-3 text-start">
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-gradient-to-br from-[#fb923c] to-[#ea580c]"
            aria-hidden
          />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}

function HomeDecorLight() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden dark:hidden"
    >
      <Image
        src="/book-decor/cube.png"
        alt=""
        width={200}
        height={200}
        className="absolute -start-[10%] top-[8%] w-[min(32vw,200px)] opacity-50 drop-shadow-xl sm:-start-[6%] sm:top-[12%]"
      />
      <Image
        src="/book-decor/torus.png"
        alt=""
        width={180}
        height={180}
        className="absolute -end-[8%] top-[20%] w-[min(28vw,180px)] opacity-45 drop-shadow-xl"
      />
      <Image
        src="/book-decor/sphere.png"
        alt=""
        width={160}
        height={160}
        className="absolute -end-[4%] bottom-[10%] w-[min(26vw,160px)] opacity-50 drop-shadow-lg"
      />
    </div>
  );
}

function HomeDecorDark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden overflow-hidden dark:block"
    >
      <Image
        src="/book-decor/cube-dark.png"
        alt=""
        width={200}
        height={200}
        className="absolute -start-[10%] top-[8%] w-[min(32vw,200px)] opacity-40 drop-shadow-[0_24px_50px_-10px_rgba(249,115,22,0.25)]"
      />
      <Image
        src="/book-decor/torus-dark.png"
        alt=""
        width={180}
        height={180}
        className="absolute -end-[8%] top-[20%] w-[min(28vw,180px)] opacity-35"
      />
      <Image
        src="/book-decor/sphere-dark.png"
        alt=""
        width={160}
        height={160}
        className="absolute -end-[4%] bottom-[10%] w-[min(26vw,160px)] opacity-40 drop-shadow-[0_20px_40px_-8px_rgba(234,88,12,0.3)]"
      />
    </div>
  );
}

const cardSurface = cn(
  "rounded-3xl border p-5 shadow-sm sm:p-8",
  "border-black/[0.06] bg-[#faf9f6] dark:border-white/[0.08] dark:bg-zinc-900/80",
);

export function HomeLanding() {
  return (
    <main className="min-h-dvh bg-[#f4f2ec] text-neutral-900 dark:bg-[#0a0a0c] dark:text-zinc-100">
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-xl",
          "border-black/[0.06] bg-[#f4f2ec]/85 dark:border-white/[0.08] dark:bg-[#0a0a0c]/80",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-3"
          >
            <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl">
              Aslan Studio
            </span>
            <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.28em] text-neutral-500 dark:text-zinc-500 sm:inline">
              Photography
            </span>
          </Link>

          <nav
            className="flex flex-shrink-0 items-center gap-2 sm:gap-4"
            aria-label="ניווט ראשי"
          >
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#ea580c] dark:text-orange-400"
            >
              דף הבית
            </Link>
            <Link
              href="/book"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:bg-black/[0.04] hover:text-neutral-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
            >
              הזמנת סטודיו
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <HeroCarousel />

      {/* מבוא */}
      <section className="relative overflow-hidden border-t border-black/[0.05] dark:border-white/[0.06]">
        <HomeDecorLight />
        <HomeDecorDark />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:py-24">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#ea580c] dark:text-orange-400 sm:text-xs">
            PHOTOGRAPHY · STUDIO RENT
          </p>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-4xl md:text-5xl">
            הסטודיו של אסלן — המרחב שלכם ליצירה בבאר שבע
          </h1>
          <p className="mt-4 text-pretty text-lg font-medium leading-relaxed text-neutral-800 dark:text-zinc-200 sm:text-xl">
            חלל מעוצב, מאובזר וחכם להשכרה – לצילומים, סדנאות ומפגשים
          </p>
          <p className="mt-6 text-pretty text-base leading-relaxed text-neutral-600 dark:text-zinc-400 sm:text-lg">
            משנת 2010 הסטודיו ברחוב בזל 31 הוא הבית המקצועי שלי ושל &quot;סנאפ&quot;.
            היום, כשאנחנו מתרחבים לבית חדש, אני מזמין אתכם להשתמש במרחב הזה כבית
            שלכם. בניתי מקום שמשלב ציוד קצה, אווירה מעוררת השראה וגמישות מלאה לכל
            צורך מקצועי.
          </p>
        </div>
      </section>

      {/* גלריה */}
      <section className="border-t border-black/[0.05] bg-white/40 dark:border-white/[0.06] dark:bg-zinc-950/30">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4">
            {GALLERY.map((item, i) => (
              <figure
                key={item.src}
                className={cn(
                  "group relative aspect-[3/4] overflow-hidden rounded-2xl border shadow-lg",
                  "border-black/[0.06] bg-neutral-200/80 dark:border-white/[0.08] dark:bg-zinc-900",
                  i === 0 && "md:rounded-3xl",
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 pt-12 text-start text-xs font-medium text-white/95 opacity-0 transition group-hover:opacity-100 sm:text-sm">
                  {item.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* מה מחכה לכם */}
      <section className="relative overflow-hidden border-t border-black/[0.05] py-14 dark:border-white/[0.06] sm:py-20">
        <HomeDecorLight />
        <HomeDecorDark />
        <div className="relative z-10 mx-auto max-w-3xl space-y-10 px-4 sm:space-y-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-3xl">
            מה מחכה לכם בסטודיו?
          </h2>

          <div className={cardSurface}>
            <h3 className="text-lg font-semibold text-[#c2410c] dark:text-orange-300 sm:text-xl">
              לצלמי פורטרטים, תדמית ומוצר
            </h3>
            <BulletList items={STUDIO_FOR_PHOTOGRAPHERS} />
          </div>

          <div className={cardSurface}>
            <h3 className="text-lg font-semibold text-[#c2410c] dark:text-orange-300 sm:text-xl">
              לסדנאות, הרצאות ומפגשים
            </h3>
            <BulletList items={STUDIO_FOR_EVENTS} />
          </div>
        </div>
      </section>

      {/* נוחות ונגישות */}
      <section className="border-t border-black/[0.05] bg-white/60 py-14 dark:border-white/[0.06] dark:bg-zinc-950/40 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-3xl">
            נוחות ונגישות
          </h2>
          <div className={cn("mt-8", cardSurface)}>
            <BulletList items={COMFORT} />
          </div>
        </div>
      </section>

      {/* למה לשכור + שלושה יתרונות קצרים */}
      <section className="border-t border-black/[0.05] py-14 dark:border-white/[0.06] sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className={cardSurface}>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-zinc-50 sm:text-2xl">
              למה לשכור אצלנו?
            </h2>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-700 dark:text-zinc-300 sm:text-base">
              מעבר לחלל ולציוד, אתם מקבלים שקט נפשי. אני מכיר כל פלאש ופינה
              בסטודיו כמו את כף היד שלי, ותמיד אשתדל להיות זמין לעזרה, ייעוץ
              בשימוש בציוד או פתרון תקלות בזמן אמת.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {[
              {
                icon: Sun,
                title: "אור ותאורה",
                text: "חלון גדול ותאורת סטודיו לשליטה מדויקת במראה.",
              },
              {
                icon: Camera,
                title: "ציוד מקצועי",
                text: "פלאשים, סופטבוקסים ורקעים לצילומי מוצר ופורטרט.",
              },
              {
                icon: Clock,
                title: "יומן שקוף",
                text: "בוחרים תאריך ושעות בלוח שמסונכרן ליומן הסטודיו.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className={cn(cardSurface, "text-center")}>
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fb923c] to-[#ea580c] text-white shadow-md shadow-orange-500/25">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-zinc-50 sm:text-lg">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* זמינות ומחירים */}
      <section className="border-t border-black/[0.05] bg-white/60 py-14 dark:border-white/[0.06] dark:bg-zinc-950/40 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-3xl">
            זמינות ומחירים
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-neutral-600 dark:text-zinc-400 sm:text-base">
            השכרה גמישה לפי הצורך שלכם, עם מערכת יומן שקופה לבדיקת זמינות:
          </p>
          <div className={cn("mt-8 text-start", cardSurface)}>
            <BulletList items={PRICING} />
          </div>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full border-0 bg-gradient-to-l from-[#fb923c] to-[#ea580c] px-10 py-6 text-base font-semibold text-white shadow-lg shadow-orange-500/30 hover:from-[#fdba74] hover:to-[#f97316]"
            >
              <Link href="/book">בדיקת זמינות והזמנה</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-neutral-300 bg-white/80 px-8 py-6 text-base font-medium text-neutral-800 hover:bg-white dark:border-white/15 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <Link href="/book#booking">ללוח השבוע</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA כהה */}
      <section className="relative overflow-hidden border-t border-black/[0.05] py-16 dark:border-white/[0.06] sm:py-20">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-l from-[#1a1a1f] via-[#252530] to-[#1f1f24] dark:from-[#0f0f12] dark:via-[#16161c] dark:to-[#121218]"
        />
        <div
          aria-hidden
          className="absolute -end-24 top-1/2 size-[min(80vw,28rem)] -translate-y-1/2 rounded-full bg-orange-500/20 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
            רוצים לשריין את הסטודיו?
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-white/75 sm:text-base">
            בוחרים יום ומשבצת, משלימים בכמה צעדים — הכול בעברית ו־RTL, מסונכרן
            ליומן Google.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="rounded-full border-0 bg-gradient-to-l from-[#fb923c] to-[#ea580c] px-10 py-6 text-base font-semibold text-white shadow-lg shadow-orange-900/40 hover:from-[#fdba74] hover:to-[#f97316]"
            >
              <Link href="/book">הזמנת סטודיו</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/25 bg-white/10 px-8 py-6 text-base font-medium text-white backdrop-blur-sm hover:bg-white/15"
            >
              <Link href="/book#booking">ללוח הזמינות</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/[0.06] bg-[#ebe8e0] py-8 text-center text-sm text-neutral-600 dark:border-white/[0.08] dark:bg-[#08080a] dark:text-zinc-500">
        <p>Aslan Studio · רחוב בזל 31, באר שבע</p>
        <p className="mt-1 text-xs">© {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
