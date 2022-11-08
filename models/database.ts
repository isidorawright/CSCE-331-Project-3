import { Client } from "pg";

class Database extends Client {
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
  async connect() {
    if (this.connected) {
      return;
    }
    await super.connect();

    this.connected = true;
  }
  async disconnect() {
    if (!this.connected) {
      return;
    }
    await this.end();
    this.connected = false;
  }
  async query(queryStream: any) {
    await this.connect();
    return await super.query(queryStream);
  }
}

export const database = new Database();

export default database;
