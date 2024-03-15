import CustomerInfoComponent from "@/components/CustomerInfoComponents";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title:
    "Информация для клиента (доставка и оплата, политика конфиденциальности, бонусная система). Интернет-магазин Clumba - clumba.kr.ua",
  alternates: {
    canonical: "https://clumba.kr.ua/customer_info",
  },
  verification: {
    google:
      "google-site-verification=KhQAvdB6UU_sbaYyyfKr7h91CqrY-QmrbgDnQH7cNzk",
  },
};

const Page = () => {
  return <CustomerInfoComponent />;
};

export default Page;
