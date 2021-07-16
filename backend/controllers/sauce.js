const { debug } = require('console');
const fs = require('fs');
const Sauce = require('../models/sauce');


exports.findSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
      };

exports.findOneSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};

exports.createSauce = (req, res, next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    });
    sauce.likes = 0;
    sauce.dislikes = 0;
    sauce.save()
    .then(() => res.status(200).json({message: "Sauce enregistrée"}))
    .catch(error => res.status(400).json({error}));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {        
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };

  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
  .then(() =>res.status(200).json({ message: 'Objet modifié'}))
  .catch(error => res.status(400).json({ error }));
  };


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };


  exports.likeSauce = (req, res, next) => {
Sauce.findOne({_id: req.params.id})
.then(sauce => {
  //console.log(req.body);
    if (req.body.like >0){
      sauce.usersDisliked.forEach(id => {

        if (id == req.body.userId){
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(id),1);
        }        
      });

      let found = false;
      sauce.usersLiked.forEach(id =>{
        if (id == req.body.userId){
          console.log('already liked');
          found = true
        }

      });
      if (found == false){
        sauce.usersLiked.push(req.body.userId);    
        sauce.likes ++;  
        if (sauce.dislikes > 0){
          sauce.dislikes --;  
        }

      }  
    } else if (req.body.like < 0){

      sauce.usersLiked.forEach(id => {

        if (id == req.body.userId){
          sauce.usersLiked.splice(sauce.usersDisliked.indexOf(id),1);
        }        
      });

      let found = false;
      sauce.usersDisliked.forEach(id =>{
        if (id == req.body.userId){
          found = true
        }

      });
      if (found == false){
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes ++;
        if(sauce.likes > 0){
          sauce.likes --;
        }
      }  
    }
    console.log(sauce);
    return Sauce.updateOne({_id: req.params.id}, {
      usersLiked : sauce.usersLiked,
      likes :sauce.likes,
      usersDisliked : sauce.usersDisliked, 
      dislikes : sauce.dislikes,
       _id: req.params.id})

})
.then(() =>res.status(200).json({ message: 'Appreciation prise en compte'}))
.catch(error => console.log(error) || res.status(400).json({error}));


};