const calendarHeatmap = require('./calendar-heatmap').default.calendarHeatmap;


const parseBattleHistory = () => {
  const battleHistory = require('./data/battleHistory.json');

  let counter = new Map();
  battleHistory['battleList'].forEach((battle) => {
    counter[battle['battleDate']] = 0;
  });
  battleHistory['battleList'].forEach((battle) => {
    counter[battle['battleDate']]++;
  });

  return counter;
}


const display = () => {
  const counter = parseBattleHistory();
  const now = moment().endOf('day').toDate();
  const yearAgo = moment().startOf('day').subtract(1, 'year').toDate();

  let chartData = new Map();
  chartData = d3.time.days(yearAgo, now).map(function (elem) {
    const timeparser = d3.time.format('%Y/%m/%d');
    const parseDate = timeparser(elem);
    return {
      date: elem,
      count: (counter[parseDate] == undefined) ? 0 : counter[parseDate],
    }
  });


  const heatmap = calendarHeatmap()
    .data(chartData)
    .selector('.graph')
    .tooltipEnabled(true)
    .colorRange(['#f4f7f7', '#006400'])
    .onClick(function (data) {
      console.log('data', data);
    });

  heatmap();  // render the chart
}

export default { display }
