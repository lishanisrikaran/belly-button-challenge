// -------------------------------------------------------------------------------------------------------------------------------
// Section 1 

// Defines a constant that stores the belly button biodiversity API link.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Retrieves the JSON data from the host and outputs a message to confirm if the promise has been furfilled.
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Retrieves the JSON data and console logs it (in the sequence stated).
d3.json(url).then(function(data) {
    console.log(data);
  });

// -------------------------------------------------------------------------------------------------------------------------------
// Section 2

// Adding dropdown options for each individual (This will appear visually, beneath'Test Subject ID No.' on the index webpage). 

// Retrieves the belly button biodiversity JSON data.
d3.json(url).then(function(data) {
  // Extracts each individual's ID which will be added to the webpage's dropdown.
  let names = data.names;

  // Selects the dropdown menu ('selDataset' is the id of the dropdown's element in the index.HTML code). 
  let dropdownMenu = d3.select("#selDataset");

  // Selects all the option tags underneath the dropdown menu element and appends to this list by adding each individual's ID.
  let options = dropdownMenu.selectAll("option").data(names);
  options.enter().append("option").text(name => name);
});

// -------------------------------------------------------------------------------------------------------------------------------
// Section 3

// Creates a dynamic bar plot with event handlers.

// Calls updatePlotly() function when the dropdown option is changed. 
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

      // Traces the individual's data and places into a array so it is ready for render. 
      const trace1 = [{
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: "bar",
        orientation: "h"
      }];

      // Applies title and margins to layout. 
      const layout = {
        title: "Top 10 OTUs found in the individual",
        margin: {
          l: 100,
          r: 50,
          t: 50,
          b: 50
        }
      };

      // Renders plot to the div tag with id "bar".
      Plotly.newPlot("bar", trace1, layout);
    });
  }


// -------------------------------------------------------------------------------------------------------------------------------
// Section 4 
// Sets the default bar plot to the first sample in the samples array:

// Retreives the belly button biodiversity JSON data.
d3.json(url).then(function (data) {
  const firstSample = data.samples[0];
  updatePlotly(firstSample);
});