const calendarHeatmap = require('./calendar-heatmap').default.calendarHeatmap;

const display = () => {
  const now = moment().endOf('day').toDate();
  const yearAgo = moment().startOf('day').subtract(1, 'year').toDate();
  const chartData = d3.time.days(yearAgo, now).map(function (dateElement) {
    return {
      date: dateElement,
      count: (dateElement.getDay() !== 0 && dateElement.getDay() !== 6) ? 0 : 0
    };
  });

  const heatmap = calendarHeatmap()
    .data(chartData)
    .selector('.graph')
    .tooltipEnabled(true)
    .colorRange(['#f4f7f7', '#79a8a9'])
    .onClick(function (data) {
      console.log('data', data);
    });

  console.log(now);
  heatmap();  // render the chart
}

export default { display }
