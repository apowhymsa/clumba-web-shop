"use client";

import React, { useEffect } from "react";
import "./ProductsPage.scss";
import { FunnelIcon } from "@heroicons/react/24/solid";
import SortSelect from "@/components/Products/SortSelect/SortSelect";
import { useQueryClient } from "@tanstack/react-query";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default Layout;
