// Defines a constant called URL which equates to the API URL that stores the belly button biodiversity JSON data.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Retrieves the JSON data from the host and outputs a message to confirm if the promise has been furfilled.
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Retrieves the JSON data and console logs it (in the sequence stated).
dataPromise.then(function(data) {
    console.log(data);
  });
  
// -------------------------------------------------------------------------------------------------------------------------------

// Initialising the page with a default bar plot.

// Creates the init() function which fetches the JSON data and then performs a series of steps with it to plot the initial bar plot.
function init() {
  dataPromise.then(function(data) {
    // Extracts the necessary data for the bar plot.
    const sampleData = data.samples[0];            // Extracts the first element from the 'samples' array.

    const sampleValues = sampleData.sample_values; //Will be used as the values of the bar chart.
    const otuIds = sampleData.otu_ids;             //Will be used as the labels of the bar chart.
    const otuLabels = sampleData.otu_labels;       //Will be used as the hovertext of the bar chart.

    // Now each of the chart elements have been collected, they need to be arranged into an array of objects. 
    // Initialises the sortedData array to store the objects within.
    const sortedData = [];
    // Loops through each of the values in the extracted arrays (all of which are the same length) and push each values to a object,
    // eventually forming the array of objects.  
    for (let i = 0; i < sampleValues.length; i++) {
      sortedData.push({
        sampleValues: sampleValues[i],
        otuIds: otuIds[i],
        otuLabels: otuLabels[i]
      });
    }

    // Sorts the objects in the sortedData array by sample_value in descending order.
    sortedData.sort((a, b) => b.sampleValues - a.sampleValues);

    // Slices the first 10 objects for plotting.
    const slicedData = sortedData.slice(0, 10).reverse();

    // Trace1 for the sample data.
    const trace1 = {
      x: slicedData.map(object => object.sampleValues),
      y: slicedData.map(object => `OTU ${object.otuIds}`), // Uses a string literal to obtain requested y-axis labels.
      text: slicedData.map(object => object.otuLabels),
      name: "Sample",
      type: "bar",
      orientation: "h"
    };

    // Data array.
    const traceData = [trace1];

    // Applies a title to the layout.
    const layout = {
      title: "Top 10 OTUs found in selected individual",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    // Renders the plot to the div tag with id "bar".
    Plotly.newPlot("bar", traceData, layout);
  });}

init();