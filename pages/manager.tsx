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
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../models/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

//Inventory Table
const InventoryColumns: GridColDef[] = [
  { field: "productName", headerName: "Product Name", width: 200 },
  { field: "productType", headerName: "Product Type", width: 150 },
  { field: "quantityInStock", headerName: "Quantity", width: 100, align: "right", headerAlign: "right" }
];

//Menu Item to Price Table
const MenuToPriceColumns: GridColDef[] = [
  { field: "name", headerName: "Menu Item", width: 200 },
  { field: "price", headerName: "Price", width: 75, align: "right", headerAlign: "right" }
];

// Order Table
const OrderColumns: GridColDef[] = [
  { field: "orderDate", headerName: "Order Date", width: 125 },
  { field: "orderTotal", headerName: "Order Total", width: 125, align: "right", headerAlign: "right"  },
  { field: "totalItems", headerName: "Items in Order", width: 150, align: "right", headerAlign: "right" }
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
  const checkmark = <FontAwesomeIcon icon={faCircleCheck} size="xl" />;
  const xmark = <FontAwesomeIcon icon={faXmark} size="xl" />;

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
        <TableCell>{row.fulfilled == "true" ? checkmark : xmark}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{ marginLeft: 2, marginRight: -2, padding: 1 }}
              component={Paper}
            >
              <Typography variant="h6" gutterBottom component={Paper}>
                Shipment Details
              </Typography>
              <Table size="small" aria-label="purchases" component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell align="right">Amount Ordered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.productId}>
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
  const inventory = useSelector((state: RootState) => state.manager.inventory);
  const menuItems = useSelector((state: RootState) => state.manager.menuItems);
  const orders = useSelector((state: RootState) => state.manager.orders);
  const theme = useTheme<CustomTheme>();
  const router = useRouter();
  if (!user || user.role !== UserRole.MANAGER) {
    router.push("/");
  }
  return (
    <div style={{ width: "100%" }}>
      <Head>
        <title>Spin &apos;N Stone | Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1
        style={{
          paddingLeft: 40,
          paddingTop: 30,
          color: theme.palette.primary.main,
        }}
      >
        Inventory
      </h1>
      <DataGrid
        rows={inventory}
        columns={InventoryColumns}
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
        Menu
      </h1>
      <DataGrid
        rows={menuItems}
        columns={MenuToPriceColumns}
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
        Orders
      </h1>
      <DataGrid
        rows={orders}
        columns={OrderColumns}
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
        Shipments
      </h1>
      <TableContainer sx={{ marginBottom: 3 }}>
        <Table
          aria-label="collapsible table"
          sx={{ height: "200px", width: "94%", marginLeft: 5, marginRight: 5, marginTop: 1 }}
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
