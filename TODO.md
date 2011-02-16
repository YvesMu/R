<!-- markdownlint-disable MD033 -->

# TODO

## Database

### Implementation

- [x] `users` table
- [ ] `addresses` table
- [ ] `products` table
- [ ] `categories` table
- [ ] `transactions` table
- [ ] `orders` table
- [ ] `orderlines` table
- [ ] `invoices` table
- [ ] `deliveries` table

### Schema

Finish the database schema.

**Every** table has has the following columns :

```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
);
```

<details>
<summary><i></i>
  <code>USER</code> table
</summary>

```sql
CREATE TABLE users (
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) NOT NULL UNIQUE,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  role VARCHAR(255) DEFAULT 'ROLE_USER',
);
```

</details>

<details>
<summary>
  <code>ADDRESS</code> table
</summary>

```sql
CREATE TABLE addresses (
  user_id UUID REFERENCES users(id),
  address VARCHAR(255) NOT NULL,
  town VARCHAR(255),
  zip VARCHAR(255),
  country VARCHAR(255),
  phone VARCHAR(255),
);
```

</details>

<details>
<summary>
  <code>PRODUCT</code> table
</summary>

```sql
CREATE TABLE products (
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  stock_real INTEGER,
  stock_virtual INTEGER,
  image VARCHAR(255),
  alert INTEGER,
  status INTEGER DEFAULT 0,
);
```

</details>

<details>
<summary><i></i>
  <code>CATEGORY</code> table
</summary>

```sql
CREATE TABLE categories (
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  status INTEGER DEFAULT 0,
);
```

</details>

<details>
<summary>
  <code>TRANSACTION</code> table
</summary>

```sql
CREATE TABLE transactions (
  user_id UUID REFERENCES users(id),
  total_price DECIMAL(10, 2),
  status INTEGER DEFAULT 0,
);
```

</details>

<details>
<summary>
  <code>ORDER</code> table
</summary>

```sql
CREATE TABLE orders (
  user_id UUID REFERENCES users(id),
  status INTEGER DEFAULT 0,
);
```

</details>

<details>
<summary>
  <code>ORDERLINE</code> table
</summary>

```sql
CREATE TABLE orderlines (
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
);
```

</details>

<details>
<summary>
  <code>INVOICE</code> table
</summary>

```sql
CREATE TABLE invoices (
  order_id INTEGER REFERENCES orders(id),
  transaction_id UUID REFERENCES transactions(id),
  type INTEGER DEFAULT,
  status INTEGER DEFAULT 0,
);
```

</details>

<details>
<summary>
  <code>DELIVERY</code> table
</summary>

```sql
CREATE TABLE deliveries (
  code VARCHAR(255),
  order_id INTEGER REFERENCES orders(id),
  address_id INTEGER REFERENCES addresses(id),
  status INTEGER DEFAULT 0,
);
```

</details>

<style>
  summary {
    cursor: pointer;
  }
  summary:hover, summary:focus {
    background-color: #ddd;
    color: #333;
  }
  summary:not(:has(>i)) {
    font-weight: bold;
  }
  summary > i::before {
    content: '✅';
    font-style: normal;
  }
  i.wip::before {
    content: '🚧';
  }
</style>
