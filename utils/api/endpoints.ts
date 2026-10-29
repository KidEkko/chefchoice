
import { ErrorMessages } from "@/serverConfig"; 
import { User } from "../types/user";
import { ApiResult, request } from "./request";
import { Recipe } from "../types/recipe";

const PubRequests = Object.freeze({
  Username: "getUser",
  AddUser: "signup",
  LogUser: "auth",
  UpdateUser: "userUpdate",
  GetRecipe: "getRecipe",
  AddRecipe: "addRecipe",
  GetPrep: "getMealPrep",
});

// Helper function for basic POST requests
function post(body: unknown): RequestInit {
    return {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    };
}

export async function GetUserWithToken(): Promise<ApiResult<User>> {
    return request<User>(PubRequests.Username, ErrorMessages.DEFAULT_LOGIN_ERROR);
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