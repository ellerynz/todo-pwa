const express = require('express')
const bodyParser = require('body-parser')
const uuidv4 = require('uuid/v4')
const webpush = require('web-push')
const dotenv = require('dotenv')

dotenv.load()
const vapidEmail = process.env.VAPID_EMAIL;
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!process.env.VAPID_EMAIL || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log('-'.repeat(50));
  console.log('We need some extra information before beginning:');
  console.log("- Create a server/.env file");
  console.log("- Add your email as VAPID_EMAIL");
  console.log("- Add the following as VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY:");
  console.log(webpush.generateVAPIDKeys());
  console.log("Then run `yarn start` again :)")
  console.log('-'.repeat(50))
  return;
}

webpush.setVapidDetails(
  `mailto:${vapidEmail}`,
  vapidPublicKey,
  vapidPrivateKey
);

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

// Using these 'let's as a faux-db
let items = [
  { id: uuidv4(), item: 'Learn about PWAs' },
  { id: uuidv4(), item: 'Make an awesome app' }
]
let storedSubscription = null;

app.post('/subscribe', (req, res) => {
  console.log('/subscribe');
  storedSubscription = req.body;
  res.status(201).json({});
});

app.get('/vapid_public_key', (req, res) => {
  console.log('/vapid_public_key');
  res.json({ vapidPublicKey })
})

app.get('/items.json', (req, res) => {
  res.json(items)
})

app.post('/items.json', (req, res) => {
  items.push({
    id: uuidv4(),
    item: req.body.item
  })
  res.json(items)
  console.log('POST /items.json', req.body.item);
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
