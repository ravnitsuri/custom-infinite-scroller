import React, { useEffect, useState } from "react";
import DataTable from "./components/DataTable";
import {
  AppContainer,
  ContentBox,
  FilterContainer
} from "./components/presentational";

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

  const onLoadMore = () => {
    if (!searchVal) setPage(page => page + 1);
  };

  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    let url = new URL("https://jsonplaceholder.typicode.com/photos") as any;
    let params = {
      _start: page * pagLimit,
      _limit: pagLimit
    } as any;

    if (searchVal) {
      params["title"] = searchVal;
    }

    var esc = encodeURIComponent;
    var query = Object.keys(params)
      .map(k => esc(k) + "=" + esc(params[k]))
      .join("&");

    console.log(url, query);

    fetch(url.href + "?" + query)
      .then(response => response.json())
      .then((json: APIPhoto[]) => {
        console.log(json);
        if (searchVal || page === 0) {
          setRows(rows => [...json]);
        } else {
          setRows(rows => [...rows, ...json]);
        }
      });
  }, [page, searchVal]);

  return (
    <AppContainer>
      <ContentBox>
        <h1>DataTable Component: </h1>
        <FilterContainer>
          <label htmlFor="Filter">Filter</label>
          <input
            type="text"
            className="form-control"
            aria-label="Filter"
            placeholder="Enter search text..."
            value={searchVal}
            onChange={e => {
              e.preventDefault();
              setSearchVal(e.target.value);
            }}
          />
        </FilterContainer>
        <DataTable
          columns={columns}
          rows={rows}
          onRowClick={onRowClick}
          onSelectionChange={onSelectionChange}
          onLoadMore={onLoadMore}
        />
      </ContentBox>
    </AppContainer>
  );
}

export default App;
