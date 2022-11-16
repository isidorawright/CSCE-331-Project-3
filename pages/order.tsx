import Box from "@mui/material/Box";
import React from "react";
import { IMenu, IMenuCategory, Menu, MenuCategory } from "../models/menu";
import {
  Button,
  Card,
  Container,
  CustomTheme,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import _ from "lodash";
import { Dispatch, RootState } from "../models/store";
import { IMenuItem, MenuItem } from "../models/menuItem";
import { IOrder, Order } from "../models/order";
import { Money } from "../util/money";
import { useDispatch, useSelector } from "react-redux";

function MenuCategoryTile({
  category,
}: {
  category: IMenuCategory;
}): JSX.Element {
  const theme = useTheme<CustomTheme>();
  return (
    <Grid
      item
      sx={{
        backgroundColor: category.active ? theme.palette.primary.main : "white",
        border: `1px solid ${theme.palette.borderColor}`,
        color: category.active ? theme.palette.primary.contrastText : "black",
      }}
    >
      <Grid
        container
        sx={{ padding: theme.spacing(1), height: "100%" }}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <LocalPizzaIcon fontSize="small" />
        <Typography variant="subtitle1">{category.name}</Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {category.menuItems.length} Items
        </Typography>
      </Grid>
    </Grid>
  );
}

function MenuCategories(): JSX.Element {
  const theme = useTheme<CustomTheme>();
  const dispatch = useDispatch<Dispatch>();
  const menu = useSelector((state: RootState) => state.menu);

  return (
    <Paper sx={{ padding: theme.spacing(3), height: "100%" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "12px" }}>
        Categories
      </Typography>
      <Grid container spacing={2}>
        {menu.categories
          .filter((category) => category.menuItems.length)
          .map((category, index) => (
            <Grid item xs={12} sm={4} md={3} lg={2} key={index}>
              <Paper
                sx={{
                  width: "100%",
                  display: "inline-block",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => dispatch.menu.selectCategory(category)}
              >
                <MenuCategoryTile category={category} />
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
}

function MenuItems(): JSX.Element {
  const theme = useTheme<CustomTheme>();
  const menu = useSelector<RootState, IMenu>((state) => state.menu);
  const activeCategory = _(menu.categories)
    .filter((c: IMenuCategory) => Boolean(c.active))
    .first();
  const dispatch = useDispatch<Dispatch>();

  if (!activeCategory) return <></>;

  return (
    <Paper sx={{ padding: theme.spacing(3), height: "100%" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "12px" }}>
        Menu Items
      </Typography>

      <Grid container spacing={2}>
        {activeCategory.menuItems.map((menuItem: IMenuItem, index, items) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              sx={{
                padding: theme.spacing(2),
                border: `1px solid ${theme.palette.borderColor}`,
                background: menuItem.active
                  ? theme.palette.primary.main
                  : "white",
                color: menuItem.active
                  ? theme.palette.primary.contrastText
                  : "black",
                height: "100%",
                cursor: "pointer",
              }}
              onClick={() => dispatch.menu.selectItem(menuItem)}
            >
              <Grid container direction="column" justifyContent="center">
                <Typography variant="subtitle1" fontWeight="bold">
                  {menuItem.name}
                </Typography>
                <Typography variant="subtitle1">{menuItem.price}</Typography>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

function Receipt({ order }: { order: IOrder }): JSX.Element {
  const theme = useTheme<CustomTheme>();

  return (
    <Paper sx={{ padding: theme.spacing(3), width: "100%" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "12px" }}>
        Receipt
      </Typography>
      <Grid container spacing={2} direction="column">
        {order.orderItems.map((item, index) => (
          <Grid
            container
            item
            spacing={2}
            alignItems="center"
            wrap="nowrap"
            key={index}
          >
            <Grid container item direction="column">
              <Grid container item>
                <Grid item flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.menuItem.name}
                  </Typography>
                </Grid>

                <Grid item direction="column">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {Money.of(item.menuItem.price)
                      .mul(item.quantity)
                      .toString()}
                  </Typography>
                  <Typography variant="subtitle1">x{item.quantity}</Typography>
                </Grid>
              </Grid>
              {item.products.length ? (
                <Grid item sx={{ cursor: "pointer" }} xs={12}>
                  <ul>
                    {item.products.map((product) => {
                      return (
                        <li
                          key={product.id}
                          style={{ paddingLeft: theme.spacing(2) }}
                        >
                          <Typography variant="subtitle1">
                            - {product.productName}
                          </Typography>
                        </li>
                      );
                    })}
                  </ul>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        ))}
        <Grid item>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)">
            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                Subtotal:
              </Typography>
            </Box>
            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                {order.subTotal}
              </Typography>
            </Box>

            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                Tax:
              </Typography>
            </Box>
            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                {order.tax}
              </Typography>
            </Box>

            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                Total:
              </Typography>
            </Box>
            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                {order.orderTotal}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

function ConfigurePizza(): JSX.Element {
  const theme = useTheme<CustomTheme>();
  const dispatch = useDispatch<Dispatch>();
  const order = useSelector((state: RootState) => state.order);
  const menu = useSelector((state: RootState) => state.menu);

  const category = Menu.activeCategory(menu);

  if (!category) return <></>;

  const item = MenuCategory.activeItem(category);

  if (!item || !item.products.length) return <></>;

  return (
    <Paper sx={{ padding: theme.spacing(3), height: "100%" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "12px" }}>
        Add Toppings
      </Typography>
      <Grid container spacing={2}>
        {item.products.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                padding: theme.spacing(2),
                border: `1px solid ${theme.palette.borderColor}`,
                background: product.selected
                  ? theme.palette.primary.main
                  : "white",
                color: product.selected
                  ? theme.palette.primary.contrastText
                  : "black",
                cursor: "pointer",
              }}
              onClick={() => dispatch.menu.toggleMenuItemProduct(product)}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {product.productName}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export function CustomerOrder() {
  const theme = useTheme<CustomTheme>();
  const dispatch = useDispatch<Dispatch>();
  const menu = useSelector((state: RootState) => state.menu);
  const order = useSelector((state: RootState) => state.order);

  const activeCategory = Menu.activeCategory(menu);
  const activeItem = activeCategory
    ? MenuCategory.activeItem(activeCategory)
    : null;

  menu.configuringPizza = true;

  return (
    <Container maxWidth="lg" sx={{ paddingTop: theme.spacing(3), flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <MenuCategories />
            </Grid>
            <Grid item>
              <MenuItems />
            </Grid>
            {menu.configuringPizza ? (
              <Grid item>
                <ConfigurePizza />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Receipt order={order} />
        </Grid>
        <Grid item container xs={12} spacing={2}>
          {activeItem ? (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  dispatch.order.addItem(activeItem);
                  dispatch.menu.reset();
                }}
              >
                Add Item
              </Button>
            </Grid>
          ) : null}
          {order.orderItems.length ? (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  dispatch.menu.reset();
                  dispatch.order.reset();
                }}
              >
                Checkout
              </Button>
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
}

export default CustomerOrder;