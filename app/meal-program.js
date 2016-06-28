import React, { Component, PropTypes } from "react";
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from "../src/index";

// import { parseString } from "xml2js";
import { Map } from "immutable";
import config from "./config.json";
import meals from "./meal.json";
import MapboxCSS from "../src/mapbox-css/mapbox-gl.css";

const { accessToken, style } = config;
const mealURL = "https://fb-mp-api.herokuapp.com/api/v1/services/";
const testURL = "https://data.seattle.gov/api/views/hmzu-x5ed/rows.json";
var newC;



function getPrograms() {
  return fetch(mealURL)
    .then(res => res.json())
      // .then(function(resJson) {
      //   console.log(resJson[0])
      //   return resJson[0];
      //  })
    .then(data => {
      return new Promise((resolve, reject) => {
        JSON.stringify(data, (err, res) => {
          const meals= data


          console.log('Data ', meals[1].address);
          if(!err) {
            resolve(res);
              // console.log('RES '+ JSON.stringify(res));
            // console.log(data[1[0]]);
            //   console.log(data[0].data);
            //     console.log(data[3]);
          } else {
            reject(err);
          }
        });
      });
    })
}


function getCoords() {
  return fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+meals[0].address+".json?types=address&access_token=pk.eyJ1IjoibHdlbmtlMDEiLCJhIjoiY2lweWZtNzYxMHh0ZGZ2bTJxcnhwaGFkZCJ9.IvRZkLoYUDbvHIV0Chq1mw")
    .then(res => res.json())

    .then(data => {
      return new Promise((resolve, reject) => {
        JSON.stringify(data, (err, res) => {

          const longitude = data.features[0].geometry.coordinates[0];
          const latitude = data.features[0].geometry.coordinates[1];
          newC = [data.features[0].geometry.coordinates[0],data.features[0].geometry.coordinates[1]];

          console.log(newC);

          if(!err) {
            resolve(res);
              // console.log('RES '+ JSON.stringify(res));
            console.log('new ',res);
            //   console.log(data[0].data);
            //     console.log(data[3]);
          } else {
            reject(err);
          }
        });
      });
    })
}
getCoords();
console.log(getCoords());

const containerStyle = {
  height: "100vh",
  width: "75vw"
};

const styles = {
  button: {
    cursor: "pointer"
  },

  mealDescription: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px 0px",
    textAlign: "center",
    backgroundColor: "white"
  },

  popup: {
    background: "#fff",
    padding: "5px",
    borderRadius: "2px"
  }
}

// const maxBounds = [
//       [-0.481747846041145,51.3233379650232], // South West
//       [0.23441119994140536,51.654967740310525], // North East
// ];

export default class MealProgram extends Component {
  // constructor(props){
  //   super(props);
    // console.log(props);

  state = {
    center: [-122.3321, 47.6062],
    zoom: 11,
    skip: 0,
    meals: new Map()
  };
// }
// componentDidMount(){
//     if (this.props.map) {
//       console.log(this.props.map);
//       this.getPrograms(this.props.map)
//     }
//   }

  componentWillMount() {
    getPrograms().then(res => {
      this.setState(({ meals: meals }) => ({
        meals: meals.merge(res.reduce((acc, meal) => {
          console.log('meal ',meal.address);

          return acc.set(meal.name, new Map({
            address: meal.address,
            name: meal.name,
            position: newC
            
              // position: getCoords(meal.address)


          }))
        }, new Map()))
      }));
    });
  };
// Map.addControl(new mapboxgl.Geocoder());

  _markerClick = (meal, { feature }) => {

    console.log(feature);
    console.log(meal);
    this.setState({
      center: feature.geometry.coordinates,
      zoom: 14,
      meal
    });
  };

  _onDrag = () => {
    if (this.state.meal) {
      this.setState({
        meal: null
      });
    }
  };

  _setMove = (end) => {
    if(end !== this.state.end)
      this.setState({ end });
  };

  _onToggleHover(cursor, { map }) {
    map.getCanvas().style.cursor = cursor;
  }

  _onControlClick = (map, zoomDiff) => {
    const zoom = map.getZoom() + zoomDiff;
    this.setState({ zoom });
  };

  render() {
    const { meals, meal, skip, end } = this.state;

    return (
      <div>
        <ReactMapboxGl
          style={style}
          center={this.state.center}
          zoom={this.state.zoom}
          minZoom={8}
          maxZoom={15}
          // maxBounds={maxBounds}
          accessToken={accessToken}
          onDrag={this._onDrag}
          onMoveEnd={this._setMove.bind(this, true)}
          onMove={this._setMove.bind(this, false)}
          containerStyle={containerStyle}>

          <ZoomControl
            zoomDiff={1}
            onControlClick={this._onControlClick}/>

          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}>
            {
              meals
                .map((meal, index) => (

                  <Feature
                    key={meal.get("id")}
                    onHover={this._onToggleHover.bind(this, "pointer")}
                    onEndHover={this._onToggleHover.bind(this, "")}
                    onClick={this._markerClick.bind(this, meal)}
                    coordinates={meal.get("position")}/>
                )).toArray()
            }
          </Layer>

          {
            meal && end && (
              <Popup key={meal.get("name")} coordinates={meal.get("position")} closeButton={true}>
                <span style={styles.popup}>
                  {meal.get("name")}
                </span>
              </Popup>
            )
          }
        </ReactMapboxGl>

        {
          meal && end && (
            <div style={styles.mealDescription}>
              <p>{ meal.get("name") }</p>
              // <p>{ meal.get("bikes") } bikes / { meal.get("slots") } slots</p>
            </div>
          )
        }
      </div>
    )
  }
}
