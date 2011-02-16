const { AuthEntity, UserEntity, CategoryEntity, OrderEntity, ProductEntity } = require("../entities");

module.exports = (app) => {
  app.use("/auth", AuthEntity.authRouter);
  app.use("/users", UserEntity.userRouter);
  app.use("/categories", CategoryEntity.categoryRouter);
  app.use("/products", ProductEntity.productRouter);
  app.use("/orders", OrderEntity.orderRouter);
};
