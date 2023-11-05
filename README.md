# B2B-Backend

## API Endpoints
<p>The following API endpoints are available:</p>
<ul>
    <li>POST <bold>/user/register</bold></li>
    <li>POST <bold>/user/login</bold></li>
    <li>GET <bold>/user/profile</bold></li>
    <li>PUT <bold>/user/profile</bold></li>
    <br>
    <li>GET <bold>/products/category</bold></li>
    <li>GET <bold>/products/:productId</bold></li>
    <li>PUT <bold>/products/:productId</bold></li>
    <li>DELETE <bold>/products/:productId</bold></li>
    <li>POST <bold>/products/upload</bold></li>
    <br>
    <li>POST <bold>/orders/order</bold></li>
    <li>GET <bold>/orders/order_ids</bold></li>
    <li>GET <bold>/orders/:orderId</bold></li>
    <li>PUT <bold>/orders/:orderId/status</bold></li>
    <li>PUT <bold>/orders/:orderId/cancel</bold></li>
    <li>POST <bold>/orders/:orderId/shipping_details</bold></li>
    <li>GET <bold>/orders/:orderId/shipping_details</bold></li>
    <li>PUT <bold>/orders/update_address</bold></li>
</ul>

## JsonWebToken Header Formatting

```json
{
    "token": "jwt-token"
}
```

## Response and Request Body Formatting

<ol>
<li>POST <bold>/user/register</bold></li>
<ul>

<li>Request for Buyer type Account</li>

```json
{
    "fullname": "user full name",
    "email": "user@gmail.com",
    "account_type": "buyer",
    "mobile_number": "0123456789",
    "password": "user password",
}
```

<li>Request for Seller or Both type Account</li>

```json
{
    "fullname": "user full name",
    "email": "user@gmail.com",
    "account_type": "buyer",
    "mobile_number": "0123456789",
    "password": "user password",
    "company_name": "xyz",
    "bussiness_type": "abc",
    "gst_number": "0000000000"
}
```

<li>Response</li>

```json
{
    "success": true,
    "token": "user token"
}
```
</ul>

<li>POST <bold>/user/login</bold></li>

<ul>

<li>Request</li>

```json
{
    "mobile_number": "0123456789",
    "password": "user password"
}
```

<li>Response</li>

```json
{
    "success": true,
    "token": "user token"
}
```

</ul>

<li>GET <bold>/user/profile</bold></li>

<ul>

<li>Response for Buyer type account</li>

```json
{
    "success": true,
    "full_name": "user full name",
    "email": "user email",
    "mobile_number": "user mobile number"
}
```

<li>Response for Seller and Both type account</li>

```json
{
    "success": true,
    "full_name": "user full name",
    "email": "user email",
    "mobile_number": "user mobile number",
    "unique_id": "unique 6 digit id",
    "company_name": "xyz",
    "gst_number": "0000000000",
    "kyc_isverified": [true, false],
    "bussiness_type": "abc"
}
```

</ul>

<li>PUT <bold>/user/profile</bold></li>

<ul>

<li>Request</li>

```json
{
    "full_name": " new full name optional",
    "email": "new user email optional",
    "mobile_number": "new mobile number optional"
}
```

<li>Response</li>

```json
{
    "success": true,
    "token": "updated user token"
}
```

</ul>
<br><br>
<li>GET <bold>/products/category</bold></li>

<ul>

<li>Request</li>

```url
/q?catagory=requested_category
```
<li>Response</li>

```json
{
    "success": true,
    "Products": [
        {
            "product_name": "product1 name",
            "about": "information about product1",
            "quantity": 0,
            "price": 1.00,
            "product_image_url": ["/urls_of_product_image"],
            "product_catalogue_url": ["/url_of_product_catalogue"]
        },
        ...
    ]
}
```

</ul>

<li>GET <bold>/products/:productId</bold></li>
<ul>

<li>Response</li>

```json
{
    "product_name": "product name",
    "about": "information about product",
    "quantity": 0,
    "price": 1.00,
    "product_image_url": ["/urls_of_product_image"],
    "product_catalogue_url": ["/url_of_product_catalogue"]
}
```

