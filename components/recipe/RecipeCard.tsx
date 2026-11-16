import { Recipe } from "@/utils/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Heart } from "lucide-react"
import Image from "next/image"
import { Item, ItemContent } from "../ui/item"

export function RecipeCard({recipe, ...props}: {recipe: Recipe}) { 
    return ( 
        <Card>
            <CardHeader>
                <CardTitle>
                    {recipe.name}
                </CardTitle>
                    <CardDescription>
                        Made By: {recipe.createdBy}
                        {/* {recipe.description} */}
                    </CardDescription>
                <CardAction>
                    {/**
                     * heart icon that fills when clicked for favoriting
                     */}
                    <Heart />
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row justify-between space-x-2">
                    <div className="flex flex-1 max-w-3/4 space-x-2 space-y-2 flex-wrap justify-center">
                        {recipe.ingredients.map((ing) => {
                            return ( 
                            <Item size="xs" className="bg- p-1 text-xs rounded-lg border border-white truncate text-center w-32 " key={ing.id}>
                                <ItemContent>
                                    {ing.name}
                                </ItemContent>
                            </Item>
                            )
                        })}
                    </div>
                    <Image
                        className="dark:invert h-5 w-[100px]"
                        src="/next.svg"
                        alt="Next.js logo"
                        width={100}
                        height={20}
                        priority
                    /> 

                </div>
            </CardContent>
            <CardFooter>
                <Accordion type="single" collapsible {...props}>
                    <AccordionItem value={recipe.name}>
                        <AccordionTrigger className="cursor-pointer flex space-x-2">
                            <p>
                                Servings: {recipe.servings} 
                            </p>
                            <p>
                                You Have: {recipe.ingredients.length} Ingredients!
                            </p>
                        </AccordionTrigger> 
                        <AccordionContent className="space-y-2">
                            <div className="text-lg">
                                Instructions
                            </div>
                            <ol className="space-y-2">
                                {recipe.instructions.map((instruction, i) => {
                                    const step = `${i+1}. ${instruction}`
                                    return <li>{step}</li>
                                })}
                            </ol>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion> 
            </CardFooter>
        </Card> 
    )
}
