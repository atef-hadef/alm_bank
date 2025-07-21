"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Définition du type Client
type Client = {
  id: number
  name: string
  type: string
  loanAmount: number
  depositAmount: number
  calculatedRisk: number
  lastUpdated: string
}

// Données mockées pour les clients
const data: Client[] = [
  {
    id: 1,
    name: "Banque Nationale",
    type: "Banque",
    loanAmount: 5000000,
    depositAmount: 7500000,
    calculatedRisk: 0.35,
    lastUpdated: "2023-04-15",
  },
  {
    id: 2,
    name: "Crédit Mutuel",
    type: "Banque",
    loanAmount: 3500000,
    depositAmount: 4200000,
    calculatedRisk: 0.42,
    lastUpdated: "2023-04-12",
  },
  {
    id: 3,
    name: "BNP Paribas",
    type: "Banque",
    loanAmount: 8200000,
    depositAmount: 9100000,
    calculatedRisk: 0.28,
    lastUpdated: "2023-04-10",
  },
  {
    id: 4,
    name: "Société Générale",
    type: "Banque",
    loanAmount: 6100000,
    depositAmount: 5800000,
    calculatedRisk: 0.51,
    lastUpdated: "2023-04-08",
  },
  {
    id: 5,
    name: "HSBC France",
    type: "Banque",
    loanAmount: 4300000,
    depositAmount: 6200000,
    calculatedRisk: 0.33,
    lastUpdated: "2023-04-05",
  },
  {
    id: 6,
    name: "Crédit Agricole",
    type: "Banque",
    loanAmount: 7200000,
    depositAmount: 8500000,
    calculatedRisk: 0.31,
    lastUpdated: "2023-04-03",
  },
  {
    id: 7,
    name: "Assurance Vie AXA",
    type: "Assurance",
    loanAmount: 2500000,
    depositAmount: 3800000,
    calculatedRisk: 0.29,
    lastUpdated: "2023-04-01",
  },
  {
    id: 8,
    name: "Allianz France",
    type: "Assurance",
    loanAmount: 1800000,
    depositAmount: 2500000,
    calculatedRisk: 0.38,
    lastUpdated: "2023-03-28",
  },
  {
    id: 9,
    name: "Groupe BPCE",
    type: "Banque",
    loanAmount: 6500000,
    depositAmount: 7200000,
    calculatedRisk: 0.44,
    lastUpdated: "2023-03-25",
  },
  {
    id: 10,
    name: "CNP Assurances",
    type: "Assurance",
    loanAmount: 3200000,
    depositAmount: 4100000,
    calculatedRisk: 0.36,
    lastUpdated: "2023-03-22",
  },
]

// Définition des colonnes
export const columns: ColumnDef<Client>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "loanAmount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Montant du Prêt
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("loanAmount"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "depositAmount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Montant des Dépôts
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("depositAmount"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "calculatedRisk",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Risque Calculé
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const risk = Number.parseFloat(row.getValue("calculatedRisk"))
      return (
        <div className="flex items-center">
          <span
            className={`mr-2 h-2 w-2 rounded-full ${
              risk > 0.5 ? "bg-red-500" : risk > 0.3 ? "bg-yellow-500" : "bg-green-500"
            }`}
          />
          <span>{risk.toFixed(2)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "lastUpdated",
    header: "Dernière Mise à Jour",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastUpdated"))
      return <div>{date.toLocaleDateString("fr-FR")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(client.id.toString())}>
              Copier l&apos;ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
            <DropdownMenuItem>Simuler un scénario</DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ClientsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Clients</CardTitle>
        <CardDescription>Gérez et analysez les données de vos clients</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrer par nom..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s)
            sélectionnée(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
