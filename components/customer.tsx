import Box from "@mui/material/Box";
import React from "react";
import { Menu, MenuCategory } from "../models/menu";
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
import store from "../models/store";
import { Subscription } from "rxjs";
import { IMenuItem, MenuItem } from "../models/menuItem";
import { Order } from "../models/order";
import { OrderItem } from "../models/orderItem";

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
          {category.menuItems.length} Items
        </Typography>
      </Grid>
    </Grid>
  );
}

function MenuCategories({ menu }: { menu: Menu }): JSX.Element {
  const theme = useTheme<CustomTheme>();

  return (
    <Paper sx={{ padding: theme.spacing(3), height: "100%" }}>
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "12px" }}>
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
  );
}

function MenuItems({ menu, order }: { menu: Menu; order: Order }): JSX.Element {
  const theme = useTheme<CustomTheme>();
  let activeCategory = _(menu.categories)
    .filter((c: MenuCategory) => c.active)
    .first();

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
                <Typography variant="subtitle1">{menuItem.price}</Typography>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

function Receipt({ order }: { order: Order }): JSX.Element {
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
            <Grid container item flexGrow={1} flex={3} direction="column">
              <Grid item>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.menuItem.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">x{item.quantity}</Typography>
              </Grid>
            </Grid>
            <Grid item flex={1}>
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
                ${order.subTotal.toFixed(2)}
              </Typography>
            </Box>

            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                Tax:
              </Typography>
            </Box>
            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                ${order.tax.toFixed(2)}
              </Typography>
            </Box>

            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                Total:
              </Typography>
            </Box>
            <Box gridColumn="span 6">
              <Typography variant="subtitle1" fontWeight="bold">
                ${order.orderTotal.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
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
          <Grid container direction="column" columnGap={2}>
            <Grid item>
              <MenuCategories menu={menu} />
            </Grid>
            <Grid item>
              <MenuItems menu={menu} order={order} />
            </Grid>
            {menu.configuringPizza ? (
              <Grid item>
                <ConfigurePizza menu={menu} order={order} />
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Receipt order={order} />
        </Grid>
        <Grid item container xs={12} spacing={2}>
          {menu.activeCategory()?.activeItem() ? (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  let menuItem =
                    menu.activeCategory()?.activeItem() || new MenuItem();

                  order.addItem(
                    new OrderItem({
                      menuItem: new MenuItem(menuItem),
                      orderId: -1,
                      menuItemId: menuItem.id,
                      quantity: 1,
                      isDrink: false,
                      products: [],
                      id: -1,
                    })
                  );

                  menu.resetSelections();
                  store.order.next(new Order(order));
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
                onClick={() => {}}
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
