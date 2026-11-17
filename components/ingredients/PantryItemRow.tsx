import { Ingredient } from "@/utils/types";
import { Item } from "../ui/item";

export function PantryItemRow({ ingredient, multiplier = 1, ...props }: { ingredient: Ingredient, multiplier?: number }) {
    const s = `${ingredient.amount} ${ingredient.unit || ""} ${ingredient.name} `
    return (
        <Item asChild>
            <li className="flex flex-row flex-1 border border-b pb-2 ">
                <p>{s}</p>
                {/* Cost is amount required times the base cost. Include multiplier if user alters it. */}
                <p className="text-">${ingredient.cost * ingredient.amount * multiplier}</p>
            </li>
        </Item>
    )
}