import React, { useEffect, useState } from "react";
import {
  useFlexLayout,
  useResizeColumns,
  useRowSelect,
  useTable
} from "react-table";
import { Waypoint } from "react-waypoint";
import { IndeterminateCheckbox } from "./checkbox";
import { PaddingBox } from "./presentational";

// ===================================
// Setup for "numeric" data alignment
// ===================================

// setting it up so only values change direction, not headings

const headerProps = (props: any, { column }: any) => getStyles(props, null);

const cellProps = (props: any, { cell }: any) =>
  getStyles(props, cell.column.numeric);

const getStyles = (props: any, align: any = false) => [
  props,
  {
    style: {
      justifyContent: align ? "flex-end" : "flex-start",
      alignItems: "flex-start",
      display: "flex"
    }
  }
];

export function Table({
  columns,
  data,
  onRowClick,
  onSelectionChange,
  onLoadMore
}: any) {
  // ===================================
  // Setup for column sizing defaults
  // ===================================

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: 150,
      maxWidth: 300
    }),
    []
  );

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds }
  }: any = useTable(
    {
      columns,
      data,
      defaultColumn
    } as any,
    useResizeColumns,
    useFlexLayout,
    useRowSelect,
    hooks => {
      hooks.allColumns.push(columns => [
        {
          id: "selection",
          disableResizing: true,
          minWidth: 50,
          width: 50,
          maxWidth: 50,
          Header: ({ getToggleAllRowsSelectedProps }: any) => (
            <div onClick={e => e.stopPropagation()}>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }: any) => (
            <div onClick={e => e.stopPropagation()}>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          )
        },
        ...columns
      ]);
      hooks.useInstanceBeforeDimensions.push(({ headerGroups }: any) => {
        const selectionGroupHeader = headerGroups[0].headers[0];
        selectionGroupHeader.canResize = false;
      });
    }
  ) as any;

  // ===================================
  // Setup for checkbox handler
  // ===================================

  useEffect(() => {
    onSelectionChange(Object.keys(selectedRowIds));
  }, [selectedRowIds, onSelectionChange]);

  // ===================================
  // Setup for infinite scroll
  // ===================================

  const [initialLoad, setInitialLoad] = useState(true);

  const InfiniteScrollLoadDataFunction = () => {
    // stop run on initial render
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    onLoadMore()
  };
  const InfiniteScrollLoadDataEnd = () => {
    // note: could show/hide the loading indicator with this but it'll be buried in items anyway
    // note: could setup custom loader using this
    console.log(`calling InfiniteScrollLoadDataEnd`);
  };

  // ===================================
  // Resetting scroll position on reload
  // ===================================

  useEffect(() => {
    let el = document.querySelector(".tbody");
    if (el && el.scrollTo) {
      el.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup: any) => (
            <div {...headerGroup.getHeaderGroupProps({})} className="tr">
              {headerGroup.headers.map((column: any) => (
                <div {...column.getHeaderProps(headerProps)} className="th">
                  {column.render("Header")}
                  {column.canResize && (
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${
                        column.isResizing ? "isResizing" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="tbody">
          {rows.map((row: any) => {
            prepareRow(row);
            return (
              <div
                {...row.getRowProps()}
                className="tr"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  onRowClick({ rowData: row.values, rowIndex: row.index });
                }}
              >
                {row.cells.map((cell: any) => {
                  return (
                    <div {...cell.getCellProps(cellProps)} className="td">
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
          <Waypoint
            onEnter={InfiniteScrollLoadDataFunction}
            onLeave={InfiniteScrollLoadDataEnd}
            bottomOffset="-50px"
          >
          </Waypoint>
        </div>
      </div>
    </>
  );
}
