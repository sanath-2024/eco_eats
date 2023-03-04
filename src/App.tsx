import { useEffect, useState } from 'react';
import './App.css';
import { Typography } from '@mui/material';
import AlertSection from './AlertSection';
import InventoryTable from './InventoryTable';
import { compute_inventory_expiry_times, sort_inventory_by_expiry_time } from './utils';
import PurchaseProduct from './PurchaseProduct';

export interface Product {
  id: number,
  name: string,
  subtitle?: string,
  expiry_days: number
}

export interface InventoryItem {
  id: number,
  created_at: string,
  food_info_id: number,
  expiry_time?: number
}

export interface Rule {
  id: number,
  antecedents: string,
  consequents: string,
  lift: number
}

const get_products = async () => {
  const res = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:nySzDtBJ/get_food_info');
  const result = await res.json();
  return result as Product[];
};

const get_user_inventory = async () => {
  const res = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:nySzDtBJ/get_user_inventory');
  const result = await res.json();
  return result as InventoryItem[];
};

const get_rules = async () => {
  const res = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:nySzDtBJ/get_rules');
  const result = await res.json();
  return result as Rule[];
}

function App() {
  const [products, setProducts] = useState([] as Product[]);
  const [inventory, setInventory] = useState([] as InventoryItem[]);
  const [inventoryFlag, setInventoryFlag] = useState(0);
  const [rules, setRules] = useState([] as Rule[]);

  useEffect(() => {
    const set_inventory = async () => {
      let inventory_promise = get_user_inventory();
      let products_promise = get_products();
      let inventory = await inventory_promise;
      let products = await products_promise;
      setProducts(products);
      compute_inventory_expiry_times(inventory, products);
      sort_inventory_by_expiry_time(inventory);
      setInventory(inventory);
    }
    const set_rules = async () => {
      setRules(await get_rules());
    }
    set_inventory();
    set_rules();
  }, [inventoryFlag]);

  return <>
    <center><Typography variant='h1' color='#805050'>EcoEats</Typography></center>
    <Typography>The following items will expire soon!</Typography>
    <AlertSection products={products} inventory={inventory} rules={rules} />
    <Typography>Inventory:</Typography>
    <InventoryTable products={products} inventory={inventory} setInventory={setInventory} setInventoryFlag={setInventoryFlag} />
    <PurchaseProduct products={products} setInventory={setInventory} setInventoryFlag={setInventoryFlag} />
  </>;
}

export default App;
