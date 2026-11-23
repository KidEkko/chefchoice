"use client"

import { Ingredient } from "@/utils/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";  
import { NormalString } from "@/utils/constants";
import { Item } from "../ui/item";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldContent, FieldGroup, FieldLabel } from "../ui/field";
import { useCallback, useState } from "react";
import { usePantry } from "../providers/pantry";

export function IngredientPicker({ ings }: { ings: Ingredient[]}) {
    const [ingredients, setIngredients] = useState<Ingredient[]>(ings);

    // Callback function that will update an ingredient by finding the unique id 
    const updateIngredient = useCallback((ingredient: Ingredient, selected: boolean) => { 
        setIngredients(prevIngs => prevIngs.map(ing =>
            ing.ingredientId === ingredient.ingredientId ? { ...ing, selected: selected } : ing
        )
        // When updating the array, push unselected items to the bottom
        // TODO: Might not be desirable for UX. Need to Examine
        .sort((ing1, ing2) => {
            if (ing1.selected && ing2.selected) {
                return ing1.ingredientId - ing2.ingredientId;
            } else if (ing1.selected) {
                return -1;
            }
            return 1;
        }))
    }, [ingredients]);

    return (
        <Card className="flex flex-1 min-w-1/2 ">
            <CardHeader>
                <CardTitle>
                    Ingredient Picker
                </CardTitle>
                <CardDescription>
                    Pick and choose from Our current List of Ingredients!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {ingredients.map((ing) => <IngredientPickerRow ingredient={ing} update={updateIngredient} key={ing.name} />)}
            </CardContent>
        </Card>
    )
}

interface IPRowProps {
    ingredient: Ingredient;
    update: (ingredient: Ingredient, selected: boolean) => void;
}

function IngredientPickerRow({ ingredient, update, ...props }: IPRowProps) { 
    return (
        <Item asChild>
            <li className="flex flex-row flex-1 pt-0.5 pb-0.5 justify-between border border-white " {...props}>
                <FieldGroup>
                    <Field className="cursor-pointer" orientation="horizontal">
                        <Checkbox 
                            checked={ingredient.selected} 
                            id={`${ingredient.name}-checkbox`} 
                            name={`${ingredient.name}-checkbox`} 
                            onCheckedChange={() => update(ingredient, !ingredient.selected)} 
                        />
                        <FieldLabel htmlFor={`${ingredient.name}-checkbox`} >{NormalString(ingredient.name)}</FieldLabel>
                    
                    </Field>
                </FieldGroup>
            </li>
        </Item>
    )
}

// TODO: Update this.
// This should probably be in the same card as the ingredient picker
// The ingredients should be separated by pantry items and regular items
// function PantryDisplay() {
//     const { pantry, update } = usePantry();

//     if (!pantry?.ingredients.length) return <></>

//     return (<>
//         <Card className="flex flex-1 min-w-1/2 ">
//             <CardHeader>
//                 <CardTitle>
//                     Your Pantry
//                 </CardTitle>
//                 <CardDescription>
//                     Pick and choose from Our current List of Ingredients!
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2">
//                 {pantry.ingredients.map((ing) => <IngredientPickerRow ingredient={ing} key={ing.name} />)}
//             </CardContent>
//         </Card>
//     </>)
// }