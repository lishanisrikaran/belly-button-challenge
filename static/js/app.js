// The following script is broken down into X sections, please see below contents for easier navigation:

// CONTENTS:
// Section 1 - Connecting to the API and accessing it's data.
// Section 2 - Adding dropdown options to the Belly Button Diversity Dashboard.
// Section 3 - Creating a Dynamic: Bar Plot, Bubble Chart, and Demographic Info Tile for the Belly Button Diversity Dashboard.
// Section 4 - Default plots.



// -------------------------------------------------------------------------------------------------------------------------------
// Section 1 - Connecting to API and accessing it's data.

// Defines a constant that stores the belly button biodiversity API link.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Retrieves the JSON data from the host and outputs a message in console to confirm if the promise has been fulfilled.
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Retrieves the JSON data and console logs it (in the sequence stated).
d3.json(url).then(function(data) {
    console.log(data);
});

// -------------------------------------------------------------------------------------------------------------------------------
// Section 2 - Adding dropdown options to the Belly Button Diversity Dashboard.

// Adding dropdown options for each individual in the dataset (this will appear visually, beneath 'Test Subject ID No.' on the index webpage [Belly Button Diversity Dashboard]). 

// Retrieves the belly button biodiversity JSON data.
d3.json(url).then(function(data) {
  
  // Extracts the names array from the belly button biodiversity JSON data, this array contains each individual's ID that will need to be added to the 'Test Subject ID No.'
  // dropdown menu.
  const names = data.names;

  // Selects the dropdown menu element ('selDataset' is the id of the dropdown menu's element in the webpage's HTML code). 
  const dropdownMenu = d3.select("#selDataset");

  // Selects all the option tags underneath the dropdown menu's HTML element and appends an option for each individual's ID in the names array.
  const options = dropdownMenu.selectAll("option").data(names);
  options.enter().append("option").text(name => name);
});

// -------------------------------------------------------------------------------------------------------------------------------
// Section 3 - Creating a Dynamic: Bar Plot, Bubble Chart, and Demographic Info Tile for the Belly Button Diversity Dashboard.

// Creates a dynamic bar plot, bubble chart, and demographic info tile with event handler.

// Calls optionChanged() function whenever the dropdown option is changed. 
d3.selectAll("#selDataset").on("change", optionChanged);

// optionChanged() function defined:
function optionChanged() {
  
    // Retrieves the selected subject ID's sample data for the bar chart and bubble chart:
  
    // Retrieves the belly button biodiversity JSON data.
    d3.json(url).then(function (data) {

      // Assigns the the selected dropdown ID to a constant which is retrieved from the dropdown menu elements' value.
      const selectedId = d3.select("#selDataset").property("value");
         
      // Filters the samples array contained within the belly button biodiversity JSON data; the first object where the id value matches the selected dropdown id is retrieved. 
      const selectedSample = data.samples.filter(sample => sample.id === selectedId)[0];

      
      // Trace 1 - Horizontal Bar Plot:
      
      // Extracts the bar chart data which required for plotting: (sample_values, otu_ids, otu_labels), slices the top 10 results for the selected sample and reverses their 
      // order to accommodate Plotly's defaults.
      // Note: The sample_values are already sorted by descending order in the JSON object. 
      const sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
      const otuIds = selectedSample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
      const otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();
      
      // Traces the subject ID's data and places into an array so it is ready for the horizontal bar plot's render. 
      const trace1 = [{
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: "bar",
        orientation: "h"
      }];
      
      // Applies title and axis labels to the bar plot's layout. 
      const barChartLayout = {
        title: "Top 10 OTUs found in the individual",
        xaxis: {
          title: "Sample Value",
        },
        yaxis: {
          title: "OTU ID",
        }
      };
      
      // Renders the bar plot to the div tag with id "bar".
      Plotly.newPlot("bar", trace1, barChartLayout);
    

      // Trace 2 - Bubble Chart:
      // Traces the subject ID's (sample_values, otu_ids, otu_labels) data and places into an array so it is ready for the bubble chart's render. 
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
      
       // Applies a title and axis labels to the bubble chart's layout.
      const bubbleChartLayout = {
        title: "Belly Button Biodiversity",
        xaxis: {
          title: "OTU ID",
        },
        yaxis: {
          title: "Sample Value",
        }
      };
    
    
      // Renders the bubble chart to the div tag with id "bubble".
      Plotly.newPlot("bubble", trace2, bubbleChartLayout);


      // Displays the metadata key-value pairs in the 'Demographic Info' tile.

      // Filters the metadata array contained within the belly button biodiversity JSON data; the first object where the id value matches the selected dropdown id is retrieved. 
      const selectedMetadata = data.metadata.filter(metadata => metadata.id === parseInt(selectedId))[0];

      // Assigns the demographic info tile's element to a constant and clears it's existing content.
      const demographicInfo = d3.select("#sample-metadata");
      demographicInfo.html(""); 

      // Appends a paragraph to the 'Demographic Info' tile's element for each key, value pair contained in the selected metadata object.
      Object.entries(selectedMetadata).forEach(([key, value]) => {
        demographicInfo.append("p").text(`${key}: ${value}`);
    });
  });
}
    
// -------------------------------------------------------------------------------------------------------------------------------
// Section 4 - Default plots for the Belly Button Diversity Dashboard.

// The Test Subject ID No.: 940 is always the initial value shown on the dropdown menu, therefore, if optionChanged() is called, the default data will default to sample one. 
// Note: the dropdown options originate from the names array which corresponds with the samples array order. 
optionChanged()
