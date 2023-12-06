// Hooks and Types React
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
// React Router DOM
import { useNavigate } from "react-router-dom";
// Services
import { getAllItem, removeItem } from "../services/UserService";
// Interfaces
import { API_Params, IUserData } from '../types/User';
// Components
import { Search } from "./Search";
// React tables
import { CellProps, CellValue, Column, useTable } from 'react-table'
// Material UI
import { Pagination, Select, MenuItem, SelectChangeEvent  , FormControl} from "@mui/material";
// Sweet Alert
import Swal from "sweetalert2";
import { ClassNames } from "@emotion/react";

export const UsersList = () => {

  const [users, setUsers] = useState<Array<IUserData>>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');

  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(3);

  const pageSizes = [3, 6, 9];

  const UsersRef = useRef<Array<IUserData>>([]);
  let navigate = useNavigate();

  UsersRef.current = users;

  useEffect(() => {
    retrieveUsers()
  }, [page, pageSize]);

  const onChangeSearchTitle = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const searchTitle = target.value;
    setSearchTitle(searchTitle);
  };

  const getRequestParams = (searchTitle: string, page: number, pageSize: number) => {
    let params: API_Params = {};

    if (searchTitle) {
      params['title'] = searchTitle;
    }

    if (page) {
      params['page'] = page - 1;
    }

    if (pageSize) {
      params['size'] = pageSize;
    }

    return params;
  };

  const retrieveUsers = () => {
    getAllItem()
      .then(({ data }) => {
        
        let searchedData = [...data];

        if(searchTitle !== '')
        {
          console.log(data);
          searchedData = searchedData.filter( item =>
            Object.values(item).some(value =>
              typeof value === "string" && value.includes(searchTitle)
            ));
          console.log(searchedData);
        }

        const users = searchedData.slice((page-1) * pageSize , page * pageSize);
        let totalPages : number = Math.floor(searchedData.length / pageSize);
        if(searchedData.length % pageSize != 0) totalPages ++;
        setUsers(users);
        setCount(totalPages);
      })
      .catch((e: Error) => console.log(e))
  };

  const findByTitle = () => {
    setPage(1);
    retrieveUsers();
  };

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const handlePageSizeChange = ({ target }: SelectChangeEvent<number>) => {
    setPageSize(target.value as number);
    setPage(1);
  };

  const refreshList = () => {
    retrieveUsers();
  };

  const openUser = (rowIndex: number) => {
    const id = UsersRef.current[rowIndex].id;
    navigate('/' + id)
  };

  const deleteUser = (rowIndex: number) => {
    const id = UsersRef.current[rowIndex].id;
    removeItem(id)
      .then(() => {
        Swal.fire(`${UsersRef.current[rowIndex].name} Successfully Deleted.`, '', 'success');

        let newUsers = [...UsersRef.current];
        newUsers.splice(rowIndex, 1);

        retrieveUsers();
        setUsers(newUsers);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns: Column<IUserData>[] = useMemo(() => [
    {
      Header: 'Documento',
      accessor: 'id' as keyof IUserData,
    },
    {
      Header: 'Nombres',
      accessor: 'firstname' as keyof IUserData,
    },
    {
      Header: 'Apellidos',
      accessor: 'name' as keyof IUserData,
    },
    {
      Header: 'Usuario',
      accessor: 'position' as keyof IUserData,
      Cell: ({ value }: CellProps<IUserData>): CellValue => {

        if(value == 0) return "Auditor";
        else if(value == 1) return "Administrator";
        else if(value == 2) return "Developer";
        else if(value == 3) return "Manager";
      }
    },
    {
      Header: 'Telefono',
      accessor: 'telephone' as keyof IUserData,
    },
    {
      Header: 'Correo',
      accessor: 'email' as keyof IUserData,
    },
    {
      Header: 'Estado',
      accessor: 'status' as keyof IUserData,
      Cell: ({ value }: CellProps<IUserData>): CellValue => {
        return value ? 'Activo' : 'Deactivo';
      }
    },
    {
      Header: 'Actions',
      accessor: 'actions' as CellValue,
      Cell: ({ row }: CellProps<IUserData>): JSX.Element => {
        const rowIdx = row.id;
        return (
          <div className='d-flex justify-content-center'>
            <span onClick={() => openUser(parseInt(rowIdx))}>
              <i className="far fa-edit action mx-2"></i>
            </span>
            <span onClick={() => deleteUser(parseInt(rowIdx))}>
              <i className="fas fa-trash action mx-2"></i>
            </span>
          </div>
        )
      }
    }
    // eslint-disable-next-line
  ], [])

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    rows,
  } = useTable<IUserData>({ columns, data: users })

  return (
    <div className="list row">

      <Search searchTitle={searchTitle} onChangeSearchTitle={onChangeSearchTitle} findByTitle={findByTitle} />

      <div className="col-md-12 list">
        <div className="list row">
          <div className="col-md-10">
            <FormControl sx= {{ width: 100 }} size="small">
              <Select
                onChange={handlePageSizeChange}
                value={pageSize}
                style= {{ padding: 0 }}
              >
                {
                  pageSizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </div>
          <div className="col-md-2">
            <a className="btn btn-success" onClick = { () => navigate('/add')}  style={{ float : 'right' }}>
              Add User
            </a>
          </div>
        </div>
        <table
          className="table table-striped table-bordered table-hover mt-3"
          {...getTableProps()}
        >
          <thead>
            {
              headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>

        <Pagination
          className="my-3"
          count={count}
          page={page}
          siblingCount={1}
          boundaryCount={1}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />

      </div>
    </div>
  )
}
