import './NavMenu.scss';
import {useRef} from "react";
import {FaListUl} from 'react-icons/fa6';
import {MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineExitToApp, MdOutlineMailOutline} from 'react-icons/md';
import {TbCheckupList} from 'react-icons/tb';
import Link from "next/link";

const NavMenu = () => {
    const ref = useRef<HTMLLIElement>(null);
    return <ul className="flex flex-wrap gap-y-2 p-6 bg-[#383f51] gap-x-4 w-full text-[14px]">
        <li ref={ref} className="flex flex-col rounded flex-1 gap-x-4 bg-white transition-colors cursor-pointer">
            <div className="flex gap-x-4 items-center flex-1 px-4 justify-between py-2 transition-colors hover:bg-rose-200 rounded" onClick={() => {
                ref.current?.classList.toggle('active-nav-item');
            }}>
                <div className="flex gap-x-4 items-center">
                    <FaListUl/>
                    <span>Каталог</span>
                </div>
                <span className="nav-menu-state-icon">
                    <MdKeyboardArrowDown/>
                </span>
            </div>
            <ul className="submenu flex-col flex px-4">
                <li className="flex items-center rounded gap-x-4 bg-white w-full transition-colors cursor-pointer hover:bg-rose-200">
                    <Link href="/admin/ingCategories" className="px-4 flex-1 h-10 grid items-center">Категорії інгредієнтів</Link>
                </li>
                <li className="flex items-center rounded gap-x-4 bg-white w-full transition-colors cursor-pointer hover:bg-rose-200">
                    <Link href="/admin/ingredients" className="px-4 flex-1 h-10 grid items-center">Інгредієнти</Link>
                </li>
                <li className="flex items-center rounded gap-x-4 bg-white w-full transition-colors cursor-pointer hover:bg-rose-200">
                    <Link href="/admin/productCategories" className="px-4 flex-1 h-10 grid items-center">Категорії товарів</Link>
                </li>
                <li className="flex items-center rounded gap-x-4 bg-white w-full transition-colors cursor-pointer hover:bg-rose-200">
                    <Link href="/admin/products" className="px-4 flex-1 h-10 grid items-center">Товари</Link>
                </li>
            </ul>
        </li>
        <li className="flex items-center flex-1 justify-between rounded gap-x-4 bg-white transition-colors cursor-pointer h-10 hover:bg-rose-200">
            <Link href="/admin/orders" className="flex gap-x-4 px-4 flex-1 h-10 items-center">
                <span><TbCheckupList/></span>
                <span>Замовлення</span>
            </Link>
        </li>
        <li className="flex items-center flex-1 justify-between rounded gap-x-4 bg-white transition-colors cursor-pointer h-10 hover:bg-rose-200">
            <Link href="/admin/mailing" className="flex gap-x-4 px-4 flex-1 h-10 items-center">
                <span><MdOutlineMailOutline /></span>
                <span>Розсилка</span>
            </Link>
        </li>
        <li className="flex items-center justify-between rounded gap-x-4 bg-white w-max transition-colors cursor-pointer h-10 hover:bg-rose-200">
            <Link href="/admin/mailing" className="flex gap-x-4 px-4 flex-1 h-10 items-center">
                <span><MdOutlineExitToApp  /></span>
            </Link>
        </li>
    </ul>
}

export default NavMenu;