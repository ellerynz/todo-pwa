const express = require('express')
const bodyParser = require('body-parser')
const uuidv4 = require('uuid/v4')
const webpush = require('web-push')
const dotenv = require('dotenv')

dotenv.load()
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails('mailto:YOLO@SWAGGINS.io', publicVapidKey, privateVapidKey);

const app = express()
const port = 4567

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let items = [
  { id: uuidv4(), item: 'Learn about PWAs' },
  { id: uuidv4(), item: 'Make an awesome app' }
]

let storedSubscription = null;

app.post('/subscribe', (req, res) => {
  storedSubscription = req.body;
  res.status(201).json({});
});

app.get('/items.json', (req, res) => {
  res.json(items)
})

app.post('/items.json', (req, res) => {
  items.push({
    id: uuidv4(),
    item: req.body.item
  })
  res.json(items)

  const payload = JSON.stringify({
    title: 'Item added',
    text: req.body.item,
  });
  webpush.sendNotification(storedSubscription, payload).catch(error => {
    console.error(error.stack);
  });
})

app.delete('/items.json', (req, res) => {
  items = items.filter(item => {
    if(item.id !== req.body.id) {
      return item
    }
  })
  res.json(items)
})

app.listen(port, () => console.log(`Todo server listening on port ${port}!`))
