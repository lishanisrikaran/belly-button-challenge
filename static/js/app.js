// The following script is broken down into X sections, please see below contents for easier navigation:
// Section 1 - Connecting to API and accessing it's data.
// Section 2 - Adding dropdown options.
// Section 3 - Creating Dynamic Bar Plot and Bubble Chart.
// Section 4 - Default plots.



// -------------------------------------------------------------------------------------------------------------------------------
// Section 1 - Connecting to API and accessing it's data.

// Defines a constant that stores the belly button biodiversity API link.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Retrieves the JSON data from the host and outputs a message in console to confirm if the promise has been furfilled.
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Retrieves the JSON data and console logs it (in the sequence stated).
d3.json(url).then(function(data) {
    console.log(data);
});

// -------------------------------------------------------------------------------------------------------------------------------
// Section 2 - Adding dropdown options.

// Adding dropdown options for each individual (This will appear visually, beneath'Test Subject ID No.' on the index webpage). 

// Retrieves the belly button biodiversity JSON data.
d3.json(url).then(function(data) {
  
  // Extracts each individual's ID which will be added to the webpage's dropdown menu.
  let names = data.names;

  // Selects the dropdown menu ('selDataset' is the id of the dropdown's element in the index.HTML code). 
  let dropdownMenu = d3.select("#selDataset");

  // Selects all the option tags underneath the dropdown menu element and appends to this list by adding each individual's ID.
  let options = dropdownMenu.selectAll("option").data(names);
  options.enter().append("option").text(name => name);
});

// -------------------------------------------------------------------------------------------------------------------------------
// Section 3 - Creating Dynamic Bar Plot and Bubble Chart.

// Creates a dynamic bar plot and bubble chart with event handlers.

// Calls updatePlotly() function whenever the dropdown option is changed. 
d3.selectAll("#selDataset").on("change", updatePlotly);

// updatePlotly() function defined:
function updatePlotly() {
  
    // Retreives the belly button biodiversity JSON data.
    d3.json(url).then(function (data) {

      // Assigns the dropdown option's element to a constant and extracts it's value.
      const dropdownMenu = d3.select("#selDataset");
      const selectedSampleId = dropdownMenu.property("value");
         
      // Looks at the samples array which is contained with the belly button biodiversity JSON data and extracts the first object where the 
      // id matches the selected dropdown id. 
      const selectedSample = data.samples.filter(individual => individual.id === selectedSampleId)[0];

      // Extracts each of the chart elements required: (sample_values, otu_ids, otu_labels) and slices the top 10 results of each 
      // and reverses their order to accommodate Plotly's defaults.
      const sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
      const otuIds = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
      const otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();


      // Trace 1 - Bar Chart:
      // Traces the individual's data and places into an array so it is ready for the bar chart's render. 
      const trace1 = [{
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: "bar",
        orientation: "h"
      }];
      // Applies title and margins to bar chart layout. 
      const barLayout = {
        title: "Top 10 OTUs found in the individual",
        margin: {
          l: 100,
          r: 50,
          t: 50,
          b: 50
        }
      };
      // Renders the bar plot to the div tag with id "bar".
      Plotly.newPlot("bar", trace1, barLayout);
    

      // Trace 2 - Bubble Chart:
      // Traces the individual's data and places into an array so it is ready for the bubble chart's render. 
      const trace2 = [{
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        text: selectedSample.otu_labels,
        mode: 'markers',
        marker: {
          size: selectedSample.sample_values,
          color: selectedSample.otu_ids,
          colorscale: 'Earth' 
        }
       }];
      // Applies a title and layout to the bubble chart.
      const bubbleLayout = {
        title: "Bubble Chart - Belly Button Biodiversity",
        xaxis: {
          title: "OTU ID",
        },
        yaxis: {
          title: "Sample Value",
        }
    };
    // Renders the bubble chart to the div tag with id "bubble".
    Plotly.newPlot("bubble", trace2, bubbleLayout);
    
  });
    
};
  
// -------------------------------------------------------------------------------------------------------------------------------
// Section 4 - Default plots.

// Sets the default bar plot and bar chart to use the data from the first sample in the samples array:

// Retreives the belly button biodiversity JSON data.
d3.json(url).then(function (data) {
  // Sets the default sample to be the first object in the samples array.
  const defaultSample = data.samples[0];
  // Calls updatePlotly() function with the defaultSample as it's parameter.
  updatePlotly(defaultSample);
});


