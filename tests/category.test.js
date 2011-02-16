const mongoose = require('mongoose');
const Category = require('../src/database/mongodb/models/category');

describe('Category Model Test', () => {
  beforeAll(async () => {
    await Category.deleteMany({});
    console.log("Base de données nettoyée pour les tests de catégorie (beforeAll)");
  }, 30000);

  beforeEach(async () => {
    await Category.deleteMany({});
    console.log("Base de données nettoyée avant chaque test de catégorie (beforeEach)");
  }, 30000);

  it('should have no categories initially', async () => {
    const categories = await Category.find();
    console.log('Nombre de catégories initialement:', categories.length);
    expect(categories.length).toBe(0);
  }, 30000);

  it('should add a category successfully', async () => {
    const category = new Category({ id: new mongoose.Types.ObjectId().toString(), name: 'Test Category' });
    await category.save();
    console.log('Catégorie ajoutée avec succès:', category);

    const categories = await Category.find();
    console.log('Nombre de catégories après en avoir ajouté une:', categories.length);
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Test Category');
  }, 30000);
});
