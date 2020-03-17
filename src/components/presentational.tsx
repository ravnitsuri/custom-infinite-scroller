import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #fafafa;
`;

export const ContentBox = styled.div`
  width: 100%;
  margin: 20px 40px;
`;

export const PaddingBox = styled.div`
  padding: 40px;
`;

export const Styles = styled.div`
  padding: 1rem;
  display: block;
  overflow: auto;

  .table {
    border-spacing: 0;
    background: white;
    border: 1px solid #f2f2f2;
    box-shadow: 0 10px 20px rgba(133, 143, 175, 0.1);
    border-radius: 4px;

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
      border-bottom: 1px solid #f2f2f2;
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      // border-right: 1px solid #f2f2f2;

      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        right: 14px !important;
        background: #f2f2f2;
        width: 1px;
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

export const FilterContainer = styled.div`
  padding: 18px;
  margin: 20px 10px;
  border-spacing: 0;
  background: white;
  border: 1px solid #f2f2f2;
  box-shadow: 0 10px 20px rgba(133, 143, 175, 0.1);
  border-radius: 4px;

  input {
    margin: 0 30px;
    border:  1px solid #f2f2f2;
    height: 30px;

  }
`;
