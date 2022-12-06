import { Client, Pool } from "pg";

/**
 * This class contains the information related to the database and the connection to the website
 */
class Database extends Pool {
  connected: boolean = false;
  constructor() {
    super({
      user: "csce331_904_kevin",
      host: "csce-315-db.engr.tamu.edu",
      database: "csce331_904_52",
      password: "friendlyalpaca",
      port: 5432,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
}

export const database = new Database();

export default database;
