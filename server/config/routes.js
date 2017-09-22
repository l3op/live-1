const user = require('../controllers/user.js')
const live = require('../controllers/live.js')
const interest = require('../controllers/interest.js')
const path = require('path')

module.exports = function (app) {
  app.post('/create_user', user.create_user)
  app.post('/validate_user', user.validate_user)
  app.post('/validate_fb_user', user.validate_fb_user)
  app.get('/current_user', user.current_user)
  app.get('/all_users', user.all_users)
  app.get('/follow_user/:id', user.follow_user)
  app.get('/unfollow_user/:id', user.unfollow_user)
  app.post('/follow_interest', user.follow_interest)
  app.post('/unfollow_interest', user.unfollow_interest)
  app.get('/user_attending', user.user_attending) //for home page 
  app.get('/all_user_attending', user.all_user_attending) //for profile
  app.get('/other_user_attending/:id', user.other_user_attending)
  app.get('/other_user_info/:id', user.other_user_info)
  app.get('/user_follow_data', user.user_follow_data)

  app.post('/create_live', live.create_live)
  app.get('/following_lives', live.following_lives)
  app.get('/attend/:id', live.attend)
  app.get('/unattend/:id', live.unattend)
  app.get('/find_live/:id', live.find_live)
  app.get('/all_lives', live.all_lives)
  app.get('/user_lives', live.user_lives)
  app.get('/delete_live/:id', live.delete_live)

  app.post('/find_interest', interest.find_lives)
  app.get('/user_interests', interest.user_interests)


  app.all('*', (request, response) => {
    response.sendFile(path.resolve('./client/dist/index.html'))
  })
}
