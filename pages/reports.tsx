import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Head from "next/head";

//imports for the collapsible table
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useTheme, CustomTheme } from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { withIronSessionSsr } from "iron-session/next";
import { IUser, User, UserRole } from "../models/user";
import { InferGetServerSidePropsType } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../models/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

//Reports

//Excess Reports
const ExcessReportCols: GridColDef[] = [
    { field: "name", headerName: "Product Name", width: 170 },
    {
      field: "count",
      headerName: "Quantity In Excess",
      width: 75,
      align: "right",
      headerAlign: "right",
    },
];

//Sales Report
const MenuToPriceColumns: GridColDef[] = [
    { field: "name", headerName: "Menu Item", width: 220 },
    {
        field: "price",
        headerName: "Price",
        width: 75,
        align: "right",
        headerAlign: "right",
    },
];

  export default function DataTables({
    user,
  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const excess = useSelector((state: RootState) => state.manager.excess);
    const menuItems = useSelector((state: RootState) => state.manager.menuItems);
    const theme = useTheme<CustomTheme>();
    return (
      <div style={{ width: "100%" }}>
        <Head>
          <title>Spin &apos;N Stone | Manager Reports</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1
          style={{
            paddingLeft: 40,
            paddingTop: 30,
            color: theme.palette.primary.main,
          }}
        >
          Excess Report
        </h1>
        <DataGrid
          rows={excess}
          columns={ExcessReportCols}
          getRowId={(excess)=>excess.name}
          pageSize={100}
          rowsPerPageOptions={[Infinity]}
          sx={{ height: "420px", marginLeft: 5, marginRight: 5, marginTop: 1 }}
        />
  
        <br />
        <h1
          style={{
            paddingLeft: 40,
            paddingTop: 30,
            color: theme.palette.primary.main,
          }}
        >
          Sales Report
        </h1>
        <DataGrid
          rows={menuItems}
          columns={MenuToPriceColumns}
          pageSize={100}
          rowsPerPageOptions={[10]}
          sx={{ height: "423px", marginLeft: 5, marginRight: 5, marginTop: 1 }}
        />
  
        <br></br>
        <h1
          style={{
            paddingLeft: 40,
            paddingTop: 30,
            paddingBottom: 10,
            color: theme.palette.primary.main,
          }}
        >
        </h1>
      </div>
    );
  }
  
  export const getServerSideProps = withIronSessionSsr(
    function (context: { req: any; res: any }) {
      const { req, res } = context;
      const user: IUser | undefined = req.session.user;
  
      if (user === undefined || !user.authenticated) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        res.end();
        return {
          props: {
            user: User({
              username: "",
              authenticated: false,
              role: UserRole.CUSTOMER,
              id: -1,
            }),
          },
        };
      }
  
      if (user.role !== UserRole.MANAGER) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        res.end();
        return {
          props: {
            user: User({
              username: user.username,
              authenticated: user.authenticated,
              role: user.role,
              id: user.id || -1,
            }),
          },
        };
      }
  
      return {
        props: { user: req.session.user as IUser },
      };
    },
    {
      cookieName: "session",
      password: process.env.SECRET_COOKIE_PASSWORD as string,
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
    }
  );