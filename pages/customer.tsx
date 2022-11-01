import axios from "axios";
import React, { useEffect } from "react";
import { Menu, MenuCategory } from "../models/menu";
import { CollectionResponse } from "../models/response";
import Button from "@mui/material/Button";

export default function CustomerPage() {
  const [menu, setMenu] = React.useState<Menu>(new Menu());
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    axios
      .get<CollectionResponse<MenuCategory>>("/api/menu/categories")
      .then(({ data }) => {
        menu.categories = data.items;
        setMenu(menu);
        setLoading(false);
      })
      .catch((err) => {
        console.log("is server: ", typeof window === "undefined");
        console.log(err);
      });
  });

  return (
    <div>
      <h1>Customer Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        menu.categories.map((category) => {
          return (
            <div key={category.id}>
              <h2>{category.name}</h2>
            </div>
          );
        })
      )}
    </div>
  );
}
