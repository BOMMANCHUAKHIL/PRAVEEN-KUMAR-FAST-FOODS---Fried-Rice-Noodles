import json
import os
from datetime import datetime

class InMemoryDB:
    def __init__(self):
        self.data_file = "db_data.json"
        self.products = []
        self.orders = []
        self.customers = []
        self._id_counter = 1
        self.load_data()

    def load_data(self):
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    self.products = data.get('products', [])
                    self.orders = data.get('orders', [])
                    self.customers = data.get('customers', [])
                    self._id_counter = data.get('_id_counter', 1)
                    print(f"📂 Loaded: {len(self.orders)} orders, {len(self.products)} products")
            except Exception as e:
                print(f"⚠️ Error loading data: {e}")
        else:
            print("📂 No existing data file, starting fresh")
            # Create empty file
            self.save_data()

    def save_data(self):
        try:
            data = {
                'products': self.products,
                'orders': self.orders,
                'customers': self.customers,
                '_id_counter': self._id_counter,
                'saved_at': datetime.utcnow().isoformat()
            }
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2, default=str)
            print(f"💾 Saved: {len(self.orders)} orders, {len(self.products)} products")
        except Exception as e:
            print(f"⚠️ Error saving data: {e}")

    def get_next_id(self):
        self._id_counter += 1
        self.save_data()
        return self._id_counter - 1

    # === PRODUCT METHODS ===
    async def find_products(self):
        return self.products

    async def find_product(self, product_id):
        for p in self.products:
            if str(p.get("_id")) == str(product_id):
                return p
        return None

    async def insert_product(self, data):
        data["_id"] = self.get_next_id()
        data["id"] = str(data["_id"])
        self.products.append(data)
        self.save_data()
        return data

    async def update_product(self, product_id, data):
        for i, p in enumerate(self.products):
            if str(p.get("_id")) == str(product_id):
                self.products[i].update(data)
                self.save_data()
                return self.products[i]
        return None

    async def delete_product(self, product_id):
        for i, p in enumerate(self.products):
            if str(p.get("_id")) == str(product_id):
                del self.products[i]
                self.save_data()
                return True
        return False

    # === ORDER METHODS ===
    async def find_orders(self):
        return self.orders

    async def find_order(self, order_id):
        for o in self.orders:
            if str(o.get("_id")) == str(order_id):
                return o
        return None

    async def insert_order(self, data):
        data["_id"] = self.get_next_id()
        self.orders.append(data)
        self.save_data()
        return data

    async def update_order(self, order_id, data):
        for i, o in enumerate(self.orders):
            if str(o.get("_id")) == str(order_id):
                self.orders[i].update(data)
                self.save_data()
                return self.orders[i]
        return None

    # === CUSTOMER METHODS ===
    async def find_customer_by_phone(self, phone):
        for c in self.customers:
            if c.get("phone") == phone:
                return c
        return None

    async def insert_customer(self, data):
        data["_id"] = self.get_next_id()
        self.customers.append(data)
        self.save_data()
        return data

# Create instance
db = InMemoryDB()

products_collection = db
orders_collection = db
customers_collection = db

print(f"✅ Database ready with {len(db.orders)} orders")