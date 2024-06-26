import { useCallback } from 'react';
import SettingsService from '../api/settingsService';
import settingsStore from '../stores/settingsStore';

function useSettings() {
  const { setSettings } = settingsStore();

  const getSettings = useCallback(async () => {
    const settings = await SettingsService.getSettings();
    setSettings(settings.data[0]);
    return settings;
  }, [setSettings]);

  const updateSetting = useCallback(
    async (settingId, settingData) => {
      setSettings(settingData);
      await SettingsService.updateSetting(settingId, settingData);
    },
    [setSettings]
  );
  const updateSettingDate = useCallback(
    async (date) => {
      await SettingsService.updateDate(date);
    },
    []
  );

  return {
    getSettings,
    updateSetting,
    updateSettingDate,
  };
}

export default useSettings;
