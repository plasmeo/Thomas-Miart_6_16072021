const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {

    //masquage de l'email
    let data = req.body.email;
    let buff = new Buffer.from(data);
    let userEmail = buff.toString('base64');

    //crytpage du mdp
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: userEmail,
          password: hash
        });        
        //enregistrement de l'utilisateur avec erreur s'il éxiste déja
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.login = (req, res, next) => {

    let data = req.body.email;
    let buff = new Buffer.from(data);
    let userEmail = buff.toString('base64');
//{email: req.body.email}
    User.findOne({email: userEmail})
    .then(user => {
        if (!user){
            return res.status(401).json({error: 'Utilisateur non trouvé'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid){
                return res.status(401).json({error: 'Mot de passe incorrect'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign({
                    userId: user._id
                },
                process.env.TOKEN,
                {
                    expiresIn: '24h'
                })
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
    };