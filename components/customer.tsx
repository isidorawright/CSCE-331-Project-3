import Box from "@mui/material/Box";
import React from "react";
import { Menu, MenuCategory } from "../models/menu";
import {
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
import store from "../models/store";
import { Subscription } from "rxjs";
import { IMenuItem, MenuItem } from "../models/menuItem";
import { Order } from "../models/order";

function MenuCategoryTile({
  category,
}: {
  category: MenuCategory;
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
        sx={{ padding: theme.spacing(1), height: "100%" }}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <LocalPizzaIcon fontSize="small" />
        <Typography variant="subtitle1">{category.name}</Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {category.menuItemCount} Items
        </Typography>
      </Grid>
    </Grid>
  );
}

function MenuCategories({ menu }: { menu: Menu }): JSX.Element {
  const theme = useTheme<CustomTheme>();

  return (
    <Container maxWidth="lg">
      <Paper sx={{ padding: theme.spacing(3), height: "100%" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ marginBottom: "12px" }}
        >
          Categories
        </Typography>
        <Grid container spacing={2}>
          {menu.categories.map((category) => (
            <Grid item xs={12} sm={4} md={3} lg={2} key={category.id}>
              <Paper
                sx={{
                  width: "100%",
                  display: "inline-block",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  let activeCategory = menu.activeCategory();
                  if (activeCategory) {
                    activeCategory.active = false;
                  }
                  category.active = true;
                  store.menu.next(new Menu(menu));
                }}
              >
                <MenuCategoryTile category={category} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

function MenuItems({ menu, order }: { menu: Menu; order: Order }): JSX.Element {
  const theme = useTheme<CustomTheme>();

  return (
    <Container maxWidth="lg" sx={{ height: "100%" }}>
      <Paper sx={{ padding: theme.spacing(3), height: "100%" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ marginBottom: "12px" }}
        >
          Menu Items
        </Typography>

        <Grid container spacing={2}>
          {_(menu.categories)
            .filter((c: MenuCategory) => c.active)
            .first()
            ?.menuItems.map((menuItem: IMenuItem, _, items) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
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
                  onClick={() => {
                    items.forEach((i) => (i.active = false));
                    menuItem.active = true;

                    store.menu.next(new Menu(menu));
                  }}
                >
                  <Grid container direction="column" justifyContent="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {menuItem.name}
                    </Typography>
                    <Typography variant="subtitle1">
                      ${menuItem.price}
                    </Typography>
                  </Grid>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Paper>
    </Container>
  );
}

function Receipt({ order }: { order: Order }): JSX.Element {
  const theme = useTheme<CustomTheme>();

  return (
    <Container maxWidth="lg" sx={{ width: "100%" }}>
      <Paper sx={{ padding: theme.spacing(3) }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ marginBottom: "12px" }}
        >
          Receipt
        </Typography>
        <Grid container spacing={2} direction="column">
          {order.orderItems.map((item) => (
            <Grid container spacing={2} alignItems="center">
              <Grid container item flexGrow={1} direction="column">
                <Grid item>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.menuItem.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">x{item.quantity}</Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${item.menuItem.price * item.quantity}
                </Typography>
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
                  ${order.subTotal}
                </Typography>
              </Box>

              <Box gridColumn="span 6">
                <Typography variant="subtitle1" fontWeight="bold">
                  Tax:
                </Typography>
              </Box>
              <Box gridColumn="span 6">
                <Typography variant="subtitle1" fontWeight="bold">
                  ${order.tax}
                </Typography>
              </Box>

              <Box gridColumn="span 6">
                <Typography variant="subtitle1" fontWeight="bold">
                  Total:
                </Typography>
              </Box>
              <Box gridColumn="span 6">
                <Typography variant="subtitle1" fontWeight="bold">
                  ${order.orderTotal}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

function ConfigurePizza({
  menu,
  order,
}: {
  menu: Menu;
  order: Order;
}): JSX.Element {
  const theme = useTheme<CustomTheme>();

  const category = menu.activeCategory();
  const item = category?.activeItem();

  if (!item) return <></>;

  return (
    <Container maxWidth="lg">
      <Paper sx={{ padding: theme.spacing(3), height: "100%" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ marginBottom: "12px" }}
        >
          Add Toppings
        </Typography>
        <Grid container spacing={2}>
          {item.products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
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
                }}
                onClick={() => {
                  product.selected = !product.selected;
                  store.menu.next(menu);
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.productName}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

var menuSub: Subscription;
var orderSub: Subscription;

export function CustomerOrder() {
  const [menu, setMenu] = React.useState<Menu>(store.menu.value);
  const [order, setOrder] = React.useState<Order>(store.order.value);
  const theme = useTheme<CustomTheme>();

  React.useEffect(() => {
    menuSub =
      menuSub || store.menu.subscribe((menu) => setMenu(new Menu(menu)));
    orderSub =
      orderSub || store.order.subscribe((order) => setOrder(new Order(order)));
  });

  menu.configuringPizza = true;

  return (
    <Container maxWidth="lg" sx={{ paddingTop: theme.spacing(3), flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <MenuCategories menu={menu} />
            </Grid>
            <Grid item>
              <MenuItems menu={menu} order={order} />
            </Grid>
            <Grid item>
              {menu.configuringPizza && (
                <ConfigurePizza menu={menu} order={order} />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} md={4}>
          <Receipt order={order} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default CustomerOrder;
