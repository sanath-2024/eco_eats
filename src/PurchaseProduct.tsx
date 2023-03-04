import { InventoryItem, Product } from "./App";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from "@mui/system";
import { get_display_name } from "./utils";
import { Button } from "@mui/material";
import { useState } from "react";
import { rerender } from "./InventoryTable";

interface PurchaseProductProps {
    products: Product[],
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
    setInventoryFlag: React.Dispatch<React.SetStateAction<number>>
}

const purchase_product = async (
    product: Product | null,
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
    setInventoryFlag: React.Dispatch<React.SetStateAction<number>>
): Promise<void> => {
    if (product === null)
        return;
    console.log(`purchasing product: ${JSON.stringify({ food_info_id: product.id })}`)
    await fetch('https://x8ki-letl-twmt.n7.xano.io/api:nySzDtBJ/purchase_user_food', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: product.id }) });
    let inventory_resp = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:nySzDtBJ/get_user_inventory');
    setInventory((await inventory_resp.json()) as InventoryItem[]);
    setInventoryFlag(0);
    rerender(0);
};

const PurchaseProduct = (props: PurchaseProductProps) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        <>
            <Autocomplete
                id="add-food-item"
                sx={{ width: 300 }}
                options={props.products}
                autoHighlight
                getOptionLabel={(option) => get_display_name(option)}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ width: 300 }} {...props}>
                        {get_display_name(option)}
                    </Box>
                )}
                value={selectedProduct}
                onChange={(event, newValue) => setSelectedProduct(newValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Add Food Item"
                        inputProps={{
                            ...params.inputProps
                        }}
                    />
                )}
            />
            <Button onClick={async () => await purchase_product(selectedProduct, props.setInventory, props.setInventoryFlag)}>Purchase Product!</Button>
        </>
    );
}

export default PurchaseProduct;