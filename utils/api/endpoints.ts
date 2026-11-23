
import { ErrorMessages } from "@/serverConfig"; 
import { User, Recipe, Ingredient, Pantry } from "../types";
import { ApiResult, request } from "./"; 

const PubRequests = Object.freeze({
  AddUser: "signup",
  LogUser: "auth",
  UpdateUser: "userUpdate",
  GetRecipe: "getRecipe",
  AddRecipe: "addRecipe",
  GetPrep: "getMealPrep",
  GetRecommendations: "recommendRecipes",
  CreatePantry: "createPantry",
  UpdatePantry: "updatePantry"
});

// Helper function for basic POST requests
function post(body: unknown): RequestInit {
    return {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    };
}

export function CreateNewUser(user: User): Promise<ApiResult<User>> {
    return request<User>(PubRequests.AddUser, ErrorMessages.DEFAULT_LOGIN_ERROR, post(user));
}

export async function SubmitLogin(user: User): Promise<ApiResult<User>> {
    return request<User>(PubRequests.LogUser, ErrorMessages.DEFAULT_LOGIN_ERROR, post(user));
}

// TODO: Add message strings for all below functions
export async function UpdateUser(user: User): Promise<ApiResult<User>> {
    return request<User>(PubRequests.UpdateUser, ErrorMessages.DEFAULT_UPDATE_USER_ERROR, post(user));
}

export async function GetRecipe(recipeId: number): Promise<ApiResult<Recipe>> {
    return request<Recipe>(PubRequests.GetRecipe, ErrorMessages.GENERIC_ERROR, post(recipeId));
}

export async function AddRecipe(recipe: Recipe): Promise<ApiResult<Recipe>> {
    return request<Recipe>(PubRequests.AddRecipe, ErrorMessages.GENERIC_ERROR, post(recipe));
}

export async function RecommendRecipes(ingredients: Ingredient[]): Promise<ApiResult<Recipe[]>> {
    return request<Recipe[]>(PubRequests.GetRecommendations, ErrorMessages.GENERIC_ERROR, post(ingredients));
}

export async function CreatePantry(pantry: Pantry): Promise<ApiResult<Pantry>> {
    return request<Pantry>(PubRequests.CreatePantry, ErrorMessages.GENERIC_ERROR, post(pantry));
}

export async function UpdatePantry(pantry: Pantry): Promise<ApiResult<Pantry>> {
    return request<Pantry>(PubRequests.UpdatePantry, ErrorMessages.GENERIC_ERROR, post(pantry));
}