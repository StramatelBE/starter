import { Settings, PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { SettingsDto } from "./settings.validation";
import { exec } from 'child_process';

@Service()
export class SettingService {
  private prisma = new PrismaClient();

  async getSettings(): Promise<Settings[]> {
    const settings = await this.prisma.settings.findMany();
    return settings;
  }

  async createSetting(settingData: SettingsDto): Promise<Settings> {
    const newSetting = await this.prisma.settings.create({
      data: settingData,
    });
    return newSetting;
  }

  async getSettingById(settingId: number): Promise<Settings | null> {
    const setting = await this.prisma.settings.findUnique({
      where: { id: settingId },
    });
    return setting;
  }

  async updateSetting(
    settingId: number,
    settingData: SettingsDto
  ): Promise<Settings | null> {
    const updatedSetting = await this.prisma.settings.update({
      where: { id: settingId },
      data: settingData,
    });
    return updatedSetting;
  }

  async updateDate(date: string): Promise<string> {
    console.log(date);
    
    return new Promise((resolve, reject) => {
      exec(`sudo date -s "${date}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        resolve(stdout);
      });
    });
  }

  async deleteSetting(settingId: number): Promise<Settings | null> {
    const deletedSetting = await this.prisma.settings.delete({
      where: { id: settingId },
    });
    return deletedSetting;
  }
}
