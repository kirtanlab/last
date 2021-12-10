const model = require('../models/Author');




const getyear = async (name) => {
    // console.log(result)
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

    const year = final.map((doc) => {
        return doc.info.year;
    })

    console.log(year);
    return year;
}

const getPublications = async (name) => {
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

    const pubs = final.map((doc) => {
        return doc.info.title;
    })


    console.log(pubs);
    return pubs;
}


const getCoauthors = async (name) => {
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
        // console.log(flag);
    })
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

const updateAuthor = async (name) => {

        const new_data = {_year:getyear(),_pub:getPublications()}
        const author = await model.findOneAndUpdate({
            _authName: name
        }, new_data, {
            runValidators: true,
            new: true
        })
}

const traverse = async ()=>{
    try {
        
        const data = await model.find({});
        console.log(data);
    } catch (error) {
        console.log(error)
    }
}

traverse();