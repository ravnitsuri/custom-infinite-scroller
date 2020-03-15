import React, { useEffect, useState } from "react";
import DataTable from "./components/DataTable";
import { AppContainer, ContentBox } from "./components/presentational";

export interface APIPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Thumbnail",
        accessor: "thumbnailUrl",
        Cell: ({ row }: any) => (
          <img
            alt={row.values.title}
            src={row.values.thumbnailUrl}
            height="60px"
          />
        ),
        width: 50
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }: any) => <a href={row.values.url}>{row.values.title}</a>
      },
      {
        Header: "Url",
        accessor: "url"
      },
      {
        Header: "Album ID",
        accessor: "albumId",
        numeric: false
      },
      {
        Header: "ID",
        accessor: "id",
        numeric: true
      }
    ],
    []
  );

  const onRowClick = ({ rowData, rowIndex }: any) => {
    console.log({ rowData, rowIndex });
  };

  const onSelectionChange = (selection: string[]) => {
    console.log({ selection });
  };

  // ==============================
  // Paginated data fetching
  // ==============================

  const [page, setPage] = useState(0);
  const pagLimit = 30;

  const [rows, setRows] = useState<APIPhoto[]>([]);

  useEffect(() => {
    fetch(
      `https://jsonplaceholder.typicode.com/photos?_start=${page *
        pagLimit}&_limit=${pagLimit}`
    )
      .then(response => response.json())
      .then((json: APIPhoto[]) => {
        console.log(json);
        setRows(rows => [...rows, ...json]);
      });
  }, [page]);

  return (
    <AppContainer>
      <ContentBox>
        <h1>DataTable Component: </h1>
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={onRowClick}
          onSelectionChange={onSelectionChange}
          paginator={{ page, setPage }}
        />
      </ContentBox>
    </AppContainer>
  );
}

export default App;
