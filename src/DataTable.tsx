import React, { useEffect, forwardRef } from "react";
import styled from "styled-components";
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useRowSelect
} from "react-table";

import { FixedSizeList } from "react-window";

import InfiniteLoader from "react-window-infinite-loader";
import { Waypoint } from "react-waypoint";

const Styles = styled.div`
  padding: 1rem;
  display: block;
  overflow: auto;

  .table {
    border-spacing: 0;
    border: 1px solid black;

    .thead {
      overflow-y: auto;
      overflow-x: hidden;
    }

    .tbody {
      overflow-y: scroll;
      overflow-x: hidden;
      height: 500px;
    }

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
      border-bottom: 1px solid black;
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-right: 1px solid black;

      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        right: 0;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1;
        touch-action: none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`;

const headerProps = (props: any, { column }: any) =>
  getStyles(props, column.numeric);

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

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef: any = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

function Table({
  columns,
  data,
  onRowClick,
  onSelectionChange,
  paginator
}: any) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 200
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    // totalColumnsWidth,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
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
          minWidth: 35,
          width: 35,
          maxWidth: 35,
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

  useEffect(() => {
    onSelectionChange(selectedRowIds);
  }, [selectedRowIds]);

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style
          })}
          onClick={(e: React.MouseEvent) =>
            onRowClick({ rowData: row.values, rowIndex: row.index })
          }
          className="tr"
        >
          {row.cells.map((cell: any) => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render("Cell")}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  const InfiniteScrollLoadDataFunction = () => {
    console.log(`calling InfiniteScrollLoadDataFunction`, paginator);

    const { pagStart, setPagStart } = paginator;

    setPagStart(pagStart + 1);
  };
  const InfiniteScrollLoadDataEnd = () => {
    console.log(`calling InfiniteScrollLoadDataEnd`);
  };

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
              <div {...row.getRowProps()} className="tr">
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
            <div>Loading</div>
          </Waypoint>
        </div>
      </div>
    </>
  );
}

function DataTable({
  rows,
  columns,
  onRowClick,
  onSelectionChange,
  paginator
}: any) {
  return (
    <Styles>
      <Table
        columns={columns}
        data={rows}
        onRowClick={onRowClick}
        onSelectionChange={onSelectionChange}
        paginator={paginator}
      />
    </Styles>
  );
}

export default DataTable;
