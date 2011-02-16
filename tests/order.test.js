const mongoose = require('mongoose');
const Order = require('../src/database/mongodb/models/order');

describe('Order Model Test', () => {
  beforeAll(async () => {
    await Order.deleteMany({});
    console.log("Base de données nettoyée pour les tests de commande (beforeAll)");
  }, 30000);

  beforeEach(async () => {
    await Order.deleteMany({});
    console.log("Base de données nettoyée avant chaque test de commande (beforeEach)");
  }, 30000);

  it('should have no orders initially', async () => {
    const orders = await Order.find();
    console.log('Nombre de commandes initialement:', orders.length);
    expect(orders.length).toBe(0);
  }, 30000);

  it('should add an order successfully', async () => {
    const order = new Order({
      id: new mongoose.Types.ObjectId().toString(),
      userId: 'user123',
      lines: [{
        id: new mongoose.Types.ObjectId().toString(),
        product: {
          id: 'prod123',
          name: 'Test Product',
          price: 50
        },
        quantity: 2,
        total: 100
      }],
      total: 100,
      status: 'pending',
      createdAt: new Date()
    });
    await order.save();
    console.log('Commande ajoutée avec succès:', order);

    const orders = await Order.find();
    console.log('Nombre de commandes après en avoir ajouté une:', orders.length);
    expect(orders.length).toBe(1);
    expect(orders[0].id).toBe(order.id);
    expect(orders[0].userId).toBe(order.userId);
    expect(orders[0].total).toBe(order.total);
  }, 30000);

  it('should delete an order successfully', async () => {
    // Ajouter d'abord une commande
    const order = new Order({
      id: new mongoose.Types.ObjectId().toString(),
      userId: 'user123',
      lines: [{
        id: new mongoose.Types.ObjectId().toString(),
        product: {
          id: 'prod123',
          name: 'Test Product',
          price: 50
        },
        quantity: 2,
        total: 100
      }],
      total: 100,
      status: 'pending',
      createdAt: new Date()
    });
    await order.save();
    console.log('Commande ajoutée pour suppression:', order);

    // Vérifiez que la commande a été ajoutée
    let orders = await Order.find();
    console.log('Nombre de commandes après avoir ajouté une commande pour suppression:', orders.length);
    expect(orders.length).toBe(1);

    // Supprimer la commande
    await Order.deleteOne({ _id: order._id });
    console.log('Commande supprimée avec succès');

    // Vérifiez que la commande a été supprimée
    orders = await Order.find();
    console.log('Nombre de commandes après suppression:', orders.length);
    expect(orders.length).toBe(0);
  }, 30000);
});
