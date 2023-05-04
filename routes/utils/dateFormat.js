const addDateSx = (date) => {
    let dateSt = date.toString();

    const lastChart = dateSt.charAt(dateSt.length -1);

    if (lastChart === '1' && dateSt !== '11') {
        dateSt = `${dateSt}st`;
    } else if (lastChart === '2' && dateSt !== '12') {
        dateSt = `${dateSt}nd`;
    } else if (lastChart === '3' && dateSt !== '13') {
        dateSt = `${dateSt}rd`;
    } else {
        dateSt = `${dateSt}th`;
    }

    return dateSt;
};

module.exports = (
    timestamp,
    { monthLength = 'short', DateSx = true} = {}
) => {
    const months = {
        0: monthLength === 'short' ? 'Jan' : 'January',
        1: monthLength === 'short' ? 'Feb' : 'February',
        2: monthLength === 'short' ? 'Mar' : 'March',
        3: monthLength === 'short' ? 'Apr' : 'April',
        4: monthLength === 'short' ? 'May' : 'May',
        5: monthLength === 'short' ? 'Jun' : 'June',
        6: monthLength === 'short' ? 'Jul' : 'July',
        7: monthLength === 'short' ? 'Agu' : 'August',
        8: monthLength === 'short' ? 'Sep' : 'September',
        9: monthLength === 'short' ? 'Oct' : 'October',
        10: monthLength === 'short' ? 'Nov' : 'November',
        11: monthLength === 'short' ? 'Dec' : 'December',
        
    };

    const dateObject = new Date(timestamp);
    const formedMonth = months[dateObject.getMonth()];

    const dayOfMon = DateSx 
    ? addDateSx(dateObject.getDate())
    : dateObject.getDate();

    const yrs = dateObject.getFullYear();
    let hr = 
        dateObject.getHours() > 12
        ? Math.floor(dateObject.getHours() - 12)
        : dateObject.getHours();

        if (hr === 0) {
            hr = 12;
        }

        const mnts = (dateObject.getMinutes() < 10 ? '0' : '') + dateObject.getMinutes();

        const dayPrd = dateObject.getHours() >= 12 ? 'pm' : 'am';

        const formedTimeStamp = `${formedMonth} ${dayOfMon}, ${yrs} at ${hr}:${mnts} ${dayPrd}`;

        return formedTimeStamp;
};
