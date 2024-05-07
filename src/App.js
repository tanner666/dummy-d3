import React,{Component} from "react";
import "./App.css"
import Child1 from "./Child1"
import Child2 from "./Child2"
import Child3 from "./Child3"
import * as d3 from 'd3'
import tips from './tips.csv'
import NTDOY from './NTDOY.csv'

class App extends Component{
  constructor(props){
    super(props);
    this.state={
      data:[],
      numericalColumns: ["total_bill", "tip", "size"],
      categoricalColumns: ["sex", "smoker", "day", "time"],
      //defaults
      selected_numerical:"total_bill",
      selected_radio:"sex",
      graph_data:{},

    };
  }
  componentDidMount(){
    console.log("Pareeeent")
    console.log(d3.select('.parent').node()); // Check if the selection is null

    this.setState({graph_data: {
      "name": "Root",
      "children": [
        {
          "name": "Branch 1",
          "children": [
            {
              "name": "Leaf 1",
              "size": 10,
              "color": "red"
            },
            {
              "name": "Leaf 2",
              "size": 20,
              "color": "blue"
            }
          ]
        },
        {
          "name": "Branch 2",
          "children": [
            {
              "name": "Leaf 3",
              "size": 15,
              "color": "green"
            },
            {
              "name": "Leaf 4",
              "size": 25,
              "color": "purple",
              "children": [
                {
                  "name": "Subleaf",
                  "size": 5,
                  "color": "orange"
                }
              ]
            }
          ]
        }
      ]
    }})
    var self=this

    //must parse data since it is returned as string
    d3.csv(tips, function(d){
      return{
        ...d,
        tip:parseFloat(d.tip),
        total_bill:parseFloat(d.total_bill),
        day:d.day
      }
    }).then(function(csv_data){

      //this refers to the function, but we need the class, so we set a variable above
      self.setState({data:csv_data})
    })
    .catch(function(err){
      console.log(err)
    })
  }

  //called when component is mounted, called before componentDidMount
  render(){
    return(
    <div className="parent">
      <div className="child1"><Child1 data1={this.state.data} numericalColumns={this.state.numericalColumns} categoricalColumns={this.state.categoricalColumns}></Child1></div>
      <div className="child2"><Child2 ></Child2></div>
      <div className="child3"><Child3 data3={this.state.graph_data}></Child3></div>
    </div>);
  }
}

export default App