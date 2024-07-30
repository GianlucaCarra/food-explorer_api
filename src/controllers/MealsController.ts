import { Request, Response } from "express";
const knex = require("../../database/knex");
const CloudinaryStorage = require("../providers/CloudinaryStorage");
const AppError = require("../utils/AppError");

interface IIngredient {
  meal_id: number;
  name: string;
}

class MealsController {
  async create(req: Request, res: Response): Promise<Response> {
    const { file } = req;
    const { data } = req.body;
    const parseData = JSON.parse(data);
    const { name, desc, price, type, ingredients } = parseData;
    const cloudinaryStorage = new CloudinaryStorage();

    if(!file) {
      throw new AppError("File is required!", 404);
    }

    const { publicId, imageUrl } = await cloudinaryStorage.saveFile(file.buffer);

    const [meal_id] = await knex("meals").insert({
      name,
      desc,
      price,
      type,
      publicId,
      imageUrl
    });

    if(ingredients.length > 0) {
      const ingredientsInsert = ingredients.map((ingredient: string) => ({
        name: ingredient,
        meal_id
      }));
  
      await knex("ingredients").insert(ingredientsInsert);
    }
    
    return res.json();
  }

  async index(req: Request, res: Response): Promise<Response> {
    const meals = await knex("meals");

    return res.json(meals);
  }

  async search(req: Request, res: Response): Promise<Response> {
    const { query } = req.query;

    const mealResults = await knex('meals')
      .whereLike('name', `%${query}%`)
      .orderBy('name');

    const ingredientsResults = await knex('ingredients')
      .whereLike('name', `%${query}%`)
      .select("meal_id");

    const mealIdsFromIngredients = ingredientsResults.map((ingredient: IIngredient) => ingredient.meal_id);

    const ingredientMealResults = await knex('meals')
      .whereIn('id', mealIdsFromIngredients)
      .orderBy('name');

    const combinedResults = [...mealResults, ...ingredientMealResults]
    .filter((meal, index, self) => 
      index === self.findIndex((m) => m.id === meal.id)
    );

    return res.json(combinedResults)
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const meal = await knex("meals").where({ id }).first();
    const ingredients = await knex("ingredients")
      .where({ meal_id: id })
        .orderBy("name");

    return res.json({ 
      ...meal,
      ingredients
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { file } = req;
    const { data } = req.body;

    const parseData = JSON.parse(data);
    const meal = await knex("meals").where({ id }).first();
    const existingIngredients = await knex("ingredients")
    .where({ meal_id: id });

    const cloudinaryStorage = new CloudinaryStorage();

    if(!meal) {
      throw new AppError("Meal not found", 404);
    }

    let publicId = meal.publicId;
    let imageUrl = meal.imageUrl;

    if(file) {
      await cloudinaryStorage.deleteFile(meal.publicId);
      const result = await cloudinaryStorage.saveFile(file.buffer);
      publicId = result.publicId;
      imageUrl = result.imageUrl;
    }

    const updatedMeal = {
      name: parseData.name || meal.name,
      desc: parseData.desc || meal.desc,
      price: parseData.price || meal.price,
      type: parseData.type || meal.type,
      publicId,
      imageUrl
    };

    const newIngredientNames = parseData.ingredients || meal.ingredients;
    const existingIngredientNames = existingIngredients.map((ingredient: IIngredient) => ingredient.name);
    const ingredientsToAdd = newIngredientNames.filter((name: string)=> !existingIngredientNames.includes(name));
    const ingredientsToRemove = existingIngredientNames.filter((name: string)=> !newIngredientNames.includes(name));

    const newIngredients = ingredientsToAdd.map((name: string) => ({
      name,
      meal_id: id
    }));

    await knex("meals").where({ id }).update(updatedMeal);

    if(newIngredients.length > 0) {
      await knex("ingredients").insert(newIngredients);
    }

    if(ingredientsToRemove.length > 0) {
      await knex("ingredients")
        .where({ meal_id: id })
        .whereIn('name', ingredientsToRemove)
        .del();
    }

    return res.json();
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const meal = await knex("meals").where({ id }).first();
    const cloudinaryStorage = new CloudinaryStorage();

    await cloudinaryStorage.deleteFile(meal.publicId);
    await knex("meals").where({ id }).delete();
    
    return res.json();
  }
}

module.exports = MealsController;