//import { Button } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import React, { useEffect } from "react";
import { api } from "../models/api";
import { Menu } from "../models/menu";
import { useRouter } from "next/router";

const pages: { [key: string]: string } = {
  Pizza: "/pizza",
  Beverage: "/beverage",
  Other: "/other",
};

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
      <h1>Customer Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        menu.categories.map((category) => {
          return (
            <div key={category.id}>
              <h2>
                  {category.name}
              </h2>
            </div>
          );
        })
      )}
    </div>
  );
}
