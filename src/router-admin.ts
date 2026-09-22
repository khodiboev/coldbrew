import express from "express";
const routerAdmin = express.Router();
import restaurantController from "./controllers/restaurant.controller";
import productController from "./controllers/product.controller";
import contentController from "./controllers/content.controller";
import makeUploader from "./libs/utils/uploader";

//*Restaurant*/
routerAdmin.get("/", restaurantController.goHome);

routerAdmin
  .get("/login", restaurantController.getLogin)
  .post("/login", restaurantController.processLogin);

routerAdmin
  .get("/signup", restaurantController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    restaurantController.processSignup,
  );

routerAdmin.get("/logout", restaurantController.logout);

routerAdmin.get("/check-me", restaurantController.checkAuthSession);

//*Product*/
routerAdmin.get(
  "/product/all",
  restaurantController.verifyRestaurant,
  productController.getAllProducts,
);

routerAdmin.post(
  "/product/create",
  restaurantController.verifyRestaurant,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct,
);

routerAdmin.post(
  "/product/:id",
  restaurantController.verifyRestaurant,
  productController.updateChosenProduct,
);

//*User*/

routerAdmin.get(
  "/user/all",
  restaurantController.verifyRestaurant,
  restaurantController.getUsers,
);

routerAdmin.post(
  "/user/edit",
  restaurantController.verifyRestaurant,
  restaurantController.updateChosenUser,
);

//*Content (Help page: Terms & FAQ)*/

routerAdmin.get(
  "/content",
  restaurantController.verifyRestaurant,
  contentController.getContentPage,
);

routerAdmin.post(
  "/content/term/create",
  restaurantController.verifyRestaurant,
  contentController.createTerm,
);

routerAdmin.post(
  "/content/term/:id/delete",
  restaurantController.verifyRestaurant,
  contentController.deleteTerm,
);

routerAdmin.post(
  "/content/term/:id",
  restaurantController.verifyRestaurant,
  contentController.updateTerm,
);

routerAdmin.post(
  "/content/faq/create",
  restaurantController.verifyRestaurant,
  contentController.createFaq,
);

routerAdmin.post(
  "/content/faq/:id/delete",
  restaurantController.verifyRestaurant,
  contentController.deleteFaq,
);

routerAdmin.post(
  "/content/faq/:id",
  restaurantController.verifyRestaurant,
  contentController.updateFaq,
);

export default routerAdmin;
