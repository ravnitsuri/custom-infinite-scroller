import React from "react";
import { Styles } from "./presentational";
import { Table } from './Table';


function DataTable({
  rows,
  columns,
  onRowClick,
  onSelectionChange,
  onLoadMore
}: any) {
  return (
    <Styles>
      <Table
        columns={columns}
        data={rows}
        onRowClick={onRowClick}
        onSelectionChange={onSelectionChange}
        onLoadMore={onLoadMore}
      />
    </Styles>
  );
}

export default DataTable;
