const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const items = require("../fakeDB")

router.get("/", function (req, res) {
  res.json({ items })
})



router.post("/", function (req, res, next) {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);
    const newItem = { 
        name: req.body.name,
        price: req.body.price
    };
    items.push(newItem)
    return res.status(201).json(newItem)
  } catch (e) {
    return next(e)
  }
})

// router.get("/:name", function (req, res) {
//   const foundItem = items.find(item => item.name === req.params.name)
//   if (foundItem === undefined) {
//     throw new ExpressError("Item not found", 404)
//   }
//   res.json({ name: foundItem })
// })

router.patch("/:name", function (req, res, next) {
    try {
      const { name } = req.params;
      const foundItem = items.find((item) => item.name === name);
  
      if (!foundItem) {
        throw new ExpressError("Item not found", 404);
      }
  
      // Update the item's properties if provided in the request body
      if (req.body.name) {
        foundItem.name = req.body.name;
      }
  
      if (req.body.price) {
        foundItem.price = req.body.price;
      }
  
      return res.json({ updated: foundItem });
    } catch (e) {
      return next(e);
    }
  });
  

  router.delete("/:name", function (req, res, next) {
    try {
      const { name } = req.params;
      const foundIndex = items.findIndex((item) => item.name === name);
  
      if (foundIndex === -1) {
        throw new ExpressError("Item not found", 404);
      }
  
      // Remove the item from the items array
      const deletedItem = items.splice(foundIndex, 1);
  
      return res.json({ message: "Deleted" });
    } catch (e) {
      return next(e);
    }
  });
  

module.exports = router;