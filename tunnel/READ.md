usage:

```
import { tunnel } from "https://raw.githubusercontent.com/kei0425/deno-lib/main/tunnel/mod.ts";

tunnel(
    "remote host",
    "localhost",
    5432,
    async (localPort) => {
        const options = {
            user: "username",
            database: "database",
            password: "password",
            hostname: "localhost",
            port: localPort,
        }
        const client = new Client(options);
        console.log(`connecting ${JSON.stringify(options)}`);
        await client.connect();
        console.log("connected");

        const query = 'select * from table_name;'

        const object_result = await client.queryObject(query);
        console.log(object_result.rows);

        await client.end();
    });
```
