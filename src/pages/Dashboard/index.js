import React, { useState, useMemo, useEffect } from 'react';
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from '~/services/api';

import { Container, Time } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  useEffect(() => {
    async function loadSchedule() {
      const response = await api.get('/schedule', {
        params: { date },
      });

      console.tron.log(response.data);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      console.log(`Timezone: ${timezone} & Date: ${date}`);

      const data = range.map(hour => {
        const checkDate = setMilliseconds(
          setSeconds(setMinutes(setHours(date, hour), 0), 0),
          0
        );
        const compareDate = utcToZonedTime(checkDate, timezone);

        return {
          time: `${hour}:00h`,
          past: isBefore(compareDate, new Date()),
          appointment: response.data.find(a =>
            isEqual(parseISO(a.date), compareDate)
          ),
        };
      });

      setSchedule(data);
      console.tron.log(data);
    }

    loadSchedule();
  }, [date]);

  function handlePrevDay() {
    setDate(setHours(subDays(date, 1), 12));
  }

  function handleNextDay() {
    setDate(setHours(addDays(date, 1), 12));
    console.tron.log(date);
  }

  return (
    <Container>
      <header>
        <button type="button">
          <MdChevronLeft onClick={handlePrevDay} size={36} color="#fff" />
        </button>
        <strong>{dateFormatted}</strong>
        <button type="button">
          <MdChevronRight onClick={handleNextDay} size={36} color="#fff" />
        </button>
      </header>

      <ul>
        {schedule.map(time => (
          <Time key={time.time} past={time.past} available={!time.appointment}>
            <strong>{time.time}</strong>
            <span>
              {time.appointment ? time.appointment.user.name : 'Em aberto'}
            </span>
          </Time>
        ))}
      </ul>
    </Container>
  );
}
