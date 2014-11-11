<link rel="stylesheet" href="../css/calendar.css"/>
<link rel="stylesheet" href="../css/style.css"/>
<script src="../../library/vendor/moment/moment.js"></script>
<script src="../../library/vendor/moment/min/locales.js"></script>
<script src="../../library/event_machine.js"></script>
<script src="../../library/helper.js"></script>
<script src="../javascript/calendar.js"></script>
<script src="../javascript/date_range_picker.js"></script>

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
<div class="container" id="firstContainer">
</div>

Installation
------------

Download the Calendar library from here: https://github.com/neformal13/TeamvoyFrontend/tree/master/javascript/calendar and include it like this:
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
new Calendar(containerElement);
</script>
```
<div class="container" id="sixthContainer">
</div>

Also you can create with configureObject:
```js
<div id="containerElement">
</div>
<script>
var containerElement = document.getElementById('containerElement');
new Calendar(containerElement, {year: 2014, month: 5,
 firstDayOfWeek: "Mon", locale: "en", weekends:["Sat","Sun"]});
</script>
```
<div class="container" id="fifthContainer">
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
new Calendar(containerElement, {year: 2014, month: 5, locale: "fr"});
</script>
```
<div class="container" id="eightsContainer">
</div>

But if you have created component you can set him new configure object.

```js
newConfig = {year: 2014, month: 5,  firstDayOfWeek: "Sun" ,
locale: "uk", weekends:["Sat","Sun"]}
calendar.config = newConfig;
```
<aside class="col-xs-4 aside-config">
<input class="year" type="number" placeholder="Enter year in digits" value="2014">
<input class="month" type="number" placeholder="Enter month in digits from 1 to 12" value="1">
<button class="btn btn-success">Change date</button>
</aside>
<div class="container" id="secondContainer">

</div>

###Config Object - optional parameter with fields:

```js
config = {
year: 2014,             // current year, type: number.
month: 5,               // month - current month, type: number.
firstDayOfWeek: "Sun",  // firstDayOfWeek - first day of week in calendar,
                        //starts with upcased letter
locale: "en",           // locale - language of calendar, short name,
                        // type: string. Example: 'monday'.
weekends:["Sat","Sun"]  //array of weekends days.
                        //starts with upcased letter
}
var calendar = new Calendar(containerElement, config);
```

###Listen to events
1. monthChanged - occur when config month data changed.
```js
function monthHandler(month){
console.log(month); //it will log new month
}
//listening to the monthChanged event
Calendar.on('monthChanged', monthHandler);
```
2. daySelected - occur when selecting day changed.
```js
function daySelectedHandler(day){
console.log(day); //it will log selected day
}
//listening to the daySelected event
Calendar.on('daySelected', daySelectedHandler);
```

###Calendar methods
1. showToday(); - set calendar config to show current day.
2. on(eventName,callback); - add new function to event listener.
3. off(eventName,callback); - remove function from event listener.
4. getRoot() - getting root element.
5. render() - generating view.
6. renderBody() - generating body view.
7. renderCaption() - generating caption view.
8. renderHeader() - generating header view.
8. selectDays(styles, range) - adding styles to the days in range.
10. trigger(eventName, params) - trigger functions.
11. getDayEvents(date) - getting concrete date events.

##More examples

You can use calendar to create date range pickers:
```js
<div id="containerElement">
</div>
<script>
    var firstContainer = document.getElementById('firstContainer');
    var firstDateRangePicker = new DateRangePicker(firstContainer);
</script>
```
<div class="container" id="seventhContainer">
</div>

<script src="../javascript/main.js"></script>
