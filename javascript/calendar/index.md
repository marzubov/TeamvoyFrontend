Calendar.js
=============

CalendarJS is an open source library that provides using custom calendar element.
It's lightweight, doesn't depend on any other library (like jQuery).

Try it out:

```js
<div id="firstContainer">
</div>
<script>
    var firstContainer = document.getElementById('firstContainer');
    var firstCalendar = new Calendar(firstContainer);
    firstCalendar.getRoot().classList.add('table', 'table-striped');
</script>
```
<div id="firstContainer">
</div>

Installation
------------

Download the Calendar library from here: www.download_link_example.com and include it like this:
```js
<script src="./path/to/calendar.js"></script>
<script src="./path/to/event_machine.js"></script>
<script src="./path/to/helper.js"></script>
<script src="./path/to/calendar.js"></script>
```

Usage
-----

The typical way of using calendar is by creating a container element and call new Calendar(containerElement):
```js
<div id="containerElement">
</div>
<script>
var containerElement = document.getElementById('containerElement');
new Calendar(yourContainer);
</script>
```
<div id="sixthContainer">
</div>

Also you can create with configureObject:
```js
<div id="containerElement">
</div>
<script>
var containerElement = document.getElementById('containerElement');
new Calendar(containerElement, {year: 2014, month: 5,  firstDayOfWeek: "Mon", locale: "en", weekends:["Sat","Sun"]});
</script>
```
<div id="fifthContainer">
</div>

You can use calendar to create date range pickers:
```js
<div id="containerElement">
</div>
<script>
    var firstContainer = document.getElementById('firstContainer');
    var firstDateRangePicker = new DateRangePicker(firstContainer);
    firstDateRangePicker.firstCalendar.getRoot().classList.add('table', 'table-striped', 'date-range-picker');
    firstDateRangePicker.secondCalendar.getRoot().classList.add('table', 'table-striped', 'date-range-picker');
</script>
```
<div id="seventhContainer">
</div>


Configure
-----

There are two ways to configure calendar.
You can configure your calendar, by passing configureObject when calendar is created.

```js
<div id="containerElement">
</div>
<script>
var containerElement = document.getElementById('containerElement');
new Calendar(containerElement, {year: 2014, month: 5, firstDayOfWeek: "Mon" , locale: "en"});
</script>
```
<div id="eightsContainer">
</div>

But if you have created component you can set him new configure object.

```js
newConfig = {year: 2014, month: 5,  firstDayOfWeek: "Пн" , locale: "ua", weekends:["Сб","Нд"]}
calendar.config = newConfig;
```
<div id="secondContainer">
<aside class="col-xs-4 aside-config">
<input class="year" type="text" placeholder="Some year..">
<input class="month" type="text" placeholder="Some month..">
<label>
<select class="locale">
<option>ua</option>
<option>en</option>
</select>
</label>
<button class="btn btn-success">I want you to click me</button>
</aside>
</div>

###Config Object - optional parameter with fields:
1. year- current year, type: number.
2. month - current month, type: number.
3. firstDayOfWeek - first day of week in calendar, only english language, type: string.
4. locale - language of calendar, short name, type: string. Example: 'monday'.
5. daysInWeek - number days in week.
6. dayEvents - array of day events.
7. weekends - array of weekends days.

###Listen to events
1. monthChanged - occur when config month data changed.
2. dayChanged - occur when selecting day changed.
3. mouseMove - occur on mouse move.
4. mouseDown - occur on mouse down.
5. mouseUp - occur on mouse up.

###Calendar methods
1. showToday(); - set calendar config to show current day.
2. on(eventName,callback); - add new function to event listener.
3. off(eventName,callback); - remove function from event listener.
4. customizeCaption(caption) - add styles to the caption.
5. customizeDayNames(header) - add styles to the header.
6. customizeDays() - add styles to the days.
7. customizeWeekends(weekends, daysInWeek) - add styles to the weekends.
8. getRoot() - getting root element.
9. addDayStyle(date, style) - adding style to the day.
10. removeDayStyle(date, style) - removing styles from the day.
11. render() - generating view.
12. renderBody() - generating body view.
13. renderCaption() - generating caption view.
14. renderHeader() - generating header view.
15. selectDays(styles, range) - adding styles to the days in range.
16. trigger(eventName, params) - trigger functions.

##More examples

You can add more than 7 days in one row:
```js
myCalendar.config = {daysInWeek: 14}
```
<div id="thirdContainer">
</div>

If days in row is not multiply of 7, days names wont be shown
```js
myCalendar.config = {daysInWeek: 13}
```
<div id="fourthContainer">
</div>