</ul>

<li>PUT <bold>/products/:productId</bold></li>

<ul>

<li>Request</li>

```json
{
    "product_name": " new product name optional",
    "about": "new about product optional",
    "quantity": "new quantity optional",
    "price": "new price optional",
    "category_type": "new category type optional"
}
```

<li>Response</li>

```json
{
    "success": true,
    "content": "Product updated successfully"
}
```

</ul>

<li>DELETE <bold>/products/:productId</bold></li>

<ul>
<li>Response</li>

```json
{
    "success": true,
    "content": "Product deleted successfully"
}
```

</ul>

<li>POST <bold>/products/upload</bold></li>

<ul>

<li>Request</li>

```json
{
    "product_name": "product name",
    "about": "information about product",
    "quantity": 0,
    "price": 1.00,
    "category_type": [
        "agri products & equipments",
        "apparel and fashion",
        "architects & interior designing",
        "automobile parts & spares",
        "chemicals,dyes & solvents",
        "construction & real estate",
        "consumer electronics",
        "electricals & electronics",
        "energy and power"
    ],
    "product_image": ["product images upto 5"],
    "product_catalogue": "product catalogue in format of pdf"
}
```
<li>Response</li>

```json
{
    "success": true,
    "product_id": "product id"
}
```
</ul>

<li>POST <bold>/orders/order</bold></li>

<ul>

<li>Request</li>

```json
{
    "total_amount": 1.00,
    "product_id": "product id",
    "quantity": 1
}
```
<li>Response</li>

```json
{
    "success": true,
    "order_id": "order id"
}
```
</ul>

<li>GET <bold>/orders/order_ids</bold></li>

<ul>

<li>Response</li>

```json
{
    "success": true,
    "orders_id": ["order1 id", "order2 id", ...]
}
```
</ul>

<li>GET <bold>/orders/:orderId</bold></li>

<ul>

<li>Response</li>

```json
{
    "success": true,
    "order_date": "date of order",
    "total_amount": 1.00,
    "status": enum ["pending", "shipped", "delivered", "cancelled"],
    "quantity": 1,
    "product_id": "product id"
}
```
</ul>

<li>PUT <bold>/orders/:orderId/status</bold></li>

<ul>

<li>Request</li>

```json
{
    "new_status": enum ["pending", "shipped", "delivered", "cancelled"]
}
```
<li>Response</li>

```json
{
    "success": true,
    "content": "Order status updated successfully"
}
```
</ul>

<li>PUT <bold>/orders/:orderId/cancel</bold></li>

<ul>

<li>Response</li>

```json
{
    "success": true,
    "content": "Order has been canceled successfully"
}
```
</ul>

<li>POST <bold>/orders/:orderId/shipping_details</bold></li>

<ul>

<li>Request</li>

```json
{
    "country": "user country",
    "state": "user state",
    "city": "user city",
    "postal_code": "user postal code",
    "street_address": "user street address"
}
```
<li>Response</li>

```json
{
    "success": true,
    "content": "Shipping details created for order",
    "order_id": "order id"
}
```
</ul>

<li>GET <bold>/orders/:orderId/shipping_details</bold></li>

<ul>

<li>Response</li>

```json
{
    "success": true,
    "content": "Featched shipping data",
    "country": "user country",
    "state": "user state",
    "city": "user city",
    "postal_code": "user postal code",
    "street_address": "user street address"
}
```
</ul>

<li>PUT <bold>/orders/update_address</bold></li>

<ul>

<li>Request</li>

```json
{
    "country": "new user country optional",
    "state": "new user state optional",
    "city": "new user city optional",
    "postal_code": "new user postal code optional",
    "street_address": "new user street address optional"
}
```
<li>Response</li>

```json
{
    "success": true,
    "content": "Address updated successfully",
    "address": {
        "country": "new user country",
        "state": "new user state",
        "city": "new user city",
        "postal_code": "new user postal code optnal",
        "street_address": "new user street address"
    }
}
```
</ul>

</ol>