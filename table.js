const tableRowArray = [];
const numberOfRowsToGenerate = 60;
const topicOptions = [
	"HTML",
	"CSS",
	"GitHub",
	"More HTML",
	"JavaScript",
	"Loops",
	"Conditions",
	"Arrays",
	"Objects",
];
const tableHeaders = [
	"Started At",
	"Finished At",
	"Total Time",
	"Given Tasks",
	"Finished Tasks",
	"Finished %",
	"Topic",
];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* A function for converting hours + minutes + seconds to ms */
function milliseconds(h, m, s) {
	return (h * 60 * 60 + m * 60 + s) * 1000;
}

/* A function for converting time in ms to time in hours */
function msToHours(ms) {
	return ms / 3600000;
}

/* A function for creating random dates in a specified range */
function randomDate(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/* A function for getting a random integer between min and max (both inclusive) - this will be used for tasks given and finished */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* The following for loop creates and adds new objects to the tableRowArray, assigning properties according to the following:
-startedAt: will be a random date from January 10th 2021 aka preCourse t=0
-finishedAt: will be startedAt + 1-21 hours + 0-59 minutes (random)
-totalTime: will be a float limited to 2 decimals representing finishedAt - startedAt in hours
-tasksGiven: will be a random number between 5 and 35 inclusive
-tasksFinished: will be a random number between 0 and tasksGiven
-tasksFinishedPercent: will be the percentage of finished tasks
-topic: will be the topic of the tasks, which is chosen randomly from 10 pre-set values (see topicOptions array for reference)
 */
for (let i = 0; i < numberOfRowsToGenerate; i++) {
	tableRowArray[i] = {
		startedAt: randomDate(new Date(2021, 0, 10), new Date()),
		finishedAt: undefined,
		totalTime: undefined,
		tasksGiven: getRandomInt(5, 35),
		tasksFinished: undefined,
		tasksFinishedPrecent: undefined,
		topic: topicOptions[getRandomInt(0, topicOptions.length - 1)],
	};

	/* The reason I assign finishedAt, totalTime, tasksFinished and tasksFinishedPercent  properties below is that 'this' refers to the global object until the object is declared which means that I cannot access its properties inside of declaration '{}'. I could change these 2 properties into methods and use 'this' inside of declaration '{}' but i prefer to do it this way. */
	tableRowArray[i].finishedAt = new Date(
		tableRowArray[i].startedAt.getTime() + milliseconds(getRandomInt(1, 20), getRandomInt(0, 59), 0)
	);
	tableRowArray[i].totalTime = (
		msToHours(tableRowArray[i].finishedAt.getTime()) -
		msToHours(tableRowArray[i].startedAt.getTime())
	).toFixed(2);
	tableRowArray[i].tasksFinished = getRandomInt(0, tableRowArray[i].tasksGiven);
	tableRowArray[i].tasksFinishedPrecent = Math.floor(
		(tableRowArray[i].tasksFinished * 100) / tableRowArray[i].tasksGiven
	);
}
//console.log(tableRowArray); // For Reference

// Initialize table element with an id of "tbl", append it as a child of <body>.
const myTable = document.createElement("table");
myTable.setAttribute("id", "tbl");
document.body.appendChild(myTable);

/* The following loop runs through the objects inside of tableRowArray, assigning each object(row) to a <tr> element in html which is then appended to the table as its child. For each <tr> there is a nested for in loop which runs through each rows' properties, assigning them to created <td>'s which are appended as children to the <tr>'s.*/
for (const tr of tableRowArray) {
	const trIndex = tableRowArray.indexOf(tr);

	//Create header's row
	if (trIndex === 0) {
		headersRow = document.createElement("tr");
		document.getElementById("tbl").appendChild(headersRow);
		headersRow.setAttribute("id", "headersRow");
	}

	trElement = document.createElement("tr");
	document.getElementById("tbl").appendChild(trElement);
	trElement.setAttribute("id", "row" + trIndex);

	let countForHeaders = 0;
	for (const prop in tableRowArray[trIndex]) {
		if (Object.hasOwnProperty.call(tableRowArray[trIndex], prop)) {
			/*  Create <th> (Headers)*/
			if (trIndex === 0) {
				const th = prop;
				thElement = document.createElement("th");
				document.getElementById("headersRow").appendChild(thElement);
				thElement.innerText = tableHeaders[countForHeaders++];
			}

			/* console.log(trIndex);
			console.log(tableRowArray[trIndex][prop]); */
			const td = tableRowArray[trIndex][prop];

			tdElement = document.createElement("td");
			document.getElementById("row" + trIndex).appendChild(tdElement);
			tdElement.setAttribute("id", prop + "-col" + trIndex);
			tdElement.innerText = td;

			if (prop === "startedAt" || prop === "finishedAt") {
				tdElement.innerText =
					weekDays[td.getDay()] + " " + td.toTimeString().split(" ")[0].slice(0, 5);
			} else if (prop === "tasksFinishedPrecent") {
				tdElement.innerText = td + "%";
				tdElement.style.background = `hsl(145, ${30 + td / 2.5}%, ${90 - td / 2}%)`;
			} else if (prop === "totalTime") {
				tdElement.style.background = `hsl(0, ${65 + td}%, ${85 - td}%)`;
			}
		}
	}
}
