function BarChart(){
	var data = [4, 8, 15, 16, 23, 42];
	var width = 420, 
		barHeight = 20;
	var x = d3.scale.linear()
			.domain([0, d3.max(data)])
			.range([0, width]);

	var d3Canvas = d3.select(".bar_chart");
	this.setSize = function(w, bh){
		width = w;
		barHeight = bh;
		return this;
	}

	this.setData = function(d){
		data = d;
		return this;
	}

	this.draw = function(){
		// console.log(width);
    	var chart = d3Canvas.attr("width", width)
    					.attr("height", barHeight * data.length);

    	var bar = chart.selectAll("g")
    				.data(data)
    				.enter().append("g")
    				.attr("transform", function(d, i){
    					return "translate(0," + i * barHeight + ")";
    				});
    	bar.append("rect")
    		.attr("width", x)
    		.attr("height", barHeight - 1);

    	bar.append("text")
    		.attr("x", function(d) {return x(d) - 3; })
    		.attr("y", barHeight/2)
    		.attr("dy", ".35em")
    		.text(function (d) {return d; })
    	return this;
	}

}

function PieChart(){
	var data = [{"label":"one", "value":20}, 
            {"label":"two", "value":50}, 
            {"label":"three", "value":30}];
    var w = 300,                        //width
    	h = 300,                        //height
    	r = 100,                        //radius
    color = d3.scale.category10();     //builtin range of colors
    var svgCanvas = d3.select(".pie_chart");

    this.draw = function(){
	    var vis = svgCanvas
	        .data([data])                   //associate our data with the document
	            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
	            .attr("height", h)
	        .append("g")                //make a group to hold our pie chart
	            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius
	 
	    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
	        .outerRadius(r);
	 
	    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
	        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array
	 
	    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
	        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
	        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
	        .append("g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
	        .attr("class", "slice");    //allow us to style things in the slices (like text)
	 
	        arcs.append("path")
	                .attr("fill", function(d, i) { return color(i); } ) 
	                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
	 
	        arcs.append("text")                                     //add a label to each slice
	                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
	                //we have to make sure to set these before calling arc.centroid
	                d.innerRadius = 0;
	                d.outerRadius = r;
	                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
	            })
	            .attr("text-anchor", "middle")                          //center the text on it's origin
	            .text(function(d, i) { return data[i].label; });        //get the label from our original data array
	}

}


