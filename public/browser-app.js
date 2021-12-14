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
let namearray = [];

//INDEX FILE

const getname = async () => {

  let auth_name = document.querySelector("input").value;
  name = auth_name;
  const api = await fetch("/api/v1/all");
  const api_data = await api.json();
  const array_data = api_data.result;
 
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
      document.getElementById("index_faculty_name").textContent = auth_name;

      document.getElementById("index_email_id").textContent = auth_email_id;

      $("#index_dblp_id").attr("href", "faculty-profile.html");
      document.getElementById("index_dblp_id").textContent = "View Profile";
    }
  }
};


//for director page
const getauthors = async () => {
  let start_year = document.getElementById("start_year").value;
  let end_year = document.getElementById("end_year").value;
  let number_pub = document.getElementById("number_pub").value;

  const api = await fetch(
    `/api/V1/specifics?Syear=${start_year}&Eyear=${end_year}&publications=${number_pub}`
  );

  const api_data = await api.json();
  const array_data = api_data.result;


  //connecting to frontend

  /*making table*/

  res_buildTable();

  function res_buildTable() {
    var table = document.getElementById("res_myTable");
    table.innerHTML = "";
    for (var i = 0; i < array_data.length; i++) {
      //name = array_data[i]._authName
      namearray.push(array_data[i]._authName);
      var row = `<tr>
                        <td id="td"><a id="${array_data[i]._authName}" href="faculty-profile.html" onclick="viewprofile(this)">${array_data[i]._authName}</a></td>
                        <td id="td">${array_data[i]._email}</td>
                        <td id="td"><a href="${array_data[i]._dblp_id}">${array_data[i]._dblp_id}</td>
                        <td id="td">${array_data[i]._pub}</td>
                        </tr>`;
      table.innerHTML += row;
    }
  }
};

      const viewprofile = (evt) => {
          name = evt.id
      }






//fetching data and displaying it from dblp api
const getdata = async (name) => {
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

  //array of titles of publications
  const pubs = final.map((doc) => {
    return doc.info.title;
  });

  //array of years of publication published
  const year = final.map((doc) => {
    return doc.info.year;
  });


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
  
    return urls;
  }

  //Table data
  let cothors = co_authors;
  let url = urls;
  

  //publication tab
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
    }
  }

  

  /*wordcloud start*/
  var img = `./IMG/${name}.png`;
  document.getElementById("img").setAttribute("src", img);
    /*wordcloud end*/


};
getdata(name);
//GET YEAR FROM DBLP API

const getyear = async (name) => {

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
 
  const api = await fetch("/api/v1/all");
  const api_data = await api.json();
  const array_data = api_data.result;
 
  for (i in array_data) {
    if (array_data[i]._authName === name) {
      array_data[i]._year = await getyear(name);
    
      array_data[i]._pub = await getPublications(name);

    }
  }

  for (i in array_data) {
    if (array_data[i]._authName === name) {
      let auth_name = array_data[i]._authName;
      let auth_email_id = array_data[i]._email;
      let auth_dblp_id = array_data[i]._dblp_id;

      document.getElementById("faculty_name").textContent = auth_name;

      document.getElementById("email_id").textContent = auth_email_id;

      $("#dblp_id").attr("href", auth_dblp_id);
      
      document.getElementById("dblp_id").textContent = auth_dblp_id;
    }
  }
};

author(name);



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
  
  return co_authors;
};

const network = async (name) => {
  let data_array = await getCoauthors(name);
  
  let object = { name: name };
  let children = [];
  let temp = [];
  for (let i = 0; i < data_array.length; i++) {
    const filter = data_array[i].filter((obj) => {
      return obj != name;
    });
    filter.forEach((ele) => {
      if (temp.includes(ele)) {
        
      } else {
        temp.push(ele);
        children.push({ name: ele });
      }
    });
  }
  object.children = children;
  return object;
  
};