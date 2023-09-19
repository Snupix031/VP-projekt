(function() {

  
  var margin = {top:0, left :0 , right:0, bottom:0},
  height=400 - margin.top-margin.bottom,
  width = 800 - margin.left- margin.right;
  ///////////////////LEGENDA/////////////////////
  var colors = ["#FFB6C1", "#F08080", "#CD5C5C", "#B22222", "#8B0000"];
  var sliderFinal = 1999;
  var selectedOption ="Unintentional injuries";
  var legend = d3.select(".legend");
  var deathRate = ["<20","<30","<40","<50","50+"];
  

  
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
  
  
  .text(function(d, i) { 
    
    
    
     return "Age-adjusted Death Rate: " + deathRate[i];
   
     });
///////////MAPA/////////////////////////////////////////////
  var svg=d3.select("#map")
    .append("svg")
    .attr("height",height+margin.top+margin.bottom)
    .attr("width", width+margin.left+margin.right)
    .append("g")
    .attr("transform","translate("+margin.left + "," + margin.top + ")");

    d3.queue()
      .defer(d3.json,"usa-topojson.json")
      .defer(d3.json,"csvjson.json")
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
         
          return d.State === stateName && d.Year === sliderFinal && d["Cause Name"] === selectedOption;
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
      
      .attr("fill", function(d) {
        var stateName = d.properties.name;
      
        var stateData = mydata.find(function(data) {
          
          
          return data.State === stateName;
        })
        
      if (stateData) {
          var deathRate = stateData["Age-adjusted Death Rate"];
           return getColor(deathRate);
        } 
        
      });
      
        
        function getColor(deathRate) {
          
          if (deathRate < 20) {
            return colors[0];
          } else if (deathRate < 30) {
            return colors[1];
          } else if (deathRate < 40) {
            return colors[2];
          } else if (deathRate < 50) {
            return colors[3];
          } else {
            return colors[4];
          }
        }
        
       ///////////////////SLIDER-BAR/////////////////////
      
       var slider = d3.select(".slider");
       var sliderValue = d3.select(".slider-value");
       sliderValue.text(slider.property("value"));
       
       slider.on("input", function () {
        sliderValue.text(slider.property("value"));
        sliderFinal = +slider.property("value");
        redrawMap();
        
       });
     

   
     
     

      ///////////////////////DROPDOWNBUTTON//////////////////////
      
      var dropdownButton = document.querySelector('.dropdown-button');
      var dropdownMenu = document.querySelector('.dropdown-menu');
      var dropdownOptions = dropdownMenu.querySelectorAll('a');

      dropdownButton.addEventListener('click', function() {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        //console.log(sliderFinal);
      });   
      
      
      dropdownOptions.forEach(function(option) {
        option.addEventListener('click', function() {
        selectedOption = option.textContent;
        if(selectedOption === "Chronic lower respiratory diseases")
        {
          selectedOption="CLRD"
        }
        console.log(selectedOption);
        updateSelectedOptionDisplay();
        redrawMap();
        
        
        });
      }); 
      
    
      window.addEventListener('click', function(event) {
        if (!dropdownButton.contains(event.target)) {
          dropdownMenu.style.display = 'none';
        }
      
      }); 
      function showPopup(deaths, ageAdjustedDeathRate, state ) {
        popup
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .html("Deaths: " + deaths + "<br>Age-Adjusted Death Rate: " + ageAdjustedDeathRate + "<br>State: " + state)
          .style("display", "block");
      }
      
      // Funkcija za skrivanje popup prozora
      function hidePopup() {
        popup.style("display", "none");
      }
      var popup = d3.select(".popup");
      function redrawMap() {
        svg.selectAll(".state")
          .attr("fill", function (d) {
            var stateName = d.properties.name;
      
            var stateData = mydata.find(function (data) {
              return data.State === stateName && data.Year === sliderFinal && data["Cause Name"] === selectedOption;
            });
      
            if (stateData) {
              var deathRate = stateData["Age-adjusted Death Rate"];
              
              
                return getColor(deathRate);
              
            }
          })
          .on("mouseover", function(d) {
            var stateName = d.properties.name;
      
            var stateData = mydata.find(function (data) {
              return data.State === stateName && data.Year === sliderFinal && data["Cause Name"] === selectedOption;
            });
      
            if (stateData) {
              var deaths = stateData.Deaths || "N/A";
              var state = stateData.State|| "N/A";
              var ageAdjustedDeathRate = stateData["Age-adjusted Death Rate"] || "N/A";
              showPopup(deaths, ageAdjustedDeathRate, state);
            }
          })
          .on("mouseout", function() {
            hidePopup();
          });
          
          
      }

      
      function updateSelectedOptionDisplay() {
        var selectedOptionDisplay = document.getElementById("selectedOptionDisplay");
        selectedOptionDisplay.textContent = selectedOption;
      }
     
   
      updateSelectedOptionDisplay();



    }
    

})();
