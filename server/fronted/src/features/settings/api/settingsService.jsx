import { fetchWithAuthorization } from '../../../utils/fetchWithAuthorization';

class SettingsService {
  static async getSettings() {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}settings/`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  }

  static async updateDate(date) {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}settings/date`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(date),
      }
    );
  }

  static async updateSetting(settingId, settingData) {
    const response = await fetchWithAuthorization(
      `${import.meta.env.VITE_REACT_APP_API_URL}settings/${settingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    return await response.json();
  }
}

export default SettingsService;
