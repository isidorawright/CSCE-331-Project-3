import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Head from "next/head";

//imports for the collapsible table
import { useTheme, CustomTheme } from "@mui/material";
import { withIronSessionSsr } from "iron-session/next";
import { IUser, User, UserRole } from "../models/user";
import { InferGetServerSidePropsType } from "next";
import { useSelector } from "react-redux";
import { RootState } from "../models/store";
import { useRouter } from "next/router";

//Reports

//Excess Report
const ExcessReportCols: GridColDef[] = [
  { field: "productName", headerName: "Product Name", width: 170 },
  {
    field: "percentSold",
    headerName: "Percent Sold",
    width: 120,
    align: "right",
    headerAlign: "right",
  },
];

//Sales Report
const SalesReportCols: GridColDef[] = [
  { field: "itemName", headerName: "Menu Item", width: 220 },
  {
    field: "itemSale",
    headerName: "Sales ($)",
    width: 75,
    align: "right",
    headerAlign: "right",
  },
];

//Restock Report
const RestockReportCols: GridColDef[] = [
  { field: "restockName", headerName: "Product Name", width: 170 },
  { field: "amount", headerName: "Quantity in Stock", width: 150, align: "right", headerAlign: "right" }
];

//Pair Analysis 
const PairAnalysisCols: GridColDef[] = [
  { field: "pairName", headerName: "Product Pairing", width: 350 }, 
  { field: "pairFrequency", headerName: "Frequency", width: 100, align: "right", headerAlign: "right" }
];

export default function DataTables({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const excess = useSelector((state: RootState) => state.manager.excess);
  const sales = useSelector((state: RootState) => state.manager.sales);
  const restock = useSelector((state: RootState) => state.manager.restock);
  const pairs = useSelector((state: RootState) => state.manager.pairs);
  
  console.log(console.error()
  );
  const theme = useTheme<CustomTheme>();
  const router = useRouter();
  if (!user || user.role !== UserRole.MANAGER) {
    router.push("/");
  }
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
        getRowId={(excess) => excess.productName}
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
        rows={sales}
        columns={SalesReportCols}
        getRowId={(sales) => sales.itemName}
        pageSize={100}
        rowsPerPageOptions={[10]}
        sx={{ height: "423px", marginLeft: 5, marginRight: 5, marginTop: 1 }}
      />

      <br />
      <h1
        style={{
          paddingLeft: 40,
          paddingTop: 30,
          color: theme.palette.primary.main,
        }}
      >
        Restock Report
      </h1>
      <DataGrid
        rows={restock}
        columns={RestockReportCols}
        getRowId={(restock) => restock.restockName}
        pageSize={100}
        rowsPerPageOptions={[10]}
        sx={{ height: "423px", marginLeft: 5, marginRight: 5, marginTop: 1 }}
      />

      <br />
      <h1
        style={{
          paddingLeft: 40,
          paddingTop: 30,
          color: theme.palette.primary.main,
        }}
      >
        Pair Analysis
      </h1>
      <DataGrid
        rows={pairs}
        columns={PairAnalysisCols}
        getRowId={(pairs) => pairs.pairName}
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
      ></h1>
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
