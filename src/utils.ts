import { InventoryItem, Product } from "./App"

export const SECOND = 1000;
export const HOUR = 3600 * SECOND;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = (365.25 / 12) * DAY;
export const YEAR = 365.25 * DAY;

export const get_display_name = (product: Product): string => {
    let name = product.name;
    if (product.subtitle !== null)
        name += ` (${product.subtitle})`;
    return name;
}

export const get_product_by_id = (id: number, products: Product[]): Product | undefined => {
    return products.find(product => product.id === id);
};

export const get_inventory_by_product_id = (id: number, inventory: InventoryItem[]): InventoryItem[] => {
    return inventory.filter(value => value.food_info_id === id);
};

const get_time_to_expiry = (item: InventoryItem, products: Product[]): number => {
    const product = get_product_by_id(item.food_info_id, products);
    if (product === undefined)
        return YEAR; // return 1 year if unknown

    const created_date = new Date(item.created_at);
    let expiry_date = new Date(created_date);
    expiry_date.setDate(expiry_date.getDate() + product.expiry_days);

    const now = new Date();
    const time_to_expiry = expiry_date.valueOf() - now.valueOf();
    return time_to_expiry;
}

export const compute_inventory_expiry_times = (inventory: InventoryItem[], products: Product[]): void => {
    for (let i = 0; i < inventory.length; i++) {
        inventory[i].expiry_time = get_time_to_expiry(inventory[i], products);
    }
}

export const sort_inventory_by_expiry_time = (inventory: InventoryItem[]): void => {
    inventory.sort((a, b) => a.expiry_time! - b.expiry_time!);
}