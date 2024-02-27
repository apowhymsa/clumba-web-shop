import "./Footer.scss";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  return (
    <footer
      id="footer"
      className="flex flex-col h-fit gap-x-3 bg-dark dark:border dark:border-[#1f2937] text-white"
    >
      {/* <nav>
        <ul className="flex flex-col justify-around h-full">
          <li className="font-semibold text-[#fb7185]">Карта сайта</li>
          <li>
            <Link href="/">Главная</Link>
          </li>
          <li>
            <Link href="/products?limit=15&page=1&sort=1&price=0-10000&category=all">
              Товары
            </Link>
          </li>
          <li>
            <Link href="/about-us">О нас</Link>
          </li>
        </ul>
      </nav>
      <div className="flex flex-col justify-around h-[110px]">
        <p className="font-semibold text-[#fb7185]">Контактная информация</p>
        <Link href={"tel:+380680000000"}>+380680000000</Link>
        <p>г. Кривой Рог, Улица 1А.</p>
      </div>
      <div>
        <p className="font-semibold text-[#fb7185]">Мы в социальных сетях</p>
        <Link href="https://www.instagram.com/clumba.krrog/" target="_blank">
          <Image
            src={"/icons8-instagram.svg"}
            alt="Instagram Logo"
            width={48}
            height={48}
          />
        </Link>
      </div>

      <iframe
        width="600"
        className="rounded-md"
        height="150"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1889.9682173759988!2d33.42501668635718!3d47.939890837740315!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40db21dd49d3a0b7%3A0xe546264d67239d4d!2z0JzQsNCz0LDQt9C40L0gItCa0LvRg9C80LHQsCI!5e0!3m2!1sru!2sua!4v1696154248083!5m2!1sru!2sua"
      ></iframe> */}
      <div className="px-5 md:px-10 flex justify-between flex-wrap gap-x-10 gap-y-4 py-4">
        <div>
          <h3 className="text-base lg:text-lg font-medium text-rose-400">
            {i18n.language === "uk" ? "Карта сайту" : "Site map"}
          </h3>
          <ul>
            <li className="hover:text-rose-400 w-fit transition-colors">
              <Link href="/">{t("Home")}</Link>
            </li>
            <li className="hover:text-rose-400 w-fit transition-colors">
              <Link href="/products?limit=15&page=1&sort=1&price=0-10000&category=all">
                {t("ProductCatalog")}
              </Link>
            </li>
            <li className="hover:text-rose-400 w-fit transition-colors">
              <Link href="/customer_info">{t("AboutUs")}</Link>
            </li>
            <li className="hover:text-rose-400 w-fit transition-colors">
              <Link href="/customer_info#delivery_payment">
                {i18n.language === "uk"
                  ? "Доставка та оплата"
                  : "Delivery and payment"}
              </Link>
            </li>
            <li className="hover:text-rose-400 w-fit transition-colors">
              <Link href="/customer_info#bonuses">
                {i18n.language === "uk" ? "Бонусна система" : "Bonus system"}
              </Link>
            </li>
            <li className="hover:text-rose-400 w-fit transition-colors">
              <Link href="/customer_info#privacy_policy">
                {i18n.language === "uk"
                  ? "Політика конфіденційності"
                  : "Privacy policy"}
              </Link>
            </li>
            <li className="hover:text-rose-400 w-fit transition-colors">
              <Link href="/oferta">
                {i18n.language === "uk"
                  ? "Публічний договір"
                  : "Public agreement"}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-base lg:text-lg font-medium text-rose-400">
            {i18n.language === "uk" ? "Контакти" : "Contacts"}
          </h3>
          <ul>
            <li className="flex gap-x-2">
              <span className="text-[#72838d] font-semibold">
                {
                  (t("Auth", { returnObjects: true }) as any).RegisterForm
                    .phoneNumber.label
                }
                :
              </span>
              <span>
                <Link href={"tel:+380680000000"}>+380680000000</Link>
              </span>
            </li>
            <li className="flex gap-x-2">
              <span className="text-[#72838d] font-semibold">
                {i18n.language === "uk"
                  ? "Графік роботи магазину"
                  : "Store opening hours"}
                :
              </span>
              <span>Пн-Нд 09:00-19:00</span>
            </li>
            <li className="flex gap-x-2">
              <span className="text-[#72838d] font-semibold">Адреса:</span>
              <span>Адреса магазину</span>
            </li>
            <li className="flex gap-x-2">
              <span className="text-[#72838d] font-semibold">Email:</span>
              <span>clumbaeshop@gmail.com</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-base lg:text-lg font-medium text-rose-400">
            {i18n.language === "uk" ? "Наші соціальні мережі" : "Our socials"}
          </h3>
          <ul className="flex max-w-[240px] flex-wrap">
            <li className="flex gap-x-2">
              <Link
                href="https://www.instagram.com/clumba.krrog/"
                target="_blank"
              >
                <Image
                  src={"/icons8-instagram.svg"}
                  alt="Instagram Logo"
                  width={35}
                  height={35}
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center mb-8 mt-2 px-5 md:px-10">
        <iframe
          title="GoogleMapsFrame"
          width="600"
          className="rounded-md"
          height="150"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1889.9682173759988!2d33.42501668635718!3d47.939890837740315!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40db21dd49d3a0b7%3A0xe546264d67239d4d!2z0JzQsNCz0LDQt9C40L0gItCa0LvRg9C80LHQsCI!5e0!3m2!1sru!2sua!4v1696154248083!5m2!1sru!2sua"
        ></iframe>
      </div>
      <div className="px-5 md:px-10 flex flex-1 justify-between items-center border-t border-gray-600 py-2 flex-col md:flex-row">
        <Image
          src={"/clumba-logo.svg"}
          alt="Clumba Logo"
          width={100}
          height={40}
        />
        <span className="text-sm md:text-base">
          {i18n.language === "uk"
            ? "Всі права захищені"
            : "All rights reserved"}{" "}
          © {new Date().getFullYear()}
        </span>
      </div>
      <div className="flex gap-x-4 px-5 md:px-10 py-2 flex-wrap items-center">
        <Image src="/visa_image.svg" alt="VISA" width={40} height={40} />
        <Image src="/mastercard_image.svg" alt="VISA" width={35} height={35} />
      </div>
    </footer>
  );
};

export default Footer;
