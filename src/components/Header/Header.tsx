import "./Header.scss";
import HeaderTop from "@/components/Header/HeaderTop/HeaderTop";
import HeaderMain from "@/components/Header/HeaderMain/HeaderMain";

const Header = () => {
  return (
    <header id="header" className="h-fit">
      <HeaderTop />
      <HeaderMain />
    </header>
  );
};

export default Header;
