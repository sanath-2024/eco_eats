import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { InventoryItem, Product, Rule } from './App';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { WEEK, DAY, get_product_by_id, get_display_name } from './utils';
import { Typography } from '@mui/material';

interface AlertSectionProps {
    products: Product[],
    inventory: InventoryItem[],
    rules: Rule[]
}

interface GroceryListItem {
    product: Product,
    lift: number
}

const get_grocery_list = (expiring_items: InventoryItem[], products: Product[], rules: Rule[]): GroceryListItem[] => {
    let list: GroceryListItem[] = [];
    for (const item of expiring_items) {
        if (list.find(product => product.product.id === item.food_info_id) === undefined)
            list.push({ product: get_product_by_id(item.food_info_id, products)!, lift: 1000000 });
    }
    for (const item of expiring_items) {
        const product = get_product_by_id(item.food_info_id, products)!;
        for (const rule of rules) {
            if (rule.antecedents.includes(product.name)) {
                const consequents = rule.consequents.split(', ');
                for (const consequent of consequents) {
                    for (const product of products) {
                        if (consequent.includes(product.name) || product.name.includes(consequent)) {
                            if (
                                list.find(existing_product => existing_product.product.id === product.id) === undefined
                                &&
                                list.find(existing_product => existing_product.product.name === product.name) === undefined
                            )
                                list.push({ product, lift: rule.lift });
                        }
                    }
                }
            }
        }
    }
    list.sort((a, b) => b.lift - a.lift);
    return list.slice(0, 10);
}

const AlertSection = (props: AlertSectionProps) => {
    let expiring_inventory = props.inventory.filter(item => item.expiry_time! < WEEK);

    function renderRow(rowProps: ListChildComponentProps) {
        const item = expiring_inventory[rowProps.index];
        let expiry_time = item.expiry_time!;
        let expiry_days = Math.round(expiry_time / DAY);
        let product = get_product_by_id(item.food_info_id, props.products)!;
        return (
            <ListItem key={item.id} component="div" disablePadding>
                <ListItemButton>
                    <ListItemText primary={get_display_name(product)} />
                    <ListItemText primary={`Expires in ${expiry_days} days`} />
                </ListItemButton>
            </ListItem>
        );
    }

    return <Box sx={{ width: '100%', height: 400, bgcolor: 'transparent' }}>
        <div style={{ float: 'left', width: '50%' }}>
            <Typography>Items Close to Expiry:</Typography>
            <FixedSizeList
                height={400}
                width={360}
                itemSize={46}
                itemCount={expiring_inventory.length}
                overscanCount={5}
            >
                {renderRow}
            </FixedSizeList>
        </div>
        <div style={{ float: 'right', width: '50%' }}>
            <Typography>Suggested Grocery List:</Typography>
            <ul>
                {get_grocery_list(expiring_inventory, props.products, props.rules).map(product => <li key={product.product.id}>{get_display_name(product.product)}</li>)}
            </ul>
        </div>
    </Box>;
}

export default AlertSection;