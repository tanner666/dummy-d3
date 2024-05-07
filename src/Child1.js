import React,{Component} from "react";
import * as d3 from "d3";
import "./App.css"

class Child1 extends Component{
  constructor(props){
    super(props);
    this.state={
        selected_numerical:"total_bill",
        selected_radio:"sex",
    };
  }

  //only called initially when component mounts
  componentDidMount(){
  }

  //called each time component is updated
  componentDidUpdate(){
    //numerical value, sex
    const selected_numerical = this.state.selected_numerical
    var data=this.props.data1
    let selected_radio = 'day';
    console.log("Props: ", this.props.data1);

    //group data
    const grouped = data.reduce((acc, item) => {
        //initialize the group if it doesn't already exist
        if (!acc[item[selected_radio]]) {
          acc[item[selected_radio]] = [];
        }
        //push the current items selected_numerical value to the group
        acc[item[selected_radio]].push(parseFloat(item[selected_numerical]));
        return acc;
      }, {});
  
      //calculate the average for each group and return as dict with averages
      const averages = Object.keys(grouped).map(key => {
        const sum = grouped[key].reduce((sum, current) => sum + current, 0);
        const average = sum / grouped[key].length;
        return { [selected_radio]: key, average };
      });

      console.log("Averages: ", averages)

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 30, left: 20 },
      w = 500 - margin.left - margin.right,
      h = 300 - margin.top - margin.bottom;
    
     // Check the format of the data in the conosole

    var container = d3
      .select(".child1_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_1")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X axis
    var x_data = averages.map((item) => item[selected_radio]);
    var x_scale = d3
      .scaleBand()
      .domain(x_data)
      .range([margin.left, w])
      .padding(0.2);

    container
      .selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale));

    console.log("averages: ", averages)

    // Add Y axis
    var y_scale = d3
      .scaleLinear()
      .domain([0, d3.max(averages, d => d.average)])
      .range([h, 0]);

    container
      .selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y_scale));

    container
      .selectAll("rect")
      .data(averages)
      .join("rect")
      .attr("x", d => x_scale(d.day))
      .attr("y", d => y_scale(d.average))
      .attr("width", x_scale.bandwidth())
      .attr("height", d =>  h - y_scale(d.average))
      .attr("fill", "#69b3a2");
  }

  //called when component is mounted, called before componentDidMount
  render(){
    return(
        <div>
            <div className="dropdown-container">
                <div className="dropdown">
                    <span className="dropdown-label">Select Target:</span>
                    <select className="dropdown-select" onChange={(event)=>this.setState({selected_numerical:event.target.value})} value={this.state.selected_numerical}>
                    {this.props.numericalColumns.map(column => (
                        <option key={column} value={column}>{column}</option>
                    ))}
                    </select>
                </div>
            </div>
            <svg className="child1_svg">
                <g className="g_1"></g>
            </svg>
        </div>
    )
  }
}

export default Child1;