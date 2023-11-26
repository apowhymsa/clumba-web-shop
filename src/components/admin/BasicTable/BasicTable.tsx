'use client';
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
    ColumnDef, VisibilityState
} from '@tanstack/react-table';
import {memo, useEffect, useState} from "react";
import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilSquareIcon,
    PlusIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import './BasicTable.scss';
import {LiaSortSolid, LiaSortUpSolid, LiaSortDownSolid} from 'react-icons/lia';
import {BsThreeDots} from 'react-icons/bs';
import {clsx} from "clsx";

type Props = {
    data: any[]; columns: ColumnDef<any, any>[]; onDelete: (id: string) => void; onUpdate: (id: string) => void;
}
const BasicTable = (props: Props) => {
    const {data, columns, onUpdate, onDelete} = props;
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filtering, setFiltering] = useState('');
    const [dropDownShown, setDropDownShown] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        '_id': false,
    })
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        state: {
            sorting: sorting, globalFilter: filtering,
            columnVisibility
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        onColumnVisibilityChange: setColumnVisibility
    });

    console.log('table render');

    if (data.length === 0) {
        return <div>Даних немає</div>
    }

    return (<>
        <div className="flex items-center justify-between mb-6 w-full mt-4">
            <div className="flex items-center gap-x-4">
                <p>Всього ({table.getFilteredRowModel().rows.length})</p>
            </div>
            <input type="text" className="rounded" value={filtering} onChange={(e) => setFiltering(e.target.value)}
                   placeholder="Пошук..."/>
        </div>
        <div className="flex items-center justify-between mb-3 w-full">
            <span>
                {`Сторінка: ${table.getState().pagination.pageIndex + 1} - ${Math.ceil(table.getFilteredRowModel().rows.length / 10)}`}
            </span>
            <div className="flex gap-x-2">
                <button title="Перша сторінка" onClick={() => table.setPageIndex(0)}
                        className="flex items-center justify-center bg-[#f5f5f5] w-8 h-8 transition-colors rounded hover:bg-gray-300">
                    <ChevronDoubleLeftIcon className="w-6 h-6 text-black"/></button>
                <button title="Попередня сторінка" disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                        className="flex items-center justify-center bg-[#f5f5f5] w-8 h-8 transition-colors rounded hover:bg-gray-300 disabled:hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-30">
                    <ChevronLeftIcon className="w-6 h-6 text-black"/></button>
                <button title="Наступна сторінка" disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                        className="flex items-center justify-center bg-[#f5f5f5] w-8 h-8 transition-colors rounded hover:bg-gray-300 disabled:hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-30">
                    <ChevronRightIcon className="w-6 h-6 text-black"/></button>
                <button title="Остання сторінка" onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        className="flex items-center justify-center bg-[#f5f5f5] w-8 h-8 transition-colors rounded hover:bg-gray-300">
                    <ChevronDoubleRightIcon className="w-6 h-6 text-black"/></button>
            </div>
        </div>
        <div className="max-w-full overflow-x-auto">
            <table className="w-full border-collapse min-w-full">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (<tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id} className="p-2 border border-[#eaeaea] min-w-[300px]">
                            <div onClick={header.column.getToggleSortingHandler()}
                                 className="flex items-center justify-center gap-x-4 cursor-pointer font-semibold">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                    asc: <LiaSortUpSolid/>, desc: <LiaSortDownSolid/>
                                } [header.column.getIsSorted() as string] ?? <LiaSortSolid/>}
                            </div>
                        </th>))}
                    <th className="p-2 border border-[#eaeaea] min-w-[145px]">
                        Дії
                    </th>
                </tr>))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <>
                    <tr key={row.id} className="transition-colors hover:bg-[#f5f5f5]">
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="flex-1 p-2 border border-[#eaeaea] text-[#6c757d] font-medium">
                            {!Array.isArray(cell.getValue()) && flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>))}
                    <td className="drop-down-button relative transition-colors border border-[#eaeaea] text-[#6c757d] font-medium">
                        <div className="flex justify-center items-center gap-x-4">
                        <span className="bg-blue-600 cursor-pointer p-1 rounded transition-colors hover:bg-blue-700"
                              title="Редагувати" onClick={() => onUpdate(row.getAllCells()[0].getValue<string>())}>
                            <PencilSquareIcon className="w-6 h-6 text-white"/>
                        </span>
                            <span className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700"
                                  title="Видалити"
                                  onClick={() => onDelete(row.getAllCells()[0].getValue<string>())}>
                                <TrashIcon className="w-6 h-6 text-white"/>
                            </span>
                        </div>
                    </td>
                </tr>
                        {row.getAllCells().map(cell => (
                            Array.isArray(cell.getValue()) && (
                                (cell.getValue() as any[]).map(renderCell => (
                                    <tr key={renderCell._id} className="transition-colors bg-[#f5f5f5]">
                                        <td className="bg-white"></td>
                                        <td className="flex-1 p-2 border border-[#eaeaea] text-[#6c757d] font-medium">{renderCell.vType}</td>
                                        <td className="bg-white"></td>
                                        <td className="flex-1 p-2 border border-[#eaeaea] text-[#6c757d] font-medium text-center">
                                            {renderCell.count} одиниць
                                        </td>
                                    </tr>
                                ))
                            )
                        ))}
                    </>
                ))}
                </tbody>
            </table>
        </div>
    </>)
}

export default memo(BasicTable);