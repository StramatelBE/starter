import { Router } from "express";
import { Container } from "typedi";
import { SettingController } from "./settings.controller";
import { validateDto } from "../../middlewares/validation.middleware";
import { SettingsDto } from "./settings.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const settingController = Container.get(SettingController);

router.get("/", authMiddleware,(req, res, next) =>
  settingController.getSettings(req, res, next)
);

router.post("/", authMiddleware,validateDto(SettingsDto), (req, res, next) =>
  settingController.createSetting(req, res, next)
);

router.get("/:settingId",authMiddleware, (req, res, next) =>
  settingController.getSettingById(req, res, next)
);

router.put("/date",authMiddleware, (req, res, next) =>
  settingController.updateDate(req, res, next)
);

router.put("/:settingId",authMiddleware, validateDto(SettingsDto), (req, res, next) =>
  settingController.updateSetting(req, res, next)
);


router.delete("/:settingId",authMiddleware, (req, res, next) =>
  settingController.deleteSetting(req, res, next)
);

export default router;
