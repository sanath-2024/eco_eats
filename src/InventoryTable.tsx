import { Restaurant, Yard } from "@mui/icons-material";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { InventoryItem, Product } from "./App";
import { DAY, get_display_name, get_product_by_id, WEEK } from "./utils";

interface InventoryTableProps {
    products: Product[],
    inventory: InventoryItem[],
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>
    setInventoryFlag: React.Dispatch<React.SetStateAction<number>>
}

const eat = async (
    id: number,
    inventory: InventoryItem[],
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
    setInventoryFlag: React.Dispatch<React.SetStateAction<number>>
) => {
    await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:nySzDtBJ/eat_food/${id}`, { method: 'DELETE' });
    setInventory(inventory.filter(item => item.id !== id));
    setInventoryFlag(0);
};
const compost = async (
    id: number,
    inventory: InventoryItem[],
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>,
    setInventoryFlag: React.Dispatch<React.SetStateAction<number>>
) => {
    await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:nySzDtBJ/compost_food/${id}`, { method: 'DELETE' });
    setInventory(inventory.filter(item => item.id !== id));
    setInventoryFlag(0);
};

export let rerender: React.Dispatch<React.SetStateAction<number>>;

const InventoryTable = (props: InventoryTableProps) => {
    const [dummy, rerender_table] = useState(0);
    rerender = rerender_table;
    return <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Days to Expiration</TableCell>
                    <TableCell>Eat / Compost</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    props.inventory.map(item => {
                        let purchase_date = new Date(item.created_at);
                        let expiry_time = item.expiry_time!;
                        let color = expiry_time < WEEK ? "red" : "black";
                        let expiry_days = Math.round(expiry_time / DAY);
                        let product = get_product_by_id(item.food_info_id, props.products)!;
                        let name = get_display_name(product);
                        return <TableRow key={item.id}>
                            <TableCell>{name}</TableCell>
                            <TableCell>{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(purchase_date)}</TableCell>
                            <TableCell>
                                <Typography color={color}>{`${expiry_days} days`}</Typography>
                            </TableCell>
                            <TableCell>
                                <Button onClick={async () => await eat(item.id, props.inventory, props.setInventory, props.setInventoryFlag)}>
                                    <Restaurant />
                                </Button>
                                <Button onClick={async () => await compost(item.id, props.inventory, props.setInventory, props.setInventoryFlag)}>
                                    <Yard />
                                </Button>
                            </TableCell>
                        </TableRow>;
                    })
                }
            </TableBody>
        </Table>
    </TableContainer>;
}

export default InventoryTable;