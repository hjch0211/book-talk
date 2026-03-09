import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import calendarIcon from '@src/assets/calendar-outline.svg';
import type { Dayjs } from 'dayjs';
import { ScheduleTextField } from './style';

export type AppDatePickerProps = Omit<
  DatePickerProps<Dayjs>,
  'slots' | 'slotProps' | 'enableAccessibleFieldDOMStructure'
>;

export const AppDatePicker = (props: AppDatePickerProps) => (
  <DatePicker
    {...props}
    enableAccessibleFieldDOMStructure={false}
    slots={{
      textField: ScheduleTextField,
      openPickerIcon: () => <img src={calendarIcon} alt="calendar" width={24} height={24} />,
    }}
    slotProps={{
      popper: { sx: { zIndex: 1500 } },
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
