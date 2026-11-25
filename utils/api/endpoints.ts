
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
    return request<User>(PubRequests.AddUser, ErrorMessages.Auth.SIGNUP_FAILED, post(user));
}

export async function SubmitLogin(user: User): Promise<ApiResult<User>> {
    return request<User>(PubRequests.LogUser, ErrorMessages.Auth.LOGIN_FAILED, post(user));
}

export async function UpdateUser(user: User): Promise<ApiResult<User>> {
    return request<User>(PubRequests.UpdateUser, ErrorMessages.User.UPDATE_FAILED, post(user));
}

export async function GetRecipe(recipeId: number): Promise<ApiResult<Recipe>> {
    return request<Recipe>(PubRequests.GetRecipe, ErrorMessages.Recipe.GET_FAILED, post(recipeId));
}

export async function AddRecipe(recipe: Recipe): Promise<ApiResult<Recipe>> {
    return request<Recipe>(PubRequests.AddRecipe, ErrorMessages.Server.GENERIC, post(recipe));
}

export async function RecommendRecipes(ids: number[]): Promise<ApiResult<Recipe[]>> {
    return request<Recipe[]>(PubRequests.GetRecommendations, ErrorMessages.Recipe.RECOMMEND_FAILED, post(ids));
}

export async function CreatePantry(pantry: Pantry): Promise<ApiResult<Pantry>> {
    return request<Pantry>(PubRequests.CreatePantry, ErrorMessages.Pantry.CREATE_FAILED, post(pantry));
}

export async function UpdatePantry(pantry: Pantry): Promise<ApiResult<Pantry>> {
    return request<Pantry>(PubRequests.UpdatePantry, ErrorMessages.Pantry.UPDATE_FAILED, post(pantry));
}