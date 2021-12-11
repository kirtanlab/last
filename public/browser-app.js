let authorArray = [
  "Narayanan C. Krishnan",
  "R Nitin Auluck",
  "Neeraj Goel",
  "Deepti R. Bathula",
  "Puneet Goyal",
  "Balwinder Sodhi",
  "Mukesh Saini",
  "Ram Subramanian",
  "Shashi Shekhar Jha",
  "Sudarshan Iyengar",
  "Sujata Pal",
  "Shweta Jain",
  "Sudeepta Mishra",
  "Abhinav Dhall",
  "Apurva Mudgal",
  "T V Kalyan",
  "Anil Shukla",
];
let updatedArray = [];
var name;

//R Nitin Auluck
//Ram Subramanian
//T V Kalyan
//Ram Subramanian
//Sweta Jain

//INDEX FILE

const getname = async () => {
  //console.log("clicked");
  let auth_name = document.querySelector("input").value;
  name = auth_name;
  const api = await fetch("/api/v1/all");
  const api_data = await api.json();
  const array_data = api_data.result;
  // console.log(array_data);

  for (i in array_data) {
    if (array_data[i]._authName === name) {
      array_data[i]._year = await getyear(name);

      array_data[i]._pub = await getPublications(name);
    }
  }
  $(".profile-login").css("display", "block");
  $(".boxed").css("display", "block");

  for (i in array_data) {
    if (array_data[i]._authName === name) {
      let auth_name = array_data[i]._authName;
      let auth_email_id = array_data[i]._email;
      let auth_dblp_id = array_data[i]._dblp_id;
      //console.log("working");
      document.getElementById("index_faculty_name").textContent = auth_name;

      document.getElementById("index_email_id").textContent = auth_email_id;

      $("#index_dblp_id").attr("href", "faculty-profile.html");
      document.getElementById("index_dblp_id").textContent = "View Profile";
    }
  }
};
//console.log("name "+ name);
//sessionStorage.setItem("name", name);


//for director page
const getauthors = async () => {
  let start_year = document.getElementById("start_year").value;
  let end_year = document.getElementById("end_year").value;
  let number_pub = document.getElementById("number_pub").value;
  //console.log("start year "+ start_year+" end year "+ end_year+" number pub "+ number_pub);

  const api = await fetch(
    `/api/V1/specifics?Syear=${start_year}&Eyear=${end_year}&publications=${number_pub}`
  );
  const api_data = await api.json();
  const array_data = api_data.result;
  //console.log(array_data)

  //connecting to frontend

  /*making table*/

  res_buildTable();

  function res_buildTable() {
    var table = document.getElementById("res_myTable");
    table.innerHTML = "";
    //$('.table').css('display','');
    for (var i = 0; i < array_data.length; i++) {
      var row = `<tr>
                        <td id="td">${array_data[i]._authName}</td>
                        <td id="td">${array_data[i]._email}</td>
                        <td id="td"><a href="${array_data[i]._dblp_id}">${array_data[i]._dblp_id}</td>
                        <td id="td">${array_data[i]._pub}</td>
                        </tr>`;
      table.innerHTML += row;
      //console.log("pubs: ["+i+"]"+pubs[i]);
    }
  }
};


