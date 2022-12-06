import * as React from "react";
import {useEffect, useState} from 'react';
import {
  DataGrid,
  getDataGridUtilityClass,
  GridColDef,
  GridRowModel,
  useGridApiRef,
} from "@mui/x-data-grid";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../models/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faXmark, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { IShipment, Shipment } from "../models/shipment";
import { api } from "../models/api";
import {MenuItem, IMenuItem} from "../models/menuItem";
import {Product, IProduct} from "../models/product";
import {Dispatch} from "../models/store";
import { InputLabel } from "@mui/material";
import { TextField } from "@mui/material";

//Inventory Table
const InventoryColumns: GridColDef[] = [
  { field: "productName", headerName: "Product Name", width: 200 },
  { field: "productType", headerName: "Product Type", width: 150 },
  {
    field: "quantityInStock",
    headerName: "Quantity",
    width: 100,
    align: "right",
    headerAlign: "right",
    editable: true,
  },
];

//Menu Item to Price Table
const MenuToPriceColumns: GridColDef[] = [
  { field: "name",
    headerName: "Menu Item",
    width: 200,
    editable: true,
  },
  {
    field: "price",
    headerName: "Price",
    width: 75,
    align: "right",
    headerAlign: "right",
    editable: true,
  },
];


  

// Order Table
const OrderColumns: GridColDef[] = [
  { field: "orderDate", headerName: "Order Date", width: 125 },
  {
    field: "orderTotal",
    headerName: "Order Total",
    width: 125,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "totalItems",
    headerName: "Items in Order",
    width: 150,
    align: "right",
    headerAlign: "right",
  },
];

function Row(props: { row: ReturnType<typeof Shipment> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [fulfilled, setFulfilled] = React.useState(row.fulfilled);
  const checkmark = <FontAwesomeIcon icon={faCircleCheck} size="1x" />;
  const xmark = <FontAwesomeIcon icon={faXmark} size="1x" />; 
  

  let fulfill = (row : IShipment) => {
    api.shipment.updateShipment(row.shipmentId, row.shipmentDate, !row.fulfilled);
    row.fulfilled = !row.fulfilled;
    setFulfilled(row.fulfilled);
  }

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
        <TableCell align="right">
          {row.shipmentDate.toString().substring(0, 10)}
        </TableCell>
        <TableCell>
          <IconButton 
            aria-label="fulfilled indicator"
            onClick={() => fulfill(row)}
          >
            {row.fulfilled ? checkmark : xmark} 
          </IconButton>
        </TableCell>
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
                  {row.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.productName}</TableCell>
                      <TableCell
                        align="right"
                        contentEditable="true"
                        onBlur={event => 
                          {
                            api.shipment.updateProduct(row.shipmentId, product.id, Number(event.currentTarget.innerHTML));
                          }
                        }
                      >
                        {product.quantityInStock}
                      </TableCell>
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

export default function DataTables({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const inventory = useSelector((state: RootState) => state.manager.inventory);
  const menuItems = useSelector((state: RootState) => state.manager.menuItems);
  const orders = useSelector((state: RootState) => state.manager.orders);
  const shipments = useSelector((state: RootState) => state.manager.shipments);
  const theme = useTheme<CustomTheme>();
  const router = useRouter();
  
  const apiRef = useGridApiRef();
  
  const dispatch = useDispatch<Dispatch>();
  const addMenuRow = () => {
    // Add blank row to DB and refresh?
    const name = (document.getElementById("outlined-basic item_name") as HTMLInputElement)?.value
    const cost = (document.getElementById("outlined-basic cost") as HTMLInputElement)?.value
    api.menu.createMenuItem(name, cost);
    dispatch.manager.fetch();
  }

  const addInventoryRow = () => {
    // Add blank row to DB and refresh?
    const name = (document.getElementById("outlined-basic product_name") as HTMLInputElement)?.value
    const type = (document.getElementById("outlined-basic product_type") as HTMLInputElement)?.value
    const quantity = (document.getElementById("outlined-basic quantity") as HTMLInputElement)?.value
    console.log(name, quantity);
    api.product.insert(name, type, quantity);

    dispatch.manager.fetch();
  }

  const processRowUpdateMenu = (newRow : GridRowModel) => {
    api.menu.updateMenuItemPrice(newRow.name, newRow.price);
    return newRow;
  }

  const processRowUpdateInventory = (newRow : GridRowModel) => {
    api.product.updateQuantity(newRow.productName, newRow.quantityInStock);
    dispatch.manager.fetch();
    return newRow;
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
        processRowUpdate={processRowUpdateInventory}
        experimentalFeatures={{ newEditingApi: true }}
        pageSize={100}
        rowsPerPageOptions={[Infinity]}
        sx={{ height: "420px", marginLeft: 5, marginRight: 5, marginTop: 1 }}
      />

      <div
        style={{marginTop: 10, paddingLeft: 40, paddingTop: 10, color: theme.palette.primary.main, marginRight:20}}
      >
        <TextField id="outlined-basic product_name" label="Product Name" sx={{paddingRight: 2}}/>
        <TextField id="outlined-basic product_type" label="Product Type" sx={{paddingRight: 2}}/>
        <TextField id="outlined-basic quantity" label="Quantity"/>
        <div style={{display: "inline-block", marginLeft:20, marginTop:10}}>
          <IconButton 
            aria-label="add row"
            size="small"
            onClick={() => {
                addInventoryRow();
                window.location.reload();
              }
            }
          >
            {<FontAwesomeIcon icon={faPlusCircle} size="xl"/>}
            <div  style={{marginLeft:20, fontSize:15}}>Add New Product</div>
          </IconButton>
        </div>
      </div>

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
        processRowUpdate={processRowUpdateMenu}
        experimentalFeatures={{ newEditingApi: true }}
        pageSize={100}
        rowsPerPageOptions={[10]}
        sx={{ height: "423px", marginLeft: 5, marginRight: 5, marginTop: 1 }}
      />

      <div
        style={{marginTop: 10, paddingLeft: 40, paddingTop: 10, color: theme.palette.primary.main, marginRight:20}}
      >
        <TextField id="outlined-basic item_name" label="Item Name" sx={{paddingRight: 2}}/>
        <TextField id="outlined-basic cost" label="Price ($)"/>
        <div style={{display: "inline-block", marginLeft:20, marginTop:10}}>
          <IconButton 
            aria-label="add row"
            size="small"
            onClick={() => {
              addMenuRow();
              window.location.reload();
            }
          }
          >
            {<FontAwesomeIcon icon={faPlusCircle} size="xl"/>}
            <div  style={{marginLeft:20, fontSize:15}}>Add New Item</div>
          </IconButton>
        </div>
      </div>

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
          sx={{ height: "100px", width: "90%", margin: 5, marginTop: 2 }}
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
            {shipments.map((shipments) => (
              <Row key={shipments.shipmentId} row={shipments} />
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
    const user: IUser = req.session.user;


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
