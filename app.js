// Api data from : https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json


const createChart = async () => {
    const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    const data = await response.json();
    const {baseTemperature, monthlyVariance} = data;

    // Limits on the X-axis
    const firstYear = new Date(1753, 0).getFullYear();
    const lastYear = new Date(2015, 0).getFullYear();
    console.log(firstYear, lastYear)


    // Months list for Y-Axis
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    


    // Years from the data
    const years = monthlyVariance.map(month => {
        return month.year
    })


    // Temperatures after adding the variance
    const temps = monthlyVariance.map((data) => {
        return baseTemperature + data.variance;
    })


    // SVG dimensions
    const height = 600;
    const width = 900;
    const padding = 30;
    const barHeight = (height - (2 * padding)) / months.length;
    // const barWidth =  (width - (2 * padding)) / monthlyVariance.length;
    const barWidth = 2


    // Select SVG
    const svg = d3.select('.container')
                .append('svg')
                .attr('height', height + 50)
                .attr('width', width + 50)


    // X Axis and scale
    const xScale = d3.scaleTime().domain([firstYear, lastYear]).range([padding, width - padding]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(${padding}, ${height - padding})`)
        .call(xAxis)

    // Y Axis and scale
    
    const labels =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const labels1 =  [0, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    
    const y_elements = monthlyVariance.map(function(item) {
        return item['month'];
      })
    const yScale = d3.scaleBand().domain(y_elements).range([padding, height - padding]);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => labels[d-1]);

    svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding * 2}, 0)`)
        .call(yAxis)

    // Tooltip
    const tooltip = d3.select(".container")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr('id', 'tooltip')
    .style('opacity', 0.9)
    
    
    svg.selectAll('rect')
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('height', barHeight)
        .attr('width', barWidth)
        .attr('x', (d, i) => padding + 2  + xScale(new Date(monthlyVariance[i].year, 0).getUTCFullYear() + 1))
        .attr('y', (d, i) => yScale(d.month))
        .attr('stroke', 'black')
        .attr('data-month', (d, i) => d.month - 1)
        .attr('data-year', (d, i) => d.year)
        .attr('data-temp', (d, i) => data.baseTemperature + d.variance)
        .style('stroke-width', '0.5')
        .on("mouseover", function(d){return tooltip.style("visibility", "visible").attr('data-date', d[0])})
        .on("mousemove", function(d){return tooltip.style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px").html(() => {
            return `<center><strong>${d.year}</strong>-<strong>${labels1[d['month']]}</strong><br><strong>${(baseTemperature + d.variance).toFixed(2) + "℃"}</strong><br><strong>${d.variance > 0 ? "+" + d.variance.toFixed(2) + "℃" : d.variance.toFixed(2) + "℃"}</strong></center>`
        }).attr('data-year', d.year)})
        .on("mouseout", function(d){return tooltip.style("visibility", "hidden").attr('data-date', d[0])})
        .style('fill',(d,i) => {
            const temp = (baseTemperature + d.variance).toFixed(1);
            if(temp < 2.8) {
                return "#298a00";
            } else if(temp >= 2.8 && temp < 3.9) {
                return "#84fc03";
            } else if(temp >= 3.9 && temp < 5.0) {
                return "#adfc03";
            } else if(temp >= 5.0 && temp < 6.1) {
                return "#e3fc03";
            } else if(temp >= 6.1 && temp < 7.2) {
                return "#fceb03";
            } else if(temp >= 7.2 && temp < 8.3) {
                return "#fcbe03";
            } else if(temp >= 8.3 && temp < 9.5) {
                return "#fc9403";
            } else if(temp >= 9.5 && temp < 10.6) {
                return "#fc6f03";
            } else if(temp >= 10.6 && temp < 11.7) {
                return "#fc4a03";
            } else if(temp >= 11.7 && temp < 12.8) {
                return "#fc2403";
            } else if(temp >= 12.8) {
                return "#fc0303";
            }
        })

    const colors = ["#298a00", "#84fc03", "#adfc03", "#e3fc03", "#fceb03", "#fcbe03", "#fc9403",  "#fc6f03", "#fc4a03", "#fc2403", "#fc0303"]
    const legend = d3.select('#legend')
                    .append('svg')
                    .attr('height', 100)
                    .attr('width',500)


    
    const threshold = d3.scaleThreshold()
    .domain([2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])
    .range(colors);


    const x = d3.scaleLinear()
    .domain([0, 15])
    .range([0, 500]);

    

const legendAxis = d3.axisBottom(x)
    .tickSize(10)
    .tickValues(threshold.domain())
    .tickFormat(function(d) { return d })
    

    var gi = legend.append('g')
    gi.call(legendAxis);


    
gi.selectAll("rect")
.data(threshold.range().map(function(color) {
  var d = threshold.invertExtent(color);
  if (d[0] == null) d[0] = x.domain()[0];
  if (d[1] == null) d[1] = x.domain()[1];
  return d;
}))
.enter().insert("rect", ".tick")
  .attr("height", 30)
  .attr("x", function(d) { return x(d[0]); })
  .attr("width", function(d) { return (x(d[1]) - x(d[0])); })
  .attr("fill", function(d) { return threshold(d[0]); })
  




        


    


}

createChart();