const router = require("express").Router();
const taslCtrl=require("../controller/task")

router.post("/add-data",taslCtrl.addTask)
router.get("/get-data",taslCtrl.getTask)
router.get("/get-data-by-id/:id",taslCtrl.getTaskById)
router.post("/delete-data",taslCtrl.deleteTask)

module.exports = router;