import React, { Component } from "react";
import ReactMapboxGl, { Layer, Feature, Popup, ZoomControl } from "../src/index";

// import { parseString } from "xml2js";
// import { Map } from "immutable";
import config from "./config.json";
// import meals from "./meal.json";
import MapboxCSS from "../src/mapbox-css/mapbox-gl.css";

const { accessToken, style } = config;
const mealURL = "https://fb-mp-api.herokuapp.com/api/v1/services/";
const testURL = "https://data.seattle.gov/api/views/hmzu-x5ed/rows.json";

function splitString(stringToSplit, separator) {
  var arrayOfStrings = stringToSplit.split(separator);

  console.log('The original string is: ' + stringToSplit );
  console.log('The separator is: ' + separator );
  // console.log('The array has ' + arrayOfStrings.length + ' elements: ' + arrayOfStrings.join(' / '));
}

var tempestString = 'Oh brave new world that has such people in it.';
var monthString = 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec';

var space = ' ';
var comma = ',';
var array = '[';

// splitString(tempestString, space);
// splitString(tempestString);
// splitString(monthString, comma);
//
// fetch('API_ENDPOINT', OBJECT)
//   .then(function(res) {
//     return res.json();
//    })
//   .then(function(resJson) {
//     return resJson;
//    })
function getPrograms() {
  return fetch(mealURL, meals)
    .then(function(res) {
        return res.json();
      })
      .then(function(resJson) {
        console.log(resJson[1].address);
        return resJson;
       })
    // .then(data => {
    //   return new Promise((resolve, reject) => {
    //     JSON.parse(data, (err, res) => {
    //       console.log('Data '+ data);
    //       if(!err) {
    //         resolve(res.data);
    //           // console.log('RES '+ JSON.stringify(res));
    //         // console.log(data[1[0]]);
    //         //   console.log(data[0].data);
    //         //     console.log(data[3]);
    //       } else {
    //         reject(err);
    //       }
    //     });
    //   });
    // })
}

const containerStyle = {
  height: "100vh",
  width: "100vw"
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

  state = {
    center: [-122.3321, 47.6062],
    zoom: 11,
    skip: 0,
    meals: new Map()
  };

  componentWillMount() {
    getPrograms(meals).then(res => {
      this.setState(({ meals }) => ({
        meals: meals.merge(res.reduce((acc, meal) => {
          return acc.set(meal.id[0], new Map({
            id: meal.id[0],
            name: meal.name[0],
            // position: [ parseFloat(meal.longitude[0]), parseFloat(meal.latitude[0]) ],
            address: parseInt(meal.address[0]),
            slots: parseInt(meal.data.day[0])
          }))
        }, new Map()))
      }));
    });
  };

  _markerClick = (meal, { feature }) => {
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
    const { meals,meal, skip, end } = this.state;

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
              <Popup key={data.get("id")} coordinates={meal.get("position")} closeButton={true}>
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
