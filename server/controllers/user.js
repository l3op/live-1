const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
let User = mongoose.model('User')
let Live = mongoose.model('Live')

module.exports = {
  create_user: (request, response) => {
    User.findOne({email: request.body.email})
      .then(data => {
        if(data) {
          response.json(false)
        } else {
          var hashed = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(8))
          var user = new User({fullname: request.body.fullname, password: hashed, email: request.body.email})
          user.save()
            .then(saved => {
              request.session.user_id = saved._id
              response.json(true)
            })
            .catch(error => response.json({data: error, status: false}))
        }
      })
  },
  validate_user: (request, response) => {
    User.findOne({email: request.body.email})
      .then(data => {
        if(data) {

          if (bcrypt.compareSync(request.body.password, data.password)) {
            request.session.user_id = data._id
            response.json(true)
          } else {
            response.json(false)
          }
        } else {
          response.json(false)
        }
      })
      .catch(error => response.json({data: error, status: false}))
  },
  validate_fb_user: (request, response) => {
    User.findOne({email: request.body.email})
      .then(data => {
        if(data) {
          request.session.user_id = data._id
          response.json(true)
        } else {
          response.json(false)
        }
      })
      .catch(error => response.json({data: error, status: false}))
  },
  current_user: (request, response) => {
    User.findOne({_id: request.session.user_id})
      .then(data => {
        if(data) {
          response.json({data: data, status: true})
        } else {
          response.redirect('/')
        }
      })
  },
  all_users: (request, response) => {
    User.find({_id: {$ne: request.session.user_id}})
      .then(data => {
        response.json({data: data, status: true})
      })
      .catch(error => response.json({data: error, status: false}))
  },
  follow_user: (request, response) => {
    User.findOne({_id: request.session.user_id})
      .then(user_follower => {
        User.findOne({_id: request.params.id})
          .then(user_following => {
            user_following._followers.push(user_follower)
            user_following.save()
              .then(user1 => {
                user_follower._followings.push(user_following)
                user_follower.save()
                  .then(user2 => {
                    response.json({data: user1, status: true})
                  })
              })
          })
      })
      .catch(error => response.json(false))
  },
  unfollow_user: (request, response) => {
    User.findOne({_id: request.session.user_id})
      .then(user_unfollower => {
        User.findOne({_id: request.params.id})
          .then(user_unfollowing => {
            let index = user_unfollowing._followers.indexOf(user_unfollower._id)
            user_unfollowing._followers.splice(index, 1)
            user_unfollowing.save()
              .then(user1 => {
                let index = user_unfollower._followings.indexOf(user_unfollowing._id)
                user_unfollower._followings.splice(index, 1)
                user_unfollower.save()
                  .then(user2 => {
                    response.json({data: user1, status: true})
                  })
              })
          })
      })
      .catch(error => response.json(false))
  },
  follow_interest: (request, response) =>{
    User.findOne({_id: request.session.user_id})
      .then(user => {
        user.interests.push(request.body.name)
        user.save()
          .then(data => {
            response.json({data: data, status: true})
          })
      })
      .catch(error => response.json(false))
  },
  unfollow_interest: (request, response) => {
    User.findOne({_id: request.session.user_id})
      .then(user => {
        let index = user.interests.indexOf(request.body.name)
        user.interests.splice(index, 1)
        user.save()
          .then(data => {
            response.json({data: data, status: true})
          })
      })
      .catch(error => response.json(false))
  },
  all_user_attending: (request, response) => { //this is for user profile
    User.findOne({_id: request.session.user_id})
      .populate({
        path: '_attending',
        populate: { path: '_user' }
      })
      .exec()
      .then(data => {
        response.json({data: data, status: true})
      })
  },
  user_attending: (request, response) => { //this is for user home page
    User.findOne({_id: request.session.user_id})
      .then(data => {
        if(data) {
    Live.find({$and: [{_attendees: {$in: [data._id]}}, {_user: {$not: {$in: data._followings}}}  ] })
      .populate('_user')
      .exec()
      .then(data2 => {
        response.json({data: data2, status: true})
      })
        } else {
          response.redirect('/')
        }
      })
  },
  other_user_attending: (request, response) => {
    User.findOne({_id: request.params.id})
    .populate({
      path: '_attending',
      populate: {
        path: '_user'
      }
    })
      .exec()
      .then(data => {
        response.json({data: data, status: true})
      })
  },
  other_user_info: (request, response) => {
    User.findOne({_id: request.params.id})
      .populate('_followings')
      .populate('_followers')
      .populate({
        path: '_lives',
        populate: {
          path: '_user'
        }
      })
      .exec()
      .then(data => {
        response.json({data: data, status: true})
      })
  },
  user_follow_data: (request, repsonse) => {
    User.findOne({_id: request.session.user_id})
      .populate('_followings')
      .populate('_followers')
      .exec()
      .then(data => {
        repsonse.json({data: data, status: true})
      })
      .catch(error => {
        response.json({data: error, status: false})
      })
  }
}