//fetching data and displaying it from dblp api
const getdata = async (name) => {
  const resp = await fetch(
    `https://dblp.org/search/publ/api?q=${name}&format=json`
  );
  const respdata = await resp.json();
  const result = respdata.result.hits.hit;
  const final = result.filter((doc) => {
    let co_authors = doc.info.authors.author;
    //console.log("cothors: "+ co_authors);
    let flag = 0;
    for (let i = 0; i < co_authors.length; i++) {
      if (co_authors[i].text === name) {
        flag = 1;
        break;
      }
    }
    return flag == 1;
  });

  //array of titles of publications
  const pubs = final.map((doc) => {
    return doc.info.title;
  });

  //array of years of publication published
  const year = final.map((doc) => {
    return doc.info.year;
  });

  //console.log("year"+year)

  //array of coauthors for table
  const co_authors = final.map((doc) => {
    const array_authors = doc.info.authors.author;
    const temp = array_authors.map((doc) => {
      return doc.text;
    });
    return temp;
  });

  //getURL

  const urls = final.map(doc=>{
    return doc.info.url;
  })

  const getURL = async (name)=>{
    const resp = await fetch(`https://dblp.org/search/publ/api?q=${name}&format=json`)
    const respdata = await resp.json();
    const result = respdata.result.hits.hit
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
  
  
  //console.log(urls);
    return urls;
  }



  /*NEW*/

  //Table data
  let cothors = co_authors;
  let url = urls;
  console.log(url);

  //console.log("cothor: " + cothors);

  //co-author list for co-author section
  const filtred_co_authos = final.map((doc) => {
    const array_authors = doc.info.authors.author;
    const temp = array_authors.map((doc) => {
      if (doc.text != name) {
        return doc.text;
      }
    });
    return temp;
  });
  let filtered_cothors = filtred_co_authos;//filtered list
  sessionStorage.setItem('myArray', filtered_cothors);
  //for(let i = 0; i < array.length; i++){
    //console.log("array["+i+"]: "+filtered_cothors[i]);
  //}

  //CONNECTING FRONT_END

  //publication
  buildTable();

  function buildTable() {
    var table = document.getElementById("myTable");
    table.innerHTML = "";
    for (var i = 0; i < year.length; i++) {
      var row = `<tr>
                        <td id="td">${year[i]}</td>
                        <td id="td">${pubs[i]}</td>
                        <td id="td">${cothors[i]}</td>
                        <td id="td"><a href="${url[i]}">${url[i]}</a></td>
                        </tr>`;
      table.innerHTML += row;
      //console.log("pubs: ["+i+"]"+pubs[i]);
    }
  }

  //publication completed

  //co_author section

  /*
  co_buildTable();

  function co_buildTable() {
    var co_table = document.getElementById("co_myTable");
    co_table.innerHTML = "";
    for (var i = 0; i < year.length; i++) {
      var co_row = `<tr>
                        <td id="td">${filtered_cothors[i]}</td>
                        </tr>`;
      co_table.innerHTML += co_row;
    }
  }
  
  //co_author end
  */


  //wordcloud
  //console.log('pubs: '+ pubs[0]);
  /*let names = ' ';
    for(let i=0;i < pubs.length;i++){
        names += pubs[i];
    }

    fetch(`https://quickchart.io/wordcloud?backgroundColor=black&text=${names}`)
        .then(res=>{return res.blob()})
        .then(blob=>{
        var img = URL.createObjectURL(blob);
        //console.log(img);
        document.getElementById('img').setAttribute('src', img);
    })
    */
  var img = `./IMG/${name}.png`;
  document.getElementById("img").setAttribute("src", img);
};
getdata(name);
//GET YEAR FROM DBLP API

const getyear = async (name) => {
  // console.log(result)
  const resp = await fetch(
    `https://dblp.org/search/publ/api?q=${name}&format=json`
  );
  const respdata = await resp.json();
  const result = respdata.result.hits.hit;
  const final = result.filter((doc) => {
    let co_authors = doc.info.authors.author;
    let flag = 0;
    for (let i = 0; i < co_authors.length; i++) {
      if (co_authors[i].text === name) {
        flag = 1;
        break;
      }
    }
    return flag == 1;
  });

  const year = final.map((doc) => {
    return doc.info.year;
  });

  // console.log(year);
  return year;
};

//GET PUBLICATION FROM DBLP API
const getPublications = async (name) => {
  const resp = await fetch(
    `https://dblp.org/search/publ/api?q=${name}&format=json`
  );
  const respdata = await resp.json();
  const result = respdata.result.hits.hit;
  const final = result.filter((doc) => {
    let co_authors = doc.info.authors.author;
    let flag = 0;
    for (let i = 0; i < co_authors.length; i++) {
      if (co_authors[i].text === name) {
        flag = 1;
        break;
      }
    }
    return flag == 1;
  });

  const pubs = final.map((doc) => {
    return doc.info.title;
  });
  return pubs.length;
};

