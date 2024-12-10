var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

var days_abr = [
    'sun',
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat'
];

Number.prototype.pad = function(num) {
    var str = '';
    for (var i = 0; i < (num - this.toString().length); i++)
        str += '0';
    return str += this.toString();
}

function calendar(widget, date) {
    var original = widget.getElementsByClassName('active')[0];

    if (typeof original === 'undefined') {
        original = document.createElement('table');
        original.setAttribute('data-current',
            date.getFullYear() + '/' +
            date.getMonth().pad(2) + '/' +
            date.getDate().pad(2));
        widget.appendChild(original);
    }

    var diff = date - new Date(original.getAttribute('data-current'));
    diff = new Date(diff).getMonth();

    var e = document.createElement('table');
    e.className = diff === 0 ? 'hidden-left' : 'hidden-right';
    e.innerHTML = '';
    widget.appendChild(e);

    e.setAttribute('data-current',
        date.getFullYear() + '/' +
        date.getMonth().pad(2) + '/' +
        date.getDate().pad(2));

    var row = document.createElement('tr');
    var title = document.createElement('th');
    title.setAttribute('colspan', 7);

    var button_prev = document.createElement('button');
    button_prev.className = 'button-prev';
    button_prev.innerHTML = '&#9666;';

    var button_next = document.createElement('button');
    button_next.className = 'button-next';
    button_next.innerHTML = '&#9656;';

    title.appendChild(button_prev);
    title.appendChild(document.createElement('span')).innerHTML =
        months[date.getMonth()] + '<span class="year">' + date.getFullYear() + '</span>';
    title.appendChild(button_next);

    button_prev.onclick = function () {
        date.setMonth(date.getMonth() - 1);
        calendar(widget, date);
    };

    button_next.onclick = function () {
        date.setMonth(date.getMonth() + 1);
        calendar(widget, date);
    };

    row.appendChild(title);
    e.appendChild(row);

    row = document.createElement('tr');

    for (var i = 1; i < 7; i++) {
        row.innerHTML += '<th>' + days_abr[i] + '</th>';
    }
    row.innerHTML += '<th>' + days_abr[0] + '</th>';
    e.appendChild(row);

    // Get the starting day of the current month
    var start_of_month = new Date(date.getFullYear(), date.getMonth(), -1).getDay();
    var current = new Date(date.getFullYear(), date.getMonth(), -start_of_month);

    // Loop through the days to display them in a 6-week grid
    for (var s = 0; s < 6; s++) {
        var row = document.createElement('tr');

        for (var d = 1; d < 8; d++) {
            var cell = document.createElement('td');
            var span = document.createElement('span');
            cell.appendChild(span);

            span.innerHTML = current.getDate();

            // Check if the current day is in the displayed month
            if (current.getMonth() !== date.getMonth()) {
                cell.className = 'out';
            }

            // If today, highlight it
            if (date.getDate() === current.getDate() && date.getMonth() === current.getMonth()) {
                cell.className = 'today';  // Highlight today with the 'today' class
            }

            current.setDate(current.getDate() + 1);
            row.appendChild(cell);
        }

        e.appendChild(row);
    }

    setTimeout(function () {
        e.className = 'active';
        original.className += diff === 0 ? ' hidden-right' : ' hidden-left';
    }, 20);

    original.className = 'inactive';

    setTimeout(function () {
        var inactives = document.getElementsByClassName('inactive');
        for (var i = 0; i < inactives.length; i++) widget.removeChild(inactives[i]);
    }, 1000);
}

calendar(document.getElementById('calendar'), new Date());