const model = require('../models/Author');//mongoose model
const CustomAPIError = require('../errors/custom-error');

//search page (basic functionlity) to  search through our monogDb collection.
//this callback function will be used in 1.search page 2.profile page
const getAuthor =  async(req,res)=>{
    const {name} = req.query; 
        console.log(name);
    const author = await model.findOne({'_authName':name});
    if(!author)
    {
        throw new CustomAPIError('This author does not exists',404);
    }
    res.status(200).json({author});
}


const checkYear = (year,sy,ey)=>{
    for(i in year)
    {
        if(Number(year[i])>=Number(sy)&&Number(year[i])<Number(ey))
        {
            console.log("fuck")
            return 1;
        }
        else
        {
            return 0;
        }
    }
    // console.log("hello")
}
//this callback function will be used in 1.director page
const getspecifics = async (req, res) => {
    const { Syear, Eyear, publications } = req.query;
    const sy = Number(Syear);
    const ey = Number(Eyear);
    const pub = Number(publications);
    const result = await model.find({});
    if (!result) {
      throw new CustomAPIError("No result that matches your specifications", 404);
    }
  
    let object = result.filter((doc) => {
      let pubs = Number(doc._pub);
      let year = doc._year;
      let flag = 0;
      const n = year.length;
      for (let i = 0; i < n; i++) 
      {
          let y = Number(year[i]);
          if (y >= sy && y <= ey)
          {
        
              flag = 1;
              break
          }
          else
          {
              flag = 0;
              continue
          }
      }
      return (pubs >= pub && flag==1);
    });
    res.status(200).json({ result: object });
  };


const getall = async (req,res)=>{
    const result = await model.find({});
    res.status(200).json({result})
}

module.exports = {getAuthor,getspecifics,getall};