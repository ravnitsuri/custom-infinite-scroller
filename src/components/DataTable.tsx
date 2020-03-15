import React from "react";
import { Styles } from "./presentational";
import { Table } from './Table';


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
