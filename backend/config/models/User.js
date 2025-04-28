const pool = require('../config/db');

class User {
  static async findByUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  static async create(userData) {
    const { username, password, firstName, lastName, birthYear, groupName, role } = userData;
    const { rows } = await pool.query(
      'INSERT INTO users (username, password, first_name, last_name, birth_year, group_name, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [username, password, firstName, lastName, birthYear, groupName, role]
    );
    return rows[0];
  }

  static async getAllStudents() {
    const { rows } = await pool.query('SELECT * FROM users WHERE role = $1', ['student']);
    return rows;
  }
}