import "./Footer.scss";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="flex justify-around h-fit gap-x-3 bg-gray-900 text-white px-10 py-10 flex-wrap"
    >
      <nav>
        <ul className="flex flex-col justify-around h-full">
          <li className="font-semibold text-[#fb7185]">Карта сайта</li>
          <li>
            <Link href="/">Главная</Link>
          </li>
          <li>
            <Link href="/products?sort=1">Товары</Link>
          </li>
          <li>
            <Link href="/about-us">О нас</Link>
          </li>
        </ul>
      </nav>
      <div className="flex flex-col justify-around h-[110px]">
        <p className="font-semibold text-[#fb7185]">Контактная информация</p>
        <Link href={'tel:+380680000000'}>+380680000000</Link>
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
      ></iframe>
    </footer>
  );
};

export default Footer;
