const mongoose = require('mongoose')
let User = mongoose.model('User')
let Live = mongoose.model('Live')
let Post = mongoose.model('Post')

module.exports = function (server) {
  const io = require('socket.io').listen(server)
  io.sockets.on('connection', function (socket) {

    socket.on('post', data => {

      User.findOne({_id: data.user_id})
        .then(user => {
          Live.findOne({_id: data.live_id})
            .then(live => {
              var post = new Post({content: data.post, _user: user, _live: live})
              post.save()
                .then(post => {
                  user._feeds.push(post)
                  user.save()
                    .then(saved_user => {
                      live._feeds.push(post)
                      live.save()
                        .then(saved_live => {
                          Live.populate(saved_live, {path: '_feeds', populate: {path: '_user'}})
                            .then(resaved_live => {
                              socket.broadcast.emit('new_post', post) //sending the new post
                              socket.emit('user_post', post) //sending all posts from the live
                            })
                        })
                    })
                })
            })
        })

    })


  })
}
