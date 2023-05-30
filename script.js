(function() {

  
  var margin = {top:0, left :0 , right:0, bottom:0},
  height=400 - margin.top-margin.bottom,
  width = 800 - margin.left- margin.right;
  ///////////////////LEGENDA/////////////////////
  var colors = ["#FFB6C1", "#F08080", "#CD5C5C", "#B22222", "#8B0000"];
  var legend = d3.select("#legend");

var legendItems = legend.selectAll(".legend-item")
  .data(colors)
  .enter()
  .append("div")
  .attr("class", "legend-item");

legendItems.append("div")
  .attr("class", "legend-color")
  .style("background-color", function(d) { return d; });

legendItems.append("div")
  .attr("class", "legend-label")
  .text(function(d, i) { return "Category " + (i + 1); });
///////////MAPA/////////////////////////////////////////////
  var svg=d3.select("#map")
    .append("svg")
    .attr("height",height+margin.top+margin.bottom)
    .attr("width", width+margin.left+margin.right)
    .append("g")
    .attr("transform","translate("+margin.left + "," + margin.top + ")");

    d3.queue()
      .defer(d3.json,"usa-topojson.json")
      .defer(d3.json,"bolest.json")
      .await(ready)

 var projection = d3.geoAlbersUsa()
  .translate([width/2,height/2])
  .scale(850)
  
  
  var path=d3.geoPath()
    .projection(projection)

    function ready(error,data,mydata)
    {
      var states = topojson.feature(data, data.objects.states).features
      states.forEach(function(state) {
        var stateName = state.properties.name;
        //console.log(stateName);
        
    
        // Pronalaženje podataka za određenu državu u "bolestData"
       var stateData = mydata.find(function(d) {
         
          return d.State === stateName;
        });

        
    
        // Ako se podaci pronađu, dodajte ih kao svojstva države
        if (stateData) {
          state.properties.deaths = stateData.Deaths;
          state.properties.ageAdjustedDeathRate = stateData["Age-adjusted Death Rate"];
          state.properties.causeName=stateData["Cause Name"];
          // Dodajte ostale željene podatke na isti način
        }
      });
      //console.log(data.objects.states.geometries[0].properties.name);
      //console.log(mydata)
      //console.log(states)

      svg.selectAll(".state")
        .data(states)
        .enter().append("path")
        .attr("class", "state")
        .attr("d", path)
        .on("mouseover", function(d) {
          // Prikaz popouta s vrijednostima iz podataka države
          var deaths = d.properties.deaths || "N/A";
          var ageAdjustedDeathRate = d.properties.ageAdjustedDeathRate || "N/A";
          var causeName =d.properties.causeName || "N/A";
          // Prikaz ostalih željenih podataka
          d3.select("#popup")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .html("Deaths: " + deaths + "<br>Age-Adjusted Death Rate: " + ageAdjustedDeathRate +"<br>Cause name: " + causeName)
          .style("display", "block");
      })
      .on("mouseout", function() {
        // Sakrij popout kada se miš pomakne iznad države
        d3.select("#popup").style("display", "none");
      });
        
       ///////////////////SLIDER-BAR/////////////////////
      var slider = document.getElementById("slider");
      var sliderValue = document.getElementById("slider-value");
      var finalValue= 2017;
      slider.oninput = function() {
        sliderValue.textContent = this.value;
        
     };
     slider.onchange = function() {
  
      finalValue = this.value;
      
     
      console.log("Final value: " + finalValue);
      
      
    };
     

   
     
     

      ///////////////////////DROPDOWNBUTTON//////////////////////
      
      var dropdownButton = document.querySelector('.dropdown-button');
      var dropdownMenu = document.querySelector('.dropdown-menu');
      var dropdownOptions = dropdownMenu.querySelectorAll('a');

      dropdownButton.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
      });   
      
      var selectedOption;
      dropdownOptions.forEach(function(option) {
        option.addEventListener('click', function() {
        selectedOption = option.textContent;
        console.log('Selected option:', selectedOption);
        return selectedOption;
        });
      }); 
      
    
      window.addEventListener('click', function(event) {
        if (!dropdownButton.contains(event.target)) {
          dropdownMenu.style.display = 'none';
        }
      
      }); 
     
      





    }
    

})();