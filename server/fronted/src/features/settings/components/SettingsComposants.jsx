import BugReportIcon from '@mui/icons-material/BugReport';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LockIcon from '@mui/icons-material/Lock';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsIcon from '@mui/icons-material/Settings';
import StopIcon from '@mui/icons-material/Stop';
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Container from '../../../components/ContainerComponents';
import useThemeStore from '../../../stores/themeStore';
import useModes from '../../playlist/hooks/useMode';
import modeStore from '../../playlist/stores/modeStore';
import useSettings from '../hooks/useSettings';
import settingsStore from '../stores/settingsStore';
import ChangePasswordDialog from './dialogs/ChangePasswordDialog';
import { debounce } from 'lodash';

function SettingsComposants({ loading }) {
  const [ChangePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  function closeDialog() {
    setChangePasswordDialogOpen(false);
  }

  return (
    <>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12}>
          <Container
            icon={Icon()}
            title="Settings"
            content={
              loading ? (
                <>
                  {[...Array(3)].map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      style={{
                        height: '50px',
                        width: '95%',
                        marginLeft: '2.5%',
                        marginRight: '2.5%',
                        marginBottom: index === 2 ? '0' : '10px', // Pas de marginBottom pour le dernier élément
                        borderRadius: '10px',
                      }}
                    />
                  ))}
                </>
              ) : (
                <Settings
                  setChangePasswordDialogOpen={setChangePasswordDialogOpen}
                />
              )
            }
          />
        </Grid>
      </Grid>
      <ChangePasswordDialog
        open={ChangePasswordDialogOpen}
        onClose={closeDialog}
      />
    </>
  );
}

SettingsComposants.propTypes = {
  loading: PropTypes.bool.isRequired,
};

function Icon() {
  return <SettingsIcon sx={{ color: 'primary.light' }} />;
}

function Settings({ setChangePasswordDialogOpen }) {
  const { modes } = modeStore();
  const { settings, setSettings } = settingsStore();
  const { updateSetting, updateSettingDate } = useSettings();
  const { updateMode } = useModes();
  const { theme, toggleTheme } = useThemeStore();

  const standbyStart = parseInt(settings.standby_start_time);
  const standbyEnd = parseInt(settings.standby_end_time);

  const handleSliderChange = (event, newValue) => {
    setSettings({
      ...settings,
      standby_start_time: `${newValue[0]}:00`,
      standby_end_time: `${newValue[1]}:00`,
    });
  };
  const debouncedUpdateSetting = debounce((newSettings) => {
    updateSetting(settings.id, newSettings);
  }, 300);

  const handleDebouncedSliderChange = (event, newValue) => {
    const newSettings = {
      ...settings,
      standby_start_time: `${newValue[0]}:00`,
      standby_end_time: `${newValue[1]}:00`,
    };
    debouncedUpdateSetting(newSettings);
  };

  const handleSwitchChange = (e) => {
    updateSetting(settings.id, {
      ...settings,
      standby: e.target.checked,
    });
  };

  const updateDate = () => {
    updateSettingDate({
      date: new Date().toISOString(),
    });
  };
  return (
    <Grid container>
      <Grid item xs={12} sm={12}>
        <Stack pl={8} pr={8} spacing={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack spacing={3} direction="row" alignItems="center">
              <IconButton disabled>
                <DarkModeIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
              <Typography variant="h8" sx={{ color: 'text.primary' }}>
                Dark mode
              </Typography>
            </Stack>
            <Switch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              color="secondary"
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <IconButton disabled>
                <BugReportIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
              <Typography variant="h8" sx={{ color: 'text.primary' }}>
                Test panneau
              </Typography>
            </Stack>
            {modes && modes.name === 'test' ? (
              <IconButton size="small" onClick={() => updateMode('data', null)}>
                <StopIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
                <CircularProgress
                  size={32}
                  sx={{
                    top: 5,
                    left: 5,
                    position: 'absolute',
                    color: 'secondary.main',
                  }}
                />
              </IconButton>
            ) : (
              <IconButton size="small" onClick={() => updateMode('test', null)}>
                <PlayArrowIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
              </IconButton>
            )}
          </Stack>
          <Stack
            onClick={() => updateDate()}
            direction="row"
            alignItems="center"
            spacing={3}
          >
            <IconButton>
              <DateRangeIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
            <Typography variant="h8" sx={{ color: 'text.primary' }}>
              Synchroniser la Date
            </Typography>
          </Stack>
          <Stack
            onClick={() => setChangePasswordDialogOpen(true)}
            direction="row"
            alignItems="center"
            spacing={3}
          >
            <IconButton>
              <LockIcon sx={{ color: 'text.secondary' }} />
            </IconButton>
            <Button
              variant="h8"
              size="big"
              sx={{
                margin: '24px',
                color: 'text.primary',
                textTransform: 'none',
                padding: '0',
              }}
            >
              Changer le mot de passe
            </Button>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={3}
          >
            <Stack spacing={3} direction="row" alignItems="center">
              <IconButton disabled>
                <ModeNightIcon sx={{ color: 'text.secondary' }} />
              </IconButton>
              <Typography>Veille</Typography>
            </Stack>
            <Switch
              color="secondary"
              checked={settings.standby}
              onChange={handleSwitchChange}
            />
          </Stack>
          <Stack style={{ marginLeft: '5%', marginRight: '5%' }}>
            <Slider
              color="secondary"
              value={[standbyStart, standbyEnd]}
              min={0}
              max={24}
              step={1}
              marks={[
                { value: 0, label: '0h' },
                { value: 6, label: '6h' },
                { value: 12, label: '12h' },
                { value: 18, label: '18h' },
                { value: 24, label: '24h' },
              ]}
              valueLabelDisplay="auto"
              onChange={handleSliderChange}
              onChangeCommitted={handleDebouncedSliderChange}
              disabled={!settings.standby}
            />
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}

Settings.propTypes = {
  setChangePasswordDialogOpen: PropTypes.func.isRequired,
};

export default SettingsComposants;
