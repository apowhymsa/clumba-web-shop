"use client";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnResizeMode,
  SortingState,
  ColumnDef,
  VisibilityState,
} from "@tanstack/react-table";
import { memo, useEffect, useState } from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import "./BasicTable.scss";
import {
  LiaSortSolid,
  LiaSortUpSolid,
  LiaSortDownSolid,
} from "react-icons/lia";
import { BsThreeDots } from "react-icons/bs";
import { clsx } from "clsx";
import Link from "next/link";

type Props = {
  data: any[];
  columns: ColumnDef<any, any>[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
  isProducts?: boolean;
  isOrders?: boolean;
  isOrderHistory?: boolean;
  onClickDetails?: (id: string) => void;
  onViewProducts?: (id: string, cTitle: string) => void;
};
const BasicTable = (props: Props) => {
  const {
    isOrders,
    isOrderHistory,
    onClickDetails,
    onViewProducts,
    data,
    columns,
    onUpdate,
    onDelete,
    isProducts,
  } = props;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [dropDownShown, setDropDownShown] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting: sorting,
      globalFilter: filtering,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnVisibilityChange: setColumnVisibility,
  });

  console.log("table render");

  if (data.length === 0) {
    return <div>Даних немає</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 w-full mt-4 text-[14px]">
        <div className="flex items-center gap-x-4">
          <p>Всього ({table.getFilteredRowModel().rows.length})</p>
        </div>
        {!isOrderHistory && (
          <input
            type="text"
            className="rounded h-8 text-[14px]"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            placeholder="Пошук..."
          />
        )}
      </div>
      <div className="flex items-center justify-between mb-3 w-full text-[14px]">
        <span>
          {`Сторінка: ${
            table.getState().pagination.pageIndex + 1
          } - ${Math.ceil(table.getFilteredRowModel().rows.length / 10)}`}
        </span>
        <div className="flex gap-x-2">
          <button
            title="Перша сторінка"
            onClick={() => table.setPageIndex(0)}
            className="flex items-center justify-center bg-[#f5f5f5] w-7 h-7 transition-colors rounded hover:bg-gray-300"
          >
            <ChevronDoubleLeftIcon className="w-5 h-5 text-black" />
          </button>
          <button
            title="Попередня сторінка"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className="flex items-center justify-center bg-[#f5f5f5] w-7 h-7 transition-colors rounded hover:bg-gray-300 disabled:hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeftIcon className="w-5 h-5 text-black" />
          </button>
          <button
            title="Наступна сторінка"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className="flex items-center justify-center bg-[#f5f5f5] w-7 h-7 transition-colors rounded hover:bg-gray-300 disabled:hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRightIcon className="w-5 h-5 text-black" />
          </button>
          <button
            title="Остання сторінка"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            className="flex items-center justify-center bg-[#f5f5f5] w-7 h-7 transition-colors rounded hover:bg-gray-300"
          >
            <ChevronDoubleRightIcon className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full border-collapse text-[14px] bg-[#ffffff] border border-[#e3e3e3]">
          <thead className="bg-[#f7f7f7] border border-[#e3e3e3]">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <tr
                key={headerGroup.id}
                className={clsx(index === 0 && "rounded-tl-xl")}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 text-[#616161]"
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : "200px",
                      minWidth:
                        header.getSize() !== 150 ? header.getSize() : "200px",
                      maxWidth:
                        header.getSize() !== 150 ? header.getSize() : "300px",
                    }}
                  >
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className="flex items-center justify-center gap-x-4 cursor-pointer font-semibold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <LiaSortUpSolid />,
                        desc: <LiaSortDownSolid />,
                      }[header.column.getIsSorted() as string] ?? (
                        <LiaSortSolid />
                      )}
                    </div>
                  </th>
                ))}
                {!isOrderHistory && (
                  <th className="p-2 w-[15%] text-[#616161]">Дії</th>
                )}
              </tr>
            ))}
          </thead>
          <tbody className="text-[13px]">
            {table.getRowModel().rows.map((row) => (
              <>
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-[#f5f5f5] border border-[#ebebeb]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={clsx(
                        "flex-1 p-2 text-[#6c757d] font-medium whitespace-normal overflow-hidden max-w-[400px]"
                      )}
                    >
                      {!Array.isArray(cell.getValue()) &&
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                    </td>
                  ))}
                  {isOrders ? (
                    <td className="flex justify-center items-center py-[5px] drop-down-button relative transition-colors text-[#6c757d] font-medium">
                      <span
                        className="rounded bg-rose-400 cursor-pointer text-white p-2 transition-all hover:bg-rose-500"
                        onClick={() =>
                          onClickDetails &&
                          onClickDetails(
                            row.getAllCells()[0].getValue<string>()
                          )
                        }
                      >
                        Докладніше
                      </span>
                    </td>
                  ) : (
                    !isOrderHistory && (
                      <td className="drop-down-button px-2 relative transition-colors text-[#6c757d] font-medium">
                        <div className="flex justify-center items-center gap-x-4">
                          <span
                            className="bg-blue-600 cursor-pointer p-1 rounded transition-colors hover:bg-blue-700"
                            title="Редагувати"
                            onClick={() =>
                              onUpdate &&
                              onUpdate(row.getAllCells()[0].getValue<string>())
                            }
                          >
                            <PencilSquareIcon className="w-5 h-5 text-white" />
                          </span>
                          {onViewProducts && (
                            <span
                              className="bg-amber-600 cursor-pointer p-1 rounded transition-colors hover:bg-amber-700"
                              title="Переглянути товари, які прив`язані до категорії"
                              onClick={() =>
                                onViewProducts(
                                  row.getAllCells()[0].getValue<string>(),
                                  row.getAllCells()[2].getValue<string>()
                                )
                              }
                            >
                              <EyeIcon className="w-5 h-5 text-white" />
                            </span>
                          )}
                          <span
                            className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700"
                            title="Видалити"
                            onClick={() =>
                              onDelete &&
                              onDelete(row.getAllCells()[0].getValue<string>())
                            }
                          >
                            <TrashIcon className="w-5 h-5 text-white" />
                          </span>
                        </div>
                      </td>
                    )
                  )}
                </tr>
                {isProducts
                  ? row.getAllCells().map(
                      (cell) =>
                        Array.isArray(cell.getValue()) &&
                        (cell.getValue() as any[]).map((renderCell) => (
                          <tr
                            key={renderCell._id}
                            className="transition-colors bg-[#f5f5f5]"
                          >
                            <td className="bg-white"></td>
                            <td className="flex-1 p-2 text-[#6c757d] font-medium">
                              {renderCell.title}
                            </td>
                            <td className="bg-white"></td>
                            <td className="flex-1 p-2 text-[#6c757d] font-medium text-center">
                              <ul className="flex flex-col gap-y-2">
                                <li>Ціна: {renderCell.price} &#8372;</li>
                                <li>
                                  Знижка:{" "}
                                  {renderCell.discount.state
                                    ? `Присутня - ${renderCell.discount.percent}%`
                                    : "Відсутня"}
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))
                    )
                  : isOrders
                  ? row.getAllCells().map(
                      (cell) =>
                        Array.isArray(cell.getValue()) &&
                        (cell.getValue() as any[]).map((renderCell, index) => (
                          <tr
                            key={index}
                            className="transition-colors bg-[#f5f5f5]"
                          >
                            <td className="bg-white"></td>
                            <td className="bg-white"></td>
                            <td className="flex flex-col gap-y-2 flex-1 p-2 text-[#6c757d] font-medium">
                              <span>Назва: {renderCell.product_id.title}</span>
                              <span>
                                Варіант:{renderCell.productVariant.title}
                              </span>
                              <span>Кількість: {renderCell.count} од.</span>
                            </td>
                          </tr>
                        ))
                    )
                  : !isOrderHistory &&
                    row.getAllCells().map(
                      (cell) =>
                        Array.isArray(cell.getValue()) &&
                        (cell.getValue() as any[]).map((renderCell) => (
                          <tr
                            key={renderCell._id}
                            className="transition-colors bg-[#f5f5f5]"
                          >
                            <td className="bg-white"></td>
                            <td className="flex-1 p-2 text-[#6c757d] font-medium">
                              {renderCell.id.vType}
                            </td>
                            <td className="bg-white"></td>
                            <td className="flex-1 p-2 text-[#6c757d] font-medium text-center">
                              {renderCell.id.count} одиниць
                            </td>
                          </tr>
                        ))
                    )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(BasicTable);
