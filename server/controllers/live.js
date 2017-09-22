const mongoose = require('mongoose')
let User = mongoose.model('User')
let Live = mongoose.model('Live')
const path = require("path")

module.exports = {
  create_live: (request, response) => {
    User.findOne({_id: request.session.user_id})
      .then(user => {
        let interests = []
        if(request.body.interests) {
          let word = []
          for(let interest of request.body.interests) {
            if(interest == ',') {
              interests.push(word.join(''))
              word = []
              continue
            }
            word.push(interest)
          }
          interests.push(word.join(''))
        }
        if(!interests.length) {
          interests.push('Others')
        }
        let live = new Live({title: request.body.title, date_time: request.body.date_time,
                  location: request.body.address, city: request.body.city,  _user: user._id, interests: interests,
                  latitude: request.body.latitude, longitude: request.body.longitude})
        if(request.files.image) {
          let file = request.files.image
          let file_type = file.mimetype.match(/image\/(\w+)/)
          var file_name = ''
          if(file_type) {
            file_name = `${user._id}${new Date().getTime()}.${file_type[1]}`
            file.mv(path.resolve(__dirname, '../../client/src/assets/lives', file_name), error => {  })
            live.image = file_name
          }
        }
        live.save()
          .then(data => {
            user._lives.push(data)
            user.save()
              .then(saved => {
                response.json(true)
              })
          })
      })
  },
  following_lives: (request, response) =>{
    var lives = []
    User.findOne({_id: request.session.user_id})
      .populate({
        path: '_followings',
        populate: {path: '_lives'}
      })
      .exec()
      .then(data => {
        response.json({data: data, status: true})
      })
  },
  attend: (request, response) => {
    Live.findOne({_id: request.params.id})
      .then(live => {
        User.findOne({_id: request.session.user_id})
          .then(user => {
            user._attending.push(live)
            user.save()
              .then(saved => {
                live._attendees.push(saved)
                live.save()
                  .then(data => {
                    response.json(true)
                  })
              })
          })
      })
  },
  unattend: (request, response) => {
    Live.findOne({_id: request.params.id})
      .then(live => {
        User.findOne({_id: request.session.user_id})
          .then(user => {
            let index = user._attending.indexOf(live._id)
            user._attending.splice(index, 1)
            user.save()
              .then(saved => {
                let index = live._attendees.indexOf(saved._id)
                live._attendees.splice(index, 1)
                live.save()
                  .then(data => {
                    response.json(true)
                  })
              })
          })
      })
  },
  find_live: (request, response) => {
    Live.findOne({_id: request.params.id})
      .populate({
        path: '_feeds',
        populate: {path: '_user'}
      })
      .populate('_user')
      .exec()
      .then(live => {
        if(live) {
          response.json({data: live, status: true})
        } else {
          response.json({status: false})
        }
      })
  },
  all_lives: (request, response) => {
    Live.find()
      .populate('_user')
      .exec()
      .then(data => {
        response.json(data)
      })
  },
  user_lives: (request, response) => {
    User.findOne({_id: request.session.user_id})
      .populate('_lives')
      .exec()
      .then(data => {
        response.json({data: data, status: true})
      })
  },
  delete_live: (request, response) => {
    Live.remove({_id: request.params.id}).then(() => {
      User.update({_id: request.session.user_id}, { $pull: { _lives: request.params.id} }).then(() => {
        User.update({},  { $pull: { _attending: request.params.id} }, {multi: true}).then(() => {
            response.json(true)
        })
      })
    })
  }
}
