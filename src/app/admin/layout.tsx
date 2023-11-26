'use client'

import {FC, ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import NavMenu from "@/components/admin/NavMenu/NavMenu";
import {Comfortaa, Open_Sans, Poppins, Raleway, Roboto, Rubik} from "next/font/google";
import {clsx} from "clsx";
import {usePathname} from "next/navigation";

type Props = {
    children?: ReactNode;
}

const queryClient = new QueryClient();
const Layout: FC<Props> = ({children}) => {
    const pathname = usePathname();

    return <div className="bg-white min-h-screen">
        <QueryClientProvider client={queryClient}>
            <div className={clsx("flex gap-x-4")}>
                <NavMenu/>
                <div className="w-full ml-[320px]">
                    <div className="flex gap-x-2 text-lg shadow p-4 bg-[#f5f5f5]">
                        <span>Поточна робоча область: </span>
                        {pathname.startsWith('/admin/ingCategories') && <h2 className="font-semibold">Категорії інгредієнтів</h2>}
                        {pathname.startsWith('/admin/ingredients') && <h2 className="font-semibold">Інгредієнти</h2>}
                        {pathname.startsWith('/admin/productCategories') && <h2 className="font-semibold">Категорії товарів</h2>}
                        {pathname.startsWith('/admin/products') && <h2 className="font-semibold">Товари</h2>}
                    </div>
                    {children}
                </div>
            </div>
        </QueryClientProvider>
    </div>
}

export default Layout;