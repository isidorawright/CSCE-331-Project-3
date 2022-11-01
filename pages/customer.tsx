import axios from "axios";
import React, { useEffect } from "react";
import { api } from "../models/api";
import { Menu } from "../models/menu";

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