//PROFILE BAR FOR faculty-proifle
const author = async (name) => {
  //console.log(name);
  //const result = await fetch(`/api/v1/author?name=${name}`)
  //const respdata = await result.json();
  //console.log(respdata);
  const api = await fetch("/api/v1/all");
  const api_data = await api.json();
  const array_data = api_data.result;
  //console.log(array_data); //working
  for (i in array_data) {
    if (array_data[i]._authName === name) {
      array_data[i]._year = await getyear(name);
      //console.log("year fun: " + array_data[i]._year);
      array_data[i]._pub = await getPublications(name);
      //console.log("deblp" + array_data[i]._dblp_id);
      //return
      //console.log(array_data[i]);
    }
  }

  //extract email,dblp id and name
  for (i in array_data) {
    if (array_data[i]._authName === name) {
      let auth_name = array_data[i]._authName;
      let auth_email_id = array_data[i]._email;
      let auth_dblp_id = array_data[i]._dblp_id;

      document.getElementById("faculty_name").textContent = auth_name;

      //$("#email_id").attr("href",auth_email_id);
      //$("#dbpl_id").innerHTML = auth_email_id;
      document.getElementById("email_id").textContent = auth_email_id;

      $("#dblp_id").attr("href", auth_dblp_id);
      //$("#dbpl_id").attr("value",auth_dblp_id);
      document.getElementById("dblp_id").textContent = auth_dblp_id;
    }
  }
};

author(name);
//console.log(name);




/*
const co_authors = final.map((doc) => {
    const array_authors = doc.info.authors.author;
    const temp = array_authors.map((doc) => {
        return doc.text
    })

    return temp
})
console.log(co_authors);
return co_authors;
}
*/
//console.log(getCoauthors(name))


//co-author list for  graph
const getCoauthors = async (name) => {
  const resp = await fetch(
    `https://dblp.org/search/publ/api?q=${name}&format=json`
  );
  const respdata = await resp.json();
  const result = respdata.result.hits.hit;
  const final = result.filter((doc) => {
    let co_authors = doc.info.authors.author;
    let flag = 0;
    for (let i = 0; i < co_authors.length; i++) {
      if (co_authors[i].text === name) {
        flag = 1;
        break;
      }
    }
    return flag == 1;
  });



  const co_authors = final.map((doc) => {
    const array_authors = doc.info.authors.author;
    const temp = array_authors.map((doc) => {
      return doc.text;
    });

    return temp;
  });
  console.log(co_authors);
  return co_authors;
};

const network = async (name) => {
  let data_array = await getCoauthors(name);
  //console.log("data: " + data_array);
  let object = { name: name };
  let children = [];
  let temp = [];
  for (let i = 0; i < data_array.length; i++) {
    const filter = data_array[i].filter((obj) => {
      return obj != name;
    });
    filter.forEach((ele) => {
      if (temp.includes(ele)) {
        //console.log("repeated");
      } else {
        temp.push(ele);
        children.push({ name: ele });
      }
    });
  }
  object.children = children;
  return object;
  // console.log(array);
};










//graph

//   var margin = {
//     top: 20,
//     right: 120,
//     bottom: 20,
//     left: 120
// },
// width = 960 - margin.right - margin.left,
// height = 800 - margin.top - margin.bottom;

//     var i = 0,
//         duration = 750,
//         rectW = 60,
//         rectH = 30;

//     var tree = d3.layout.tree().nodeSize([70, 40]);
//     var diagonal = d3.svg.diagonal()
//         .projection(function (d) {
//         return [d.x + rectW / 2, d.y + rectH / 2];
//     });

//     var svg = d3.select("#body").append("svg").attr("width", 1000).attr("height", 1000)
//         .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", redraw)).append("g")
//         .attr("transform", "translate(" + 350 + "," + 20 + ")");

//     //necessary so that zoom knows where to zoom and unzoom from
//     zm.translate([350, 20]);

//     root.x0 = 0;
//     root.y0 = height / 2;

//     function collapse(d) {
//         if (d.children) {
//             d._children = d.children;
//             d._children.forEach(collapse);
//             d.children = null;
//         }
//     }

