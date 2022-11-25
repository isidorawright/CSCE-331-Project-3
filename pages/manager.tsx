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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { withIronSessionSsr } from "iron-session/next";
import { IUser, User, UserRole } from "../models/user";
import { InferGetServerSidePropsType } from "next";

//Inventory Table
const InventoryColumns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "productName", headerName: "Product Name", width: 130 },
  { field: "category", headerName: "Category", width: 130 },
  { field: "quantity", headerName: "Quantity", width: 100 },
];

const InventoryRows = [
  //mock data
  { id: 1, productName: "Pepperoni", category: "Topping", quantity: 100 },
  { id: 2, productName: "Cheese", category: "Cheese", quantity: 200 },
  { id: 3, productName: "Sauce", category: "Sauce", quantity: 400 },
  { id: 4, productName: "chicken", category: "Topping", quantity: 350 },
  { id: 5, productName: "drink", category: "Beverage", quantity: 420 },
  { id: 6, productName: "cookie", category: "other", quantity: 50 },
];

//Menu Item to Price Table
const MenuToPriceColumns: GridColDef[] = [
  { field: "id", headerName: "Menu Item ID", width: 70 },
  { field: "menuName", headerName: "Menu Item Name", width: 130 },
  { field: "price", headerName: "Price", width: 130 },
];

const MenuToPriceRows = [
  //mock data
  { id: 1, menuName: "Pepperoni Pizza", price: "$7.99" },
  { id: 2, menuName: "Fountain Drink", price: "$3.99" },
  { id: 3, menuName: "Cookie", price: "$2.99" },
];

//Shipment Table (collapsible)
function createData(
  shipmentId: number,
  shipmentDate: string,
  fulfilled: string
) {
  return {
    shipmentId,
    shipmentDate,
    fulfilled,
    history: [
      {
        productId: 1,
        productName: "Pepperoni",
        amount: 200,
      },
      {
        productId: 2,
        productName: "Cookie",
        amount: 150,
      },
      {
        productId: 3,
        productName: "Pumpkin",
        amount: 300,
      },
    ],
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.shipmentId}
        </TableCell>
        <TableCell align="right">{row.shipmentDate}</TableCell>
        <TableCell align="right">{row.fulfilled}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Product ID</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="right">Amount Bought</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.productId}>
                      <TableCell component="th" scope="row">
                        {historyRow.productId}
                      </TableCell>
                      <TableCell>{historyRow.productName}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData(1, "2022-10-04", "true"),
  createData(2, "2022-10-24", "false"),
  createData(3, "2022-11-06", "false"),
];

export default function DataTables({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!user || user.role !== UserRole.MANAGER) {
    return <h1>Unauthorized</h1>;
  }
  return (
    <div style={{ width: "100%" }}>
      <Head>
        <title>Spin &apos;N Stone | Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 style={{ paddingLeft: 40, paddingTop: 30 }}>Inventory Table</h1>
      <DataGrid
        rows={InventoryRows}
        columns={InventoryColumns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        sx={{ height: "400px", marginLeft: 5, marginRight: 5, marginTop: 1 }}
      />

      <br />
      <h1 style={{ paddingLeft: 40, paddingTop: 30 }}>
        Menu Table
      </h1>
      <DataGrid
        rows={MenuToPriceRows}
        columns={MenuToPriceColumns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        sx={{ height: "400px", marginLeft: 5, marginRight: 5, marginTop: 1 }}
      />

      <br></br>
      <h1 style={{ paddingLeft: 40, paddingTop: 30, paddingBottom: 10 }}>
        Shipment Table
      </h1>
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table
          aria-label="collapsible table"
          sx={{ height: "400px", width: "90%", margin: 5, marginTop: 2 }}
        >
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Shipment ID</TableCell>
              <TableCell align="right">Shipment Date</TableCell>
              <TableCell align="right">Fulfilled</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.shipmentId} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  function (context: { req: any; res: any; }) {
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
