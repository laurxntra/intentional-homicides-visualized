// Display of the visual bar chart
const width = 800;
const height = 500;
const margin = { top: 100, bottom: 50, left: 100, right: 100 };
const barPadding = 0.15;

// creates svg element in the <div id = "chart"> in our index.html
const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the CSV data --> creates the actual group bar chart
d3.csv("data/ecsData/intentionalHomicides.csv").then(function(data) {

    data.forEach(function(d) {
        d.Year = +d.Year;
        d["Intentional Homicides Male"] = +d["Intentional Homicides Male"];
        d["Intentional Homicides Female"] = +d["Intentional Homicides Female"];
        d["Intentional Homicides"] = +d["Intentional Homicides"];
    });

    // Set up scales of bar chart
    const xAxis = d3.scaleBand()
        .domain(data.map(function(d) {
          return d.Year;
        }))
        .range([0, width])
        .padding(barPadding);

    const yAxis = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d3.max([d["Intentional Homicides Male"], d["Intentional Homicides Female"], d["Intentional Homicides"]]);
        })])
        .range([height, 0]);

    // Distinguishes the bars && colors
    const category = ["Intentional Homicides Male", "Intentional Homicides Female", "Intentional Homicides"];
    const colors = d3.scaleOrdinal()
        .domain(category)
        .range(["#89CFF0","#FF69B4" , "#5D3FD3"]);

    // Creates the actual group bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d) {
          return "translate(" + xAxis(d.Year) + ",0)";
        })
        .selectAll("rect")
        .data(function(d) {
          return category.map(function(key) {
            return { key: key, value: d[key] };
          });
        })
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return xAxis.bandwidth() / category.length * category.indexOf(d.key);
        })
        .attr("y", function(d) {
          return yAxis(d.value);
        })
        .attr("width", xAxis.bandwidth() / category.length)
        .attr("height", function(d) {
          return height - yAxis(d.value);
        })
        .attr("fill", function(d) {
          return colors(d.key);
        });

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis));

    svg.append("g")
        .call(d3.axisLeft(yAxis));

    // label for title
    svg.append("text")
      .attr("x", (width + margin.left + margin.right) / 2.6)
      .attr("y", margin.top - 140)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("How are intentional homicide rates affected by male and female population(per 100,000) in Europe/Central Asia?");
    
    // label for x-axis
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Year");

    // label for y-axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 50)
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Number of Intentional Homicides");

    // Creates the legend that indicates what color bar represents in the data
    const legend = svg.selectAll(".legend")
        .data(category)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", function(d) {
          return colors(d);
        });

    legend.append("text")
        .attr("x", width - 10)
        .attr("y", 7)
        .attr("dy", ".30em")
        .style("text-anchor", "end")
        .text(function(d) {
          return d;
        });

}).catch(function(error) {
    console.error("Error loading CSV file:", error);
});
