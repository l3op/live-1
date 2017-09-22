const mongoose = require('mongoose')
let User = mongoose.model('User')
let Live = mongoose.model('Live')
const path = require("path")

module.exports = {
  find_lives: (request, response) => {
    Live.find({interests:  {$in: [request.body.name]}})
      .populate('_user')
      .exec()
      .then(data => {
        response.json({data: data, status: true})
      })
      .catch(error => response.json({data: error, status: false}))
  },
  user_interests: (request, response) => {
    User.findOne({_id: request.session.user_id})
      .then(data => {
        Live.find({$and: [{interests: {$in: data.interests}}, {_user: {$not: {$in: data._followings}}}, {_id: {$not: {$in: data._lives}}}, {_id: {$not: {$in: data._attending}}}  ] })
          .populate('_user')
          .exec()
          .then(data => {
            response.json({data: data, status: true})
          })
          .catch(error => response.json({data: error, status: false}))
      })
  }

}
