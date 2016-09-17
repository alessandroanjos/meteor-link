import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/links';
import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';

Meteor.startup(() => {
  // code to run on server at startup

  Meteor.publish('links', function(){
    return Links.find({

    });
  });
});

//Executed whenever a user visits with a route like
//'localhost:3000/abcd'
function onRoute(req, res, next){
  //take the token out odf the url and try to a find a
  //matching link in the links collection
const link = Links.findOne({token: req.params.token});

if(link) {
  //if we find a link object, redirect the user to the long url
  //link.clicks +=1;
  Links.update(link, { $inc: {clicks:1} });
  res.writeHead(307, { 'Location': link.url });
  res.end();
} else {
  //if we dont find a link object, send the user  to our normal Reactapp
  next();
}

}

const middleware = ConnectRoute(function(router) {
  router.get('/:token', onRoute);
  //(req) => console.log(req)
});

WebApp.connectHandlers.use(middleware);

//render in console req
//WebApp.connectHandlers.use(req => console.log(req));
