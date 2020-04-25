//Creating the graphs all under one function.
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultlist = samples.filter(samples_data => samples_data.id == sample);
    var result = resultlist[0];

    var sample_values = result.sample_values;
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    
    // Build a Bubble Chart
    var Layout = {
      title: "Bacteria Cultures for each Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };
    var Data = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
        }
      }
    ];
  Plotly.newPlot("bubble", Data, Layout);

//creating a horizontal bar graph top 10 OTUs 
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10),
        text: otu_labels.slice(0, 10),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}
function demographic_info(i) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data to only include samples data
    var resultlist = metadata.filter(samples_data => samples_data.id == i);
    var result = resultlist[0];
    console.log(result);
    // select the panel with id of `#sample-metadata` in order display the data
    var PANEL = d3.select("#sample-metadata");

    // Using `.html("") to clear any existing metadata
    PANEL.html("");

    // new data
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });
  });
}
function init() {
  // Change the data set 
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    demographic_info(firstSample);
  });
}

function Changethedata(new_data) {
  // Using new data each time a new sample is selected
  buildCharts(new_data);
  buildMetadata(new_data);
}

// Initialize the dashboard
init();