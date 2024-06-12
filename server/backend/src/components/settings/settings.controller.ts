import { Settings } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";
import { SettingService } from "./settings.service";

@Service()
export class SettingController {
  constructor(
    @Inject(() => SettingService)
    private settingService: SettingService
  ) {}

  initializeSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const setting: Settings | null =
        await this.settingService.initializeSettings();
      res.status(200).json({ data: setting, message: "initialized" });
    } catch (error) {
      next(error);
    }
  };

  getSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const settings: Settings[] =
        await this.settingService.getSettings();
      res.status(200).json({ data: settings, message: "found" });
    } catch (error) {
      next(error);
    }
  };

  createSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const settingData = req.body;
      const newSetting: Settings =
        await this.settingService.createSetting(settingData);
      res.status(201).json({ data: newSetting, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  getSettingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const settingId: number = parseInt(req.params.settingId);
      const setting: Settings | null =
        await this.settingService.getSettingById(settingId);
      if (!setting) {
        res.status(404).json({ message: "Setting not found" });
      } else {
        res.status(200).json({ data: setting, message: "found" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const settingId: number = parseInt(req.params.settingId);
      const settingData = req.body;
      const updatedSetting: Settings | null =
        await this.settingService.updateSetting(
          settingId,
          settingData
        );
      if (!updatedSetting) {
        res.status(404).json({ message: "Setting not found" });
      } else {
        res
          .status(200)
          .json({ data: updatedSetting, message: "updated" });
      }
    } catch (error) {
      next(error);
    }
  };

  deleteSetting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const settingId: number = parseInt(req.params.settingId);
      const deletedSetting: Settings | null =
        await this.settingService.deleteSetting(settingId);
      if (!deletedSetting) {
        res.status(404).json({ message: "Setting not found" });
      } else {
        res.status(200).json({ message: "deleted" });
      }
    } catch (error) {
      next(error);
    }
  };
}
