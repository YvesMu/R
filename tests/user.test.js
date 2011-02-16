const mongoose = require('mongoose');
const User = require('../src/database/mongodb/models/user');

describe('User Model Test', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    console.log("Base de données nettoyée pour les tests d'utilisateur (beforeAll)");
  }, 30000);

  beforeEach(async () => {
    await User.deleteMany({});
    console.log("Base de données nettoyée avant chaque test d'utilisateur (beforeEach)");
  }, 30000);

  it('should have no users initially', async () => {
    const users = await User.find();
    console.log('Nombre d’utilisateurs initialement:', users.length);
    expect(users.length).toBe(0);
  }, 30000);

  it('should add a user successfully', async () => {
    const user = new User({ id: new mongoose.Types.ObjectId(), name: 'Test User', email: 'test@example.com' });
    await user.save();
    console.log('Utilisateur ajouté avec succès:', user);

    const users = await User.find();
    console.log('Nombre d’utilisateurs après en avoir ajouté un:', users.length);
    expect(users.length).toBe(1);
    expect(users[0].name).toBe('Test User');
    expect(users[0].email).toBe('test@example.com');
  }, 30000);

  it('should delete a user successfully', async () => {
    // Ajouter d'abord un utilisateur
    const user = new User({ id: new mongoose.Types.ObjectId(), name: 'User to Delete', email: 'delete@example.com' });
    await user.save();
    console.log('Utilisateur ajouté pour suppression:', user);

    // Vérification que l'utilisateur à bien été ajouté
    let users = await User.find();
    console.log('Nombre d’utilisateurs après avoir ajouté un utilisateur pour suppression:', users.length);
    expect(users.length).toBe(1);

    // Suppréssion de l'utilisateur
    await User.deleteOne({ _id: user._id });
    console.log('Utilisateur supprimé avec succès');

    // Vérifiez que l'utilisateur a été supprimé
    users = await User.find();
    console.log('Nombre d’utilisateurs après suppression:', users.length);
    expect(users.length).toBe(0);
  }, 30000);
});
