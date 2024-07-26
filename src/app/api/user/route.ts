import { Client } from 'pg';
import dotenv from 'dotenv';
const bcrypt = require('bcrypt');

dotenv.config();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
export async function GET() {
  try {
        const result = await client.query('SELECT * FROM db_users');
        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
  } catch (error) {
    
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
  }
}

export async function POST(req: Request) {
    try {
    const { firstname, lastname, username, password } = await req.json();
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const res = await client.query('INSERT INTO db_users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) RETURNING *', [firstname, lastname, username, hashedPassword]);
    return new Response(JSON.stringify(res.rows[0]), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
    });
    } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
    });
    }
    }
//-------------------------------------------------------------------------------------
export async function PUT(req: Request) {
    try {
    const { id, firstname, lastname, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await client.query('UPDATE db_users SET firstname = $1, lastname = $2, password = $4 WHERE id = $3 RETURNING *', [firstname, lastname, id, hashedPassword]);
    if (res.rows.length === 0) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
    });
    }
    return new Response(JSON.stringify(res.rows[0]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    });
    } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
    });
    }
    }
//-------------------------------------------------------------------------------------
export async function DELETE(req: Request) {
    try {
    const { id } = await req.json();
    const res = await client.query('DELETE FROM db_users WHERE id = $1 RETURNING *', [id]);
    if (res.rows.length === 0) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
    });
    }
    return new Response(JSON.stringify(res.rows[0]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    });
    } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
    });
    }
    }