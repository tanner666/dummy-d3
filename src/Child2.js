import React, { Component } from "react";
import * as d3 from "d3";
import NTDOY from "./NTDOY.csv";
import { sliderBottom } from 'd3-simple-slider';

class Child2 extends Component {
    constructor(props){
        super(props)
        this.state={original_data:[],filtered_data:[]}
    }
componentDidMount(){
    d3.csv(NTDOY).then((data) => {
        const parseDate = d3.timeParse("%Y-%m-%d");
        data.forEach((d) => {
          d.Date = parseDate(d.Date);
          d.Close = +d.Close;
        })
        this.setState({original_data:data,filtered_data:data})
    })
}
  componentDidUpdate() {
    var data=this.state.filtered_data
    const margin = { top: 70, right: 60, bottom: 50, left: 80 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    //this defines the data for the x and y variables
    //this is used later when the line/graph is actually created
    // this is just defining the scale type and range, not the data yet
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // chart-container == graph  chart-container is an html id
    console.log(`Translate values: ${margin.left}, ${margin.top}`)

    const svg = d3.select("#chart-container")
      //selects all svg elements WITHIN the chart-container div
      .selectAll("svg")
      //binds a single item array to the selection, ensuring that only one SVG element exists
      .data([null])
      //join is used to handle the enter, update, and exit selections
      //ensures a svg is created if one doesn't exist, or updates an existing one
      .join("svg")
        //setting width and heigh of svg canvas
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      //selcts all group elements within the svg
      .selectAll("g")
      //binds a single item array to group element
      .data([null])
      //ensuers a group element is created/updated within the svg
      .join("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      //this is where the data is actually "mapped" to the previously defined scales
      x.domain(d3.extent(data, (d) => d.Date));
      y.domain([0, d3.max(data, (d) => d.Close)]);

      //this handles the creation of the x-axis group
      console.log(`Translate values: 0, ${height}`)

      svg.selectAll(".x-axis")
        .data([null])
        .join("g")
          //assigns a css class called x-axis to the x-axis group
          .attr("class", "x-axis")
          //this just further adjusts position of the axis
          .attr("transform", `translate(0,${height})`)
          //this is which axis it actually is relative to the graph
          .call(d3.axisBottom(x));

      //this handles the creation of the y-axis group
      console.log(`Translate values: ${width},0`)

      svg.selectAll(".y-axis")
        .data([null])
        .join("g")
          .attr("class", "y-axis")
          .attr("transform", `translate(${width},0)`)
          //this formating converts the integers to dollar format
          .call(d3.axisRight(y).tickFormat(d => isNaN(d) ? "" : `$${d.toFixed(2)}`));

      //this defines the line and area, based on the previously defined x and y variables
      const line = d3.line().x(d => x(d.Date)).y(d => y(d.Close));
      const area = d3.area().x(d => x(d.Date)).y0(height).y1(d => y(d.Close));

      svg.selectAll(".area")
        .data([data])
        .join("path")
          .attr("class", "area")
          .attr("d", area)
          .style("fill", "#85bb65")
          .style("opacity", 0.5);

      svg.selectAll(".line")
        .data([data])
        .join("path")
          .attr("class", "line")
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", "#85bb65")
          .attr("stroke-width", 1);

          const sliderRange = sliderBottom()
          .min(d3.min(data, d => d.Date))
          .max(d3.max(data, d => d.Date))
          .width(300)
          .tickFormat(d3.timeFormat('%Y-%m-%d'))
          .ticks(3)
          .default([d3.min(data, d => d.Date), d3.max(data, d => d.Date)])
          .fill('#85bb65')
          .on('onchange', val => {
              const f_data = this.state.original_data.filter(d => d.Date >= val[0] && d.Date <= val[1]);
              this.setState({filtered_data:f_data})
          });
  
        const gRange = d3.select('.slider-range').attr('width', 500).attr('height', 100)
        .selectAll('.slider-g').data([null]).join('g').attr('class', 'slider-g').attr('transform', 'translate(90,30)');
  
        gRange.call(sliderRange);     

  }

  render() {
    return <div>
            <svg className="slider-range"></svg>
            <div id="chart-container"></div>
        </div>;
  }
}

export default Child2;