let express = require('express');
let bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let moment = require('moment');
moment().format();

let SettingsBillFactory = require('./Settings-Bill-Factory');

let app = express();

let settingsBill = SettingsBillFactory()


app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: './views',
  layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  let determineLevel = ""
  if (settingsBill.getWarningLevel()) {
    determineLevel = "warning"
  } else if (settingsBill.getCriticalLevel()) {
    determineLevel = "danger"
  }
  res.render('index', {
    settings: settingsBill.getSettings(),
    totals: settingsBill.forTotals(),
    determineLevel
  })
});

app.post('/reset', function (req, res) {

  settingsBill.reset();
  res.render('index', {
    settings: settingsBill.getSettings(),
    totals: settingsBill.forTotals(),
  })
});

app.post('/settings', function (req, res) {

  settingsBill.setSettings({
    callCost: req.body.callCost,
    smsCost: req.body.smsCost,
    warningLevel: req.body.warningLevel,
    criticalLevel: req.body.criticalLevel
  })

  res.redirect('/');
});

app.post('/action', function (req, res) {
  settingsBill.keepRecordOfAction(req.body.actionType);
  res.redirect('/')
});

app.get('/actions', function (req, res) {
  let timeTrack = settingsBill.getListOfActions()
  for (let index = 0; index < timeTrack.length; index++) {
    let element = timeTrack[index];
    element.time = moment(element.timerecording).fromNow()
  }
  res.render('actions', { actions: timeTrack })
});

app.get('/actions/:type', function (req, res) {
  let type = req.params.type;
  let trackTime = settingsBill.getActionsFor(type)
  for (let index = 0; index < trackTime.length; index++) {
    let element = trackTime[index];
    element.time = moment(element.timerecording).fromNow()
  }
  res.render('actions', { actions: trackTime })
})

let PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('App starting on port:', PORT);
});