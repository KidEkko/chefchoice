import { Ingredient, Recipe } from "@/utils/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Heart } from "lucide-react"
import { NormalString } from "@/utils/constants"

export function RecipeCard({ recipe, ...props }: { recipe: Recipe }) { 
    return ( 
        <Card>
            <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
                <CardDescription>Made By: {recipe.createdBy}</CardDescription>
                <CardAction>
                    <Heart className="cursor-pointer" />
                </CardAction>
            </CardHeader>
            <CardContent>
                <ol className="flex flex-col w-full">
                    {recipe.ingredients.map((ing, i) => (
                        <IngredientRow ingredient={ing} key={i} />
                    ))}
                </ol>
            </CardContent>
            <CardFooter>
                <Accordion type="single" collapsible className="w-full" {...props}>
                    <AccordionItem value={recipe.name}>
                        <AccordionTrigger className="cursor-pointer flex space-x-2">
                            <p>Servings: {recipe.servings}</p>
                            <p>You Have: {recipe.ingredients.length} Ingredients!</p>
                        </AccordionTrigger> 
                        <AccordionContent className="space-y-2">
                            <div className="text-lg">Instructions</div>
                            <ol className="space-y-2">
                                {recipe.instructions.map((instruction, i) => (
                                    <li key={i}>{`${i + 1}. ${instruction}`}</li>
                                ))}
                            </ol>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion> 
            </CardFooter>
        </Card> 
    )
}

function IngredientRow({ ingredient, multiplier = 1, ...props }: { ingredient: Ingredient, multiplier?: number }) {
    const s = `${ingredient.amount || ""} ${ingredient.unit || ""} ${NormalString(ingredient.name)}`
    const totalCost = (ingredient.cost * ingredient.amount * multiplier).toFixed(2)

    return (
        <li className="flex flex-row w-full py-1.5 justify-between items-center gap-4 border-b border-gray-100 last:border-none" {...props}>
            <span className="text-sm">{s.trim()}</span>
            <span className="text-sm font-medium shrink-0">${totalCost}</span>
        </li>
    )
}
