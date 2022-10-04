const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    _userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

  sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    .catch(error => { res.status(400).json({ message: error.message }) })
};




exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.thing),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce._userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};


exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


// la fonction GET pour afficher les information d'une sauce 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(  
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
  };

// la fonction post pour ajouter des likes et dislikes sur les sauces et pour les retires 
  exports.likeSauce = (req, res, next) => {

    const idSauce = req.params.id;
    const like = req.body.like;
    // Garantir que la sauce est disponible 
    Sauce.findOne({ _id: idSauce }).then(sauce => {
      switch (like) {
        //Liker une sauce
        case 1:
          Sauce.updateOne({ _id: idSauce }, {
            $inc: { likes: 1 },
            $push: { usersLiked: req.auth._userId },
          })
            .then(() => { res.status(200).json({ message: 'Sauce liked' }) })
            .catch((error) => { res.status(400).json({ message: error.message }) });
          break;

        //Disliker une sauce
        case -1:
          Sauce.updateOne({ _id: idSauce }, {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.auth._userId },
          })
            .then(() => { res.status(200).json({ message: 'Sauce Disliked' }) })
            .catch((error) => { res.status(400).json({ message: error.message }) });
          break;

        //Retirer like
        case 0:

          if (sauce.usersLiked.find(user => user === req.auth._userId)) {
            Sauce.updateOne({ _id: idSauce }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.auth._userId },
            })
              .then(() => { res.status(200).json({ message: 'Like retiré' }) })
              .catch((error) => { res.status(400).json({ message: error.message }) })
          }

          //Retirer Dislike
          if (sauce.usersDisliked.find(user => user === req.auth._userId)) {
            Sauce.updateOne({ _id: idSauce }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.auth._userId },
            })
              .then(() => { res.status(200).json({ message: 'Dislike retiré' }) })
              .catch((error) => { res.status(400).json({ message: error.message }) })
          }
          break;
        default:
          res.status(400).json({ message: "Valeur erronée de like!!" });
          break;

      }
    })
      .catch(error => {
        res.status(404).json({ message: error.message });
      });
};