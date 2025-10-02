CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT NOW()
);
-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    technician VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Invoices (before invoice_line_items and payments)
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'UNPAID',
    created_at TIMESTAMP DEFAULT NOW()
);
-- Invoice Line Items
CREATE TABLE IF NOT EXISTS invoice_line_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT NOW()
);
-- -------------------------------
-- Seed Data
-- -------------------------------
-- Customers
INSERT INTO customers (name, phone, email, address)
VALUES (
        'John Doe',
        '+123456789',
        'john@example.com',
        '123 Main St'
    ),
    (
        'Jane Smith',
        '+987654321',
        'jane@example.com',
        '456 Elm St'
    );
-- Jobs
INSERT INTO jobs (customer_id, title, description, status)
VALUES (1, 'Install AC', 'Install a new AC unit', 'New'),
    (2, 'Repair Heater', 'Fix heating issue', 'New');
-- Appointments
INSERT INTO appointments (job_id, technician, start_time, end_time)
VALUES (
        1,
        'Mike Smith',
        '2025-10-03 10:00:00',
        '2025-10-03 12:00:00'
    ),
    (
        2,
        'Sara Johnson',
        '2025-10-04 14:00:00',
        '2025-10-04 16:00:00'
    );
-- Invoices
INSERT INTO invoices (
        job_id,
        subtotal,
        tax,
        total_amount,
        paid_amount,
        status
    )
VALUES (1, 400, 100, 500, 300, 'UNPAID'),
    (2, 200, 50, 250, 0, 'UNPAID');
-- Invoice Line Items
INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price)
VALUES (1, 'AC Unit', 1, 400),
    (2, 'Heater Repair', 1, 200);
-- Payments
INSERT INTO payments (invoice_id, amount, payment_date)
VALUES (1, 200, '2025-10-02 11:00:00'),
    (1, 100, '2025-10-02 14:00:00');