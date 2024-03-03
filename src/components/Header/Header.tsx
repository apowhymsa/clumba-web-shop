import "./Header.scss";
import HeaderTop from "@/components/Header/HeaderTop/HeaderTop";
import HeaderMain from "@/components/Header/HeaderMain/HeaderMain";

const Header = () => {
  console.log("header");
  return (
    <header id="header" className="h-fit bg-light dark:bg-dark">
      <HeaderTop />
      <HeaderMain />
    </header>
  );
};

export default Header;
