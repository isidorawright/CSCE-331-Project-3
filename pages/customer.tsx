//import { Button } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import React, { useEffect } from "react";
import { api } from "../models/api";
import { Menu, MenuCategory } from "../models/menu";
import { useRouter } from "next/router";
import {
  Container,
  CustomTheme,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import _ from "lodash";

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
      <Box sx={{ padding: theme.spacing(1) }}>
        <LocalPizzaIcon fontSize="small" />
        <Typography variant="subtitle1">{category.name}</Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {category.menuItemCount} Items
        </Typography>
      </Box>
    </Grid>
  );
}

function MenuCategories({ menu }: { menu: Menu }): JSX.Element {
  const theme = useTheme<CustomTheme>();

  return (
    <Container maxWidth="lg">
      <Paper sx={{ padding: theme.spacing(3) }}>
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

function MenuItems({ menu }: { menu: Menu }): JSX.Element {
  const theme = useTheme<CustomTheme>();

  return (
    <Container maxWidth="lg">
      <Paper sx={{ padding: theme.spacing(3) }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ marginBottom: "12px" }}
        >
          Menu Items
        </Typography>

        <Grid container spacing={2}>
          {_(menu.categories)
            .filter((c) => c.active)
            .first()
            ?.menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Paper
                  sx={{
                    padding: theme.spacing(2),
                    border: `1px solid ${theme.palette.borderColor}`,
                    background: item.active
                      ? theme.palette.primary.main
                      : "white",
                    color: item.active
                      ? theme.palette.primary.contrastText
                      : "black",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Typography variant="subtitle1">${item.price}</Typography>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default function CustomerPage() {
  const [menu, setMenu] = React.useState<Menu>(Menu.empty());
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    api
      .getMenu()
      .then((menu) => {
        setMenu(menu);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const router = useRouter();

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="container" style={{ paddingTop: 24 }}>
            <Grid direction="column" container rowGap={2}>
              <MenuCategories menu={menu} />
              <MenuItems menu={menu} />
            </Grid>
          </div>
        </>
      )}
    </div>
  );
}
