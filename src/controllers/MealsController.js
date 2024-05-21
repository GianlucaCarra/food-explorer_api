const knex = require("../../database/knex");
const CloudinaryStorage = require("../providers/CloudinaryStorage");
const AppError = require("../utils/AppError");

class MealsController {
  async create(req, res) {
    const { file } = req;
    const { data } = req.body;
    const parseData = JSON.parse(data);
    const { name, desc, price, type, ingredients } = parseData;
    const cloudinaryStorage = new CloudinaryStorage();

    if(!file) {
      throw new AppError("File is required!");
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
      const ingredientsInsert = ingredients.map(ingredient => ({
        name: ingredient,
        meal_id
      }));
  
      await knex("ingredients").insert(ingredientsInsert);
    }

    return res.json();
  }

  async indexMeal(req, res) {
    const meals = await knex("meals").where({ type: "meal" });


    return res.json(meals);
  }

  async indexDessert(req, res) {
    const desserts = await knex("meals").where({ type: "dessert" });


    return res.json(desserts);
  }

  async indexDrink(req, res) {
    const drinks = await knex("meals").where({ type: "drink" });


    return res.json(drinks);
  }

  async show(req, res) {
    const { id } = req.params;
    const meal = await knex("meals").where({ id }).first();
    const ingredients = await knex("ingredients").where({ meal_id: id }).orderBy("name");

    return res.json({ 
      ...meal,
      ingredients
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const { file } = req;
    const { data } = req.body;

    const parseData = JSON.parse(data);
    const meal = await knex("meals").where({ id }).first();

    const cloudinaryStorage = new CloudinaryStorage();

    if(!meal) {
      throw new AppError("Meal not found", 404);
    }

    let publicId = meal.publicId;
    let imageUrl = meal.imageUrl;

    if (file) {
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

    await knex("meals").update(updatedMeal);

    return res.json();
  }

  async delete(req, res) {
    const { id } = req.params;
    const meal = await knex("meals").where({ id }).first();
    const cloudinaryStorage = new CloudinaryStorage();

    await cloudinaryStorage.deleteFile(meal.publicId);

    await knex("meals").where({ id }).delete();
    
    return res.json();
  }
}

module.exports = MealsController;