// graph_data(name)
// Define the dimensions of the visualization. 
// We're using a size that's convenient for displaying the graphic on
var margin  = {top: 10, right: 5, bottom: 10, left: 100},
    width   = 1600-margin.left-margin.right,
    height  = 1100-margin.top-margin.bottom;   
//We start off by creating an SVG
// container to hold the visualization. We only need to specify
// the dimensions for this container.
var svg = d3.select("#new_container").append("svg")
  .attr("width",width)
  .attr("height",height);

//color
var color = d3.scale.category10();

//create the tooltip that holds the country name
var tooltip = d3.select('#new_container').append('div') .attr("class","tooltip")
      .style({
        'background' : 'orangered',
        'color':'white',
        'width':"90px",
        });
const main_getCoauthors = async (name) => {
  const resp = await fetch(`https://dblp.org/search/publ/api?q=${name}&format=json`)
  const respdata = await resp.json();
  const result = respdata.result.hits.hit;
  const final = result.filter((doc) => {
      let co_authors = doc.info.authors.author
      let flag = 0;
      for (let i = 0; i < co_authors.length; i++) {
          if (co_authors[i].text === name) {
              flag = 1;
              break;
          }
      }
      return flag == 1
  })
  const co_authors = final.map((doc) => {
      const array_authors = doc.info.authors.author;
      const temp = array_authors.map((doc) => {
          return doc.text
      })

      return temp
  })

//filtering this co authors array further to only names (non repeating)
  let children = []
  let temp = []
  for(let i=0;i<co_authors.length;i++)
  {
    const filter = co_authors[i].filter(obj=>{
      return obj!=name;
    })
    filter.forEach(ele => {
      if(temp.includes(ele))
      {
        console.log("repeated");

      }
      else{
        temp.push(ele);
        children.push(ele)

      }
    });
  }
  children.push(name);
  // console.log(children);
  return children;
}
const graph_data = async(name)=>{
  console.log(name);
  let final_object ={}
  let nodes_array = []    //array of object and each object has name : author_name 
  let links_array  = []   //each object and each object has target:index(author) and source :index(author)

  const Coauthors = await main_getCoauthors(name);
  for(i in Coauthors)
  {
    const network_array = await main_getCoauthors(Coauthors[i])
    const temp = network_array.filter(auth =>{
      return Coauthors.includes(auth)
    })
    temp.forEach(ele => {
      links_array.push({target:Coauthors.indexOf(ele),source:Number(i)})
    });
    nodes_array.push({name:Coauthors[i]})
  }
  final_object.nodes = nodes_array;
  final_object.links = links_array;
  // console.log(nodes_array);
  // console.log(links_array);
   console.log(final_object);

d3.json(final_object,async function(data){
  // Extract the nodes and links from the data.
  var nodes = await final_object["nodes"];
  console.log(final_object);
  var links = final_object["links"];
  
  // Now we create a force layout object and define its properties.
  // Those include the dimensions of the visualization and the arrays
  // of nodes and links.
  var force = d3.layout.force()
    .size([width,height])
    .nodes(d3.values(nodes))
    .links(links)
    .on("tick",tick)
// There's one more property of the layout we need to define,
// its `linkDistance`. That's generally a configurable value and,
// for a simple example, we'd normally leave it at its default.
// Unfortunately, the default value results in a visualization
// that's not especially clear. This parameter defines the
// distance (normally in pixels) that we'd like to have between
// nodes that are connected. (It is, thus, the length we'd
// like our links to have.)
    .linkDistance(500)
//now so it's time to turn
// things over to the force layout. Here we go.
    .start();
  
// Next we'll add the nodes and links to the visualization.
// Note that we're just sticking them into the SVG container
// at this point. We start with the links. The order here is
// important because we want the nodes to appear "on top of"
// the links. SVG doesn't really have a convenient equivalent
// to HTML's `z-index`; instead it relies on the order of the
// elements in the markup. By adding the nodes after the
// links we ensure that nodes appear on top of links.

// Links are pretty simple. They're just SVG lines, and
// we're not even going to specify their coordinates. (We'll
// let the force layout take care of that.) Without any
// coordinates, the lines won't even be visible, but the
// markup will be sitting inside the SVG container ready
// and waiting for the force layout.
  var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr("class","link")
    .style("stroke-width", function(d) { return Math.sqrt(d.name); })
      .style("stroke", function(d) { return color(d.name); });;
  
  // Now it's the nodes turn. Each node is drawn as a flag.

    // Create the groups under svg
  var gnodes = d3.select('#flags').selectAll('g.gnode')
  .data(graph.nodes)
  .enter()
  .append('g')
  .classed('gnode', true);

  // Add one circle in each group
  var node = gnodes.append("circle")
  .attr("class", "node")
  .attr("r", 5)
  .call(force.drag)

  
  //we call some classes to handle the mouse
    .on('mouseover', mouseoverHandler)
    .on("mousemove",mouseMoving)
    .on("mouseout", mouseoutHandler);

    // Append the labels to each group
  var labels = gnodes.append("text")
  .text(function(d) {
    return d.name;
  });
  // We're about to tell the force layout to start its
  // calculations. We do, however, want to know when those
  // calculations are complete, so before we kick things off
  // we'll define a function that we want the layout to call
  // once the calculations are done.
  function tick(e){
    // First let's reposition the nodes. As the force
    // layout runs it updates the `x` and `y` properties
    // that define where the node should be positioned.
    // To move the node, we set the appropriate SVG
    // attributes to their new values. 
     
    
    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.
    link.attr('x1', function(d){ return  d.source.x})
        .attr('y1',function(d){ return  d.source.y})
        .attr('x2', function(d){ return  d.target.x})
        .attr('y2',function(d){ return   d.target.y})
  }
  
  //hover over a flag
  //the tooltip with the name of the country is going to show up

  function mouseoverHandler (d) {
     tooltip.transition().style('opacity', .9)
     tooltip.html('<p>' + d["name"]+'</p>' );
  }
  //leaving a flag
  //the tooltip will disappear
  function mouseoutHandler (d) {
      tooltip.transition().style('opacity', 0);
  }

  function mouseMoving (d) {
      tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").style("color","white");
  }
})
}
graph_data(name);