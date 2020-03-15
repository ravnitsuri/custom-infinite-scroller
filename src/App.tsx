import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DataTable from "./DataTable";

export interface APIPhoto {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #ccc;
`;

const ContentBox = styled.div`
  width: 100%;
  margin: 20px 40px;
`;

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Thumbnail Url",
        accessor: "thumbnailUrl",
        Cell: ({ row }: any) => <img alt={row.values.title} src={row.values.thumbnailUrl} height="60px"/>,
        width: 70
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }: any) => <a href={row.values.url}>{row.values.title}</a>
      },
      {
        Header: "Album ID",
        accessor: "albumId",
        numeric: false
      },
      {
        Header: "ID",
        accessor: "id",
        numeric: false
      },
      {
        Header: "Url",
        accessor: "url"
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

  const [pagStart, setPagStart] = useState(0);
  const pagLimit = 30;

  const [rows, setRows] = useState<APIPhoto[]>([]);

  useEffect(() => {
    fetch(
      `https://jsonplaceholder.typicode.com/photos?_start=${pagStart}&_limit=${pagLimit}`
    )
      .then(response => response.json())
      .then((json: APIPhoto[]) => {
        console.log(json);
        setRows([...rows, ...json]);
      });
  }, [pagStart]);

  return (
    <AppContainer>
      <ContentBox>
        <h1>DataTable Component will be rendered below: </h1>
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={onRowClick}
          onSelectionChange={onSelectionChange}
          paginator={{pagStart, setPagStart}}
        />
      </ContentBox>
    </AppContainer>
  );
}

export default App;
