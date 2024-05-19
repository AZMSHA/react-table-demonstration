"use client";
import React from "react";
import {
  Column,
  ColumnFiltersState,
  ColumnDef,
  RowData,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Chip,
} from "@mui/material";
import {
  FirstPage,
  LastPage,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

function TableLayout() {
  const rerender = React.useReducer(() => ({}), {})[1];

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns = React.useMemo<ColumnDef<Person, any>[]>(
    () => [
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.lastName,
        id: "lastName",
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "fullName",
        header: "Full Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "age",
        header: () => "Age",
        meta: {
          filterVariant: "range",
        },
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        meta: {
          filterVariant: "range",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        meta: {
          filterVariant: "select",
        },
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        meta: {
          filterVariant: "range",
        },
      },
    ],
    []
  );

  const [data, setData] = React.useState<Person[]>(() => makeData(5_000));
  const refreshData = () => setData((_old) => makeData(50_000));

  const table = useReactTable({
    data,
    columns,
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <Box sx={{ padding: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableCell key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: header.column.getCanSort()
                                ? "pointer"
                                : "default",
                            }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </Box>
                          {header.column.getCanFilter() ? (
                            <Box sx={{ marginTop: 1 }}>
                              <Filter column={header.column} />
                            </Box>
                          ) : null}
                        </>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginTop: 2 }}>
        <IconButton
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <FirstPage />
        </IconButton>
        <IconButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </IconButton>
        <IconButton
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <LastPage />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          | Go to page:
          <TextField
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            sx={{ width: "4rem" }}
          />
        </Box>
        <FormControl>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            label="Rows per page"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                Show {pageSize}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box>{table.getPrePaginationRowModel().rows.length} Rows</Box>
      <Box>
        <Button onClick={() => rerender()}>Force Rerender</Button>
      </Box>
      <Box>
        <Button onClick={() => refreshData()}>Refresh Data</Button>
      </Box>
      <pre>
        {JSON.stringify(
          { columnFilters: table.getState().columnFilters },
          null,
          2
        )}
      </pre>
    </Box>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "range" ? (
    <Box sx={{ display: "flex", gap: 2 }}>
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder="Min"
        style={{ width: "6rem" }}
      />
      <DebouncedInput
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(value) =>
          column.setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder="Max"
        style={{ width: "6rem" }}
      />
    </Box>
  ) : filterVariant === "select" ? (
    <FormControl fullWidth>
      <Select
        value={columnFilterValue?.toString()}
        onChange={(e) => column.setFilterValue(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="complicated">complicated</MenuItem>
        <MenuItem value="relationship">relationship</MenuItem>
        <MenuItem value="single">single</MenuItem>
      </Select>
    </FormControl>
  ) : (
    <DebouncedInput
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      style={{ width: "12rem" }}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default TableLayout;
