# Smart LINE Admin Panel

## Admin Access

### Login Credentials
Use the main login page to access admin panel:
- **URL**: `http://localhost:3000/login`
- **Email**: `admin@gmail.com`
- **Password**: `smartline2025`

**⚠️ IMPORTANT:** The admin credentials need to be created in MongoDB database first.

#### To Create Admin User in Database:
1. Ensure MongoDB Atlas is connected (check Network Access whitelist)
2. Run the admin creation script:
   ```
   cd server
   node createAdmin.js
   ```
3. This will create the admin user with role 'admin' in the database
4. Then you can login with the credentials above

After logging in with admin credentials, you'll be automatically redirected to the admin dashboard.

## Features

### Admin Dashboard
Once logged in, you can access the full admin dashboard at `/admin/dashboard`

#### Dashboard Features:
1. **Statistics Overview**
   - Total Orders
   - Pending Orders
   - Delivered Orders
   - Total Revenue

2. **Order Management**
   - View all orders in a table format
   - Filter orders by status (All, Pending, Confirmed, Processing, Shipped, Delivered, Cancelled)
   - View detailed order information
   - Update order status
   - Delete orders

3. **Order Details**
   Click "View" on any order to see:
   - Customer Information (Name, Phone, Email, Address, City, Postal Code, Notes)
   - Order Items (Product images, names, quantities, prices)
   - Total Amount
   - Order Status with ability to update
   - Order Date and Time

#### Order Statuses:
- **Pending**: New order received
- **Confirmed**: Order confirmed by admin
- **Processing**: Order is being prepared
- **Shipped**: Order has been shipped
- **Delivered**: Order delivered to customer
- **Cancelled**: Order cancelled

## How It Works

### Customer Orders
1. Customer adds products to cart
2. Fills checkout form with delivery details
3. Clicks "Place Order via WhatsApp"
4. Order is saved to database
5. WhatsApp message sent to business number with order details

### Admin Order Management
1. Admin goes to main login page at `/login`
2. Enters admin credentials (admin@gmail.com / smartline2025)
3. Automatically redirected to admin dashboard
4. Views all orders on dashboard
5. Can filter orders by status
6. Click "View" to see full order details
7. Update order status as order progresses
8. Delete orders if needed
9. Logout returns to main login page

## Security Note
⚠️ **For Production Use**: Replace the hardcoded admin credentials with proper authentication using JWT tokens and encrypted passwords in a real production environment.

## API Endpoints Used

- `POST /api/orders` - Create new order (used by checkout)
- `GET /api/orders` - Get all orders (admin dashboard)
- `GET /api/orders/:id` - Get single order details
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order
