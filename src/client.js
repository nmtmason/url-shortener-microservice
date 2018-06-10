const { Client: PGClient } = require('pg');

class Client {
  constructor(connectionString) {
    this.client = new PGClient({
      connectionString
    });
  }

  connect() {
    return this.client.connect();
  }

  async query(str, params) {
    let { rows } = await this.client.query(str, params);
    return rows;
  }

  async first(str, params) {
    let [first] = await this.query(str, params);
    return first;
  }
}

module.exports = { Client };
