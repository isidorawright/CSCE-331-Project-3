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
import styled from "@emotion/styled";
import LocalPizzaIcon from "@mui/icons-material/LocalPizza";
import css from "styled-jsx/css";

const pages: { [key: string]: string } = {
  Pizza: "/pizza",
  Beverage: "/beverage",
  Other: "/other",
};

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
        backgroundColor: category.active ? theme.palette.success.main : "white",
        border: `1px solid ${theme.palette.borderColor}`,
        color: category.active ? theme.palette.success.contrastText : "black",
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

        {menu.categories.map((category) => (
          <Box
            sx={{
              width: "100px",
              display: "inline-block",
              marginRight: "10px",
            }}
          >
            <MenuCategoryTile category={category} />
          </Box>
        ))}
      </Paper>
    </Container>
  );
}

export default function CustomerPage() {
  const [menu, setMenu] = React.useState<Menu>(Menu.empty());
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    api
      .getMenuCategories()
      .then((categories) => {
        menu.categories = categories;
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
            <MenuCategories menu={menu} />
          </div>
        </>
      )}
    </div>
  );
}
