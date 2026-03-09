import { TimePicker, type TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { renderMultiSectionDigitalClockTimeView } from '@mui/x-date-pickers/timeViewRenderers';
import clockIcon from '@src/assets/clock-outline.svg';
import type { Dayjs } from 'dayjs';
import { ScheduleTextField } from './style';

export type AppTimePickerProps = Omit<
  TimePickerProps<Dayjs>,
  'slots' | 'slotProps' | 'enableAccessibleFieldDOMStructure'
>;

export const AppTimePicker = (props: AppTimePickerProps) => (
  <TimePicker
    {...props}
    enableAccessibleFieldDOMStructure={false}
    ampm
    viewRenderers={{
      hours: renderMultiSectionDigitalClockTimeView,
      minutes: renderMultiSectionDigitalClockTimeView,
    }}
    localeText={{
      cancelButtonLabel: '취소',
      okButtonLabel: '확인',
    }}
    slots={{
      textField: ScheduleTextField,
      openPickerIcon: () => <img src={clockIcon} alt="clock" width={24} height={24} />,
    }}
    slotProps={{
      popper: { sx: { zIndex: 1500 } },
      layout: {
        sx: {
          fontFamily: 'S-Core Dream',
          fontSize: '14px',
        },
      },
      actionBar: {
        actions: ['accept'],
        sx: {
          justifyContent: 'flex-end',
          '& .MuiButton-root': {
            fontFamily: 'S-Core Dream',
            fontWeight: 500,
            fontSize: '14px',
            letterSpacing: '0.3px',
            textTransform: 'none',
            color: '#262626',
          },
        },
      },
    }}
  />
);
