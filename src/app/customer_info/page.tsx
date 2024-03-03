"use client";

import { useTranslation } from "next-i18next";
import Link from "next/link";
import "./about.scss";

const Page = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="px-5 md:px-10 py-5 text-dark dark:text-light">
      <h3
        id="delivery_payment"
        className="text-lg md:text-xl font-medium border-b dark:border-[#1f2937] mb-4 pb-2"
      >
        {i18n.language === "uk" ? "Доставка та оплата" : "Delivery and payment"}
      </h3>
      <div className="flex flex-col gap-y-4">
        <details className="group rounded-xl bg-gray-200 dark:bg-[#1f2937] shadow-[0_10px_100px_10px_rgba(0,0,0,0.05)]">
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-medium text-secondary-900">
            <span className="text-sm md:text-base">
              {i18n.language === "uk"
                ? "Інформація про доставку замовлення"
                : "Information about order delivery"}
            </span>
            <div className="text-secondary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="block h-5 w-5 transition-all duration-300 group-open:-rotate-90"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </summary>
          <div className="px-6 pb-6 text-secondary-500 text-sm flex flex-col gap-y-2">
            <div>
              <span className="block font-medium">Оформлення:</span>Доставка
              замовлення оформлюється після його оплати та обробки флористом
              (флорист здійснює дзвінок на номер, який вказаний у деталях
              замовлення).{" "}
              <span className="font-semibold italic">
                Перевіряйте коректність номеру телефона перед оплатою замовлення
              </span>
              .
            </div>
            <div>
              <span className="block font-medium">Терміни:</span>Ми намагаємося
              виконати доставку замовлення у найкоротший термін. Винятком можуть
              стати складні композиції або кошики, на виготовлення яких може
              знадобитися трохи більше часу.
            </div>
            <div>
              <span className="block font-medium">Важливо:</span>Доставка
              здійснюється лише після підтвердження замовлення флористом.
              Уточнити деталі доставки Ви можете за телефоном: +380 (00)
              000-00-00 або написати нам в{" "}
              <Link
                className="underline text-rose-400"
                href="https://www.instagram.com/clumba.krrog/"
                target="_blank"
                prefetch={false}
              >
                Instagram
              </Link>
            </div>
          </div>
        </details>
        <details className="group rounded-xl bg-gray-200 dark:bg-[#1f2937] shadow-[0_10px_100px_10px_rgba(0,0,0,0.05)]">
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-medium text-secondary-900">
            <span className="text-sm md:text-base">
              {i18n.language === "uk"
                ? "Оплата замовлення"
                : "Payment for the order"}
            </span>
            <div className="text-secondary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="block h-5 w-5 transition-all duration-300 group-open:-rotate-90"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </summary>
          <div className="px-6 pb-6 text-secondary-500 text-sm flex flex-col gap-y-2">
            <div>
              <span className="block font-medium">Вартість:</span>
              Вартість доставки становить 12 грн, але може бути змінена.
            </div>
            <div>
              <span className="block font-medium">Варіанти оплати:</span>
              Наш магазин має декілька варіантів оплати замовлення, а саме:
              <ul className="list-disc ml-4">
                <li>
                  Оплата за допомогою карток VISA / MasterCard із підтримкою 3D
                  Secure.
                </li>
                <li>
                  Оплата за допомогою QR-коду, клієнт сканує код і підтверджує
                  платіж за допомогою мобільного додатку Privat24
                </li>
                <li>Оплата за допомогою Приват24 для клієнтів ПриватБанку.</li>
                <li>Оплата за допомогою GooglePay</li>
                <li>
                  Оплата за допомогою гаманця LiqPay. У момент оплати клієнту
                  достатньо вибрати картку зі списку доступних в гаманці або
                  вказати нову.
                </li>
              </ul>
            </div>
            <div>
              <span className="block font-medium">Важливо:</span>
              Тільки після успішної оплати, ваше замовлення буде в обробці.
            </div>
          </div>
        </details>
      </div>
      <h3
        id="bonuses"
        className="text-lg md:text-xl font-medium border-b dark:border-[#1f2937] m-4 pb-2"
      >
        {i18n.language === "uk" ? "Бонусна система" : "Bonus system"}
      </h3>
      <div className="flex flex-col gap-y-4">
        <details className="group rounded-xl bg-gray-200 dark:bg-[#1f2937] shadow-[0_10px_100px_10px_rgba(0,0,0,0.05)]">
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-medium text-secondary-900">
            <span className="text-sm md:text-base">
              {i18n.language === "uk"
                ? "Нарахування бонусів"
                : "Accrual of bonuses"}
            </span>
            <div className="text-secondary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="block h-5 w-5 transition-all duration-300 group-open:-rotate-90"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </summary>
          <div className="px-6 pb-6 text-secondary-500 text-sm flex flex-col gap-y-2">
            <div>
              <span className="block font-medium">Основна інформація:</span>
              Нарахування бонусів відбувається після кожної покупки у нашому
              магазині. Відсоток нарахування залежить від суми покупок{" "}
              <span className="font-semibold italic">
                (2%, якщо сума покупок &lt; 10000 || 4%, якщо сума покупок &gt;
                10000)
              </span>
            </div>
            <div>
              <span className="block font-medium">Важливо:</span>Дізнатися
              поточний відсоток нарахування та кількість бонусів можна у
              профілі:{" "}
              <Link
                className="underline text-rose-400"
                href="/profile"
                target="_blank"
                prefetch={false}
              >
                посилання
              </Link>
              .{" "}
              <span className="font-semibold italic">
                Для доступу до профілю потрібно увійти в обліковий запис.
              </span>
            </div>
          </div>
        </details>
        <details className="group rounded-xl bg-gray-200 dark:bg-[#1f2937] shadow-[0_10px_100px_10px_rgba(0,0,0,0.05)]">
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-medium text-secondary-900">
            <span className="text-sm md:text-base">
              {i18n.language === "uk"
                ? "Використання бонусів"
                : "Use of bonuses"}
            </span>
            <div className="text-secondary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="block h-5 w-5 transition-all duration-300 group-open:-rotate-90"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </summary>
          <div className="px-6 pb-6 text-secondary-500 text-sm flex flex-col gap-y-2">
            <div>
              <span className="block font-medium">Основна інформація:</span>
              Бонуси зберігаються на вашому обліковому записі і в будь який
              момент ви можете їх витратити. На сторінці оплати можна вказати
              кількість бонусів, яку ви хочете витратити.{" "}
              <span className="font-semibold italic">
                Еквівалент одного бонусу = 1 гривня.
              </span>
            </div>
            <div>
              <span className="block font-medium">Важливо:</span>Використання
              бонусів неможливе, якщо замовлення має акційний товар. Обмеження
              на використання бонусів складає: 50% від вартості кошику.
            </div>
          </div>
        </details>
      </div>
      <h3
        id="privacy_policy"
        className="text-lg md:text-xl font-medium border-b dark:border-[#1f2937] m-4 pb-2"
      >
        {i18n.language === "uk"
          ? "Політика конфіденційності"
          : "Privacy policy"}
      </h3>
      <div className="flex flex-col gap-y-4">
        <details className="group rounded-xl bg-gray-200 dark:bg-[#1f2937] shadow-[0_10px_100px_10px_rgba(0,0,0,0.05)]">
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-medium text-secondary-900">
            <span className="text-sm md:text-base">
              {i18n.language === "uk"
                ? "Інформація, яку ми збираємо"
                : "Information we collect"}
            </span>
            <div className="text-secondary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="block h-5 w-5 transition-all duration-300 group-open:-rotate-90"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </summary>
          <div className="px-6 pb-6 text-secondary-500 text-sm flex flex-col gap-y-2">
            <div>
              <p>
                Користуючись веб-сайтом та іншими пов`язаними сервісами та
                інструментами Clumba, ви погоджуєтеся на обробку особистих даних
                з метою здійснення комерційної діяльності та надання послуг
                нашим магазином. Ці дані включають ваше ім`я, електронну адресу
                та контактний номер телефону.
              </p>{" "}
              <p>
                На деяких сторінках ви також можете надавати додаткову
                інформацію, наприклад, адресу.
              </p>
              <p>
                Ваші особисті дані є конфіденційною інформацією. Натисканням
                кнопки `Сплатити`` ви автоматично погоджуєтеся з правилами
                надання послуг, що включає використання вашої електронної адреси
                та номеру телефону для відправки маркетингових повідомлень через
                нашу систему сповіщення клієнтів. Ці повідомлення та листи мають
                рекламний характер та призначені для інформування вас про нові
                пропозиції, акції, зміни на сайті та найближчі святкові події.
              </p>
            </div>
          </div>
        </details>
        <details className="group rounded-xl bg-gray-200 dark:bg-[#1f2937] shadow-[0_10px_100px_10px_rgba(0,0,0,0.05)]">
          <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-medium text-secondary-900">
            <span className="text-sm md:text-base">
              {i18n.language === "uk"
                ? "Як ми використовуємо інформацію"
                : "How we use the information"}
            </span>
            <div className="text-secondary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="block h-5 w-5 transition-all duration-300 group-open:-rotate-90"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </summary>
          <div className="px-6 pb-6 text-secondary-500 text-sm flex flex-col gap-y-2">
            <div>
              <p>
                Інформація, яку ви надаєте при розміщенні замовлення,
                використовується нашим магазиним виключно для виконання вашого
                замовлення.{" "}
              </p>
              <p>
                Ми не передаємо ці дані третім особам і використовуємо їх лише
                для доставки вашого замовлення в зазначені терміни. Ці дані не
                передаються жодній іншій особі, крім співробітників Clumba, які
                безпосередньо виконують обробку вашого замовлення.
              </p>
              <p>
                Ваша електронна адреса використовується лише для відповіді на
                отримані електронні повідомлення і не передається третім особам.
                Ми ніколи не використовуємо вашу особисту інформацію, надану
                онлайн, для будь-яких інших цілей, крім тих, що описані вище.{" "}
              </p>
            </div>
          </div>
        </details>
      </div>
      <p className="text-sm font-semibold my-2 text-justify">
        Компанія не несе відповідальності за дії платіжного сервісу у випадку,
        якщо той порушує умови договору або встановлює додаткові комісії. Проте,
        ми завжди готові допомогти вам у вирішенні питань, що стосуються оплати
        за послуги доставки квітів. Будь ласка, не соромтеся звертатися до нас з
        будь-якими питаннями або проблемами, і ми з радістю вам допоможемо.
        Дякуємо за ваш вибір!
      </p>
    </div>
  );
};

export default Page;