//     root.children.forEach(collapse);
//     update(root);

//     d3.select("#body").style("height", "800px");

//     function update(source) {

//         // Compute the new tree layout.
//         var nodes = tree.nodes(root).reverse(),
//             links = tree.links(nodes);

//         // Normalize for fixed-depth.
//         nodes.forEach(function (d) {
//             d.y = d.depth * 180;
//         });

//         // Update the nodes…
//         var node = svg.selectAll("g.node")
//             .data(nodes, function (d) {
//             return d.id || (d.id = ++i);
//         });

//         // Enter any new nodes at the parent's previous position.
//         var nodeEnter = node.enter().append("g")
//             .attr("class", "node")
//             .attr("transform", function (d) {
//             return "translate(" + source.x0 + "," + source.y0 + ")";
//         })
//             .on("click", click);

//         nodeEnter.append("rect")
//             .attr("width", rectW)
//             .attr("height", rectH)
//             .attr("stroke", "black")
//             .attr("stroke-width", 1)
//             .style("fill", function (d) {
//             return d._children ? "lightsteelblue" : "#fff";
//         });

//         nodeEnter.append("text")
//             .attr("x", rectW / 2)
//             .attr("y", rectH / 2)
//             .attr("dy", ".35em")
//             .attr("text-anchor", "middle")
//             .text(function (d) {
//             return d.name;
//         });

//         // Transition nodes to their new position.
//         var nodeUpdate = node.transition()
//             .duration(duration)
//             .attr("transform", function (d) {
//             return "translate(" + d.x + "," + d.y + ")";
//         });

//         nodeUpdate.select("rect")
//             .attr("width", rectW)
//             .attr("height", rectH)
//             .attr("stroke", "black")
//             .attr("stroke-width", 1)
//             .style("fill", function (d) {
//             return d._children ? "lightsteelblue" : "#fff";
//         });

//         nodeUpdate.select("text")
//             .style("fill-opacity", 1);

//         // Transition exiting nodes to the parent's new position.
//         var nodeExit = node.exit().transition()
//             .duration(duration)
//             .attr("transform", function (d) {
//             return "translate(" + source.x + "," + source.y + ")";
//         })
//             .remove();

//         nodeExit.select("rect")
//             .attr("width", rectW)
//             .attr("height", rectH)
//         //.attr("width", bbox.getBBox().width)""
//         //.attr("height", bbox.getBBox().height)
//         .attr("stroke", "black")
//             .attr("stroke-width", 1);

//         nodeExit.select("text");

//         // Update the links…
//         var link = svg.selectAll("path.link")
//             .data(links, function (d) {
//             return d.target.id;
//         });

//         // Enter any new links at the parent's previous position.
//         link.enter().insert("path", "g")
//             .attr("class", "link")
//             .attr("x", rectW / 2)
//             .attr("y", rectH / 2)
//             .attr("d", function (d) {
//             var o = {
//                 x: source.x0,
//                 y: source.y0
//             };
//             return diagonal({
//                 source: o,
//                 target: o
//             });
//         });

//         // Transition links to their new position.
//         link.transition()
//             .duration(duration)
//             .attr("d", diagonal);

//         // Transition exiting nodes to the parent's new position.
//         link.exit().transition()
//             .duration(duration)
//             .attr("d", function (d) {
//             var o = {
//                 x: source.x,
//                 y: source.y
//             };
//             return diagonal({
//                 source: o,
//                 target: o
//             });
//         })
//             .remove();

//         // Stash the old positions for transition.
//         nodes.forEach(function (d) {
//             d.x0 = d.x;
//             d.y0 = d.y;
//         });
//     }

//     // Toggle children on click.
//     function click(d) {
//         if (d.children) {
//             d._children = d.children;
//             d.children = null;
//         } else {
//             d.children = d._children;
//             d._children = null;
//         }
//         update(d);
//     }

//     //Redraw for zoom
//     function redraw() {
//     //console.log("here", d3.event.translate, d3.event.scale);
//     svg.attr("transform",
//         "translate(" + d3.event.translate + ")"
//         + " scale(" + d3.event.scale + ")");
//     }
