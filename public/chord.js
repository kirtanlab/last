am4core.useTheme(am4themes_animated);

var chart = am4core.create("chartdiv", am4charts.ChordDiagram);
chart.hiddenState.properties.opacity = 0;

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
  const main_graph_data = async(name)=>{
    console.log(name);
    let links_array  = []   //each object and each object has target:index(author) and source :index(author)
  
    const Coauthors = await main_getCoauthors(name);
    for(i in Coauthors)
    {
      const network_array = await main_getCoauthors(Coauthors[i])
      const temp = network_array.filter(auth =>{
        return Coauthors.includes(auth)
      })
      temp.forEach(ele => {
        links_array.push({to:ele,from:Coauthors[i],value:2})
      });
    
    }
    
    console.log(links_array);
    
    chart.data = links_array;

    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";

    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";

    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer
  
  }


main_graph_data(name)