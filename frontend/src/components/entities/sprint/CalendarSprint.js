import React from 'react';
import {Calendar, momentLocalizer, Views} from 'react-big-calendar';
import * as dates from './dates';
import 'react-big-calendar/lib/sass/styles.scss';
import moment from "moment";

let allViews = Object.keys(Views).map(k => Views[k]);

const ColoredDateCellWrapper = ({children}) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'lightblue',
        },
    });

const localizer = momentLocalizer(moment); // or globalizeLocalizer

const getMinDate = (events) => {
    // console.log(events);
    const dates = events.map(event => event.start);
    if (dates.length > 0)
        return new Date(Math.min.apply(null, dates));
    return new Date(2020, 1, 1);
};

const eventPropGetter = (event, start, end, isSelected) => {
    let newStyle = {
        color: 'white',
        borderRadius: "0px",
        border: "none"
    };

    const value = event.state;
    let classes = "badge badge-pill badge-";

    switch (value) {
        case "Planifiè":
            newStyle.backgroundColor = "#28a745";
            classes += "success";
            break;
        case "En Cours":
            newStyle.backgroundColor = "#6c757d";
            classes += "secondary";
            break;
        case "Cloturé":
            newStyle.backgroundColor = "#007bff";
            classes += "primary";
            break;
        case "Archivé":
            newStyle.backgroundColor = "#ffc107";
            classes += "warning";
            break;
        default:
            newStyle.backgroundColor = "#6c757d";
            classes += "secondary";
    }

    return {
        style: newStyle,
        // className : classes,
    };
};

const getEvents = sprints => {
    return sprints.map(sprint => {
        return {
            id: sprint.id,
            title: sprint.name + ` (${sprint.state})`,
            start: moment(sprint.desired_at).toDate(),
            end: moment(sprint.desired_at).add(1, 'h').toDate(),
            state: sprint.state
        }
    });
};

const CalenderSprint = ({sprints}) => {

    /*
        Event {
          title: string,
          start: Date,
          end: Date,
          allDay?: boolean
          resource?: any,
        }
     */

    const events = sprints.map(sprint => {
        return {
            id: sprint.id,
            title: sprint.name + ` (${sprint.state})`,
            start: moment(sprint.desired_at).toDate(),
            end: moment(sprint.desired_at).add(1, 'h').toDate(),
            state: sprint.state
        }
    });

    const defaultMessages = {
        date: 'Date',
        time: 'Time',
        event: 'Event',
        allDay: 'All Day',
        week: 'Week',
        work_week: 'Work Week',
        day: 'Day',
        month: 'Month',
        previous: 'Back',
        next: 'Next',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        today: 'Today',
        agenda: 'Agenda',
        noEventsInRange: 'There are no events in this range.',
        showMore: function showMore(total) {
            return "+" + total + " more";
        }
    };

    const myDefaultMessages = {
        date: 'Date',
        time: 'temps',
        event: 'Sprint',
        allDay: 'toute la journée',
        week: 'Semaine',
        work_week: 'Work Week',
        day: 'Journee',
        month: 'Mois',
        previous: 'Precedent',
        next: 'Suivant',
        yesterday: 'Hier',
        tomorrow: 'Demain',
        today: "Aujourd'hui",
        agenda: 'Agenda',
        noEventsInRange: 'Il n\'y a aucun sprint dans cette plage.',
        showMore: function showMore(total) {
            return "+" + total + " plus";
        }
    };

    return (
        <Calendar
            style={{
                width: "100%",
                height: 500,
            }}
            events={getEvents(sprints)}
            // views={allViews}
            // ('month'|'week'|'work_week'|'day'|'agenda')
            views={['month', 'week', 'day', 'agenda']}
            step={60}
            popup
            showMultiDayTimes
            max={dates.add(dates.endOf(new Date(2019, 17, 1), 'day'), -1, 'hours')}
            defaultDate={getMinDate(events)}
            // components={{
            //     timeSlotWrapper: ColoredDateCellWrapper,
            // }}
            localizer={localizer}
            eventPropGetter={eventPropGetter}
            messages={myDefaultMessages}
        />
    );

};

export default CalenderSprint