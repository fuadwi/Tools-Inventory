const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const EIGHT_HOURS = 1000 * 60 * 60 * 8

const {
  PORT = 3000,
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh!quiet,it\'asecret!',
    SESS_LIFETIME = EIGHT_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production'
const users = [{
    id: 1,
    username: 'eng',
    email: 'eng@123.com',
    password: 'eng'
  },
  {
    id: 2,
    username: 'mgr',
    email: 'mgr@123.com',
    password: 'mgr'
  },
  {
    id: 3,
    username: 'mvr',
    email: 'mvr@123.com',
    password: 'mvr'
  },
  {
    id: 4,
    username: 'prod',
    email: 'prod@123.com',
    password: 'prod'
  },
  {
    id: 5,
    username: 'plan',
    email: 'plan@123.com',
    password: 'plan'
  },
  {
    id: 6,
    username: 'rms',
    email: 'rms@123.com',
    password: 'rms'
  },
  {
    id: 7,
    username: 'admin',
    email: 'admin@123.com',
    password: 'admin'
  }
]

const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD
  }
}), (express.static(__dirname))) //make all file as public access

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login')
  } else {
    next()
  }
}

app.use((req, res, next) => {
  const {
    userId
  } = req.session
  if (userId) {
    res.locals.user = users.find(
      user => user.id === userId
    )
  }
  next()
})


app.get('/', (req, res) => {
  const {
    userId
  } = req.session
  res.sendFile('index.html', {
    root: __dirname
  })
})
app.get('/main', (req, res) => {
  res.sendFile('/main.html', {
    root: __dirname
  })
})
app.get('/info', (req, res) => {
  res.sendFile('/info.html', {
    root: __dirname
  })
})
app.get('/warehouse', redirectLogin, (req, res) => {
  res.sendFile('/warehouse.html', {
    root: __dirname
  })
})
app.get('/prod', redirectLogin, (req, res) => {
  res.sendFile('/prod.html', {
    root: __dirname
  })
})
app.get('/mover', redirectLogin, (req, res) => {
  res.sendFile('/mover.html', {
    root: __dirname
  })
})
app.get('/planning', redirectLogin, (req, res) => {
  res.sendFile('/planning.html', {
    root: __dirname
  })
})
app.get('/engineer', redirectLogin, (req, res) => {
  res.sendFile('/engineer.html', {
    root: __dirname
  })
})
app.get('/manager', redirectLogin, (req, res) => {
  res.sendFile('/manager.html', {
    root: __dirname
  })
})
app.get('/login', (req, res) => {
  res.sendFile('/login.html', {
    root: __dirname
  })
})
app.get('/register', (req, res) => {
  res.sendFile('/register.html', {
    root: __dirname
  })
})

//Post   
app.post('/login', (req, res) => {
  const {
    username,
    password
  } = req.body
  if (username && password) {
    const user = users.find(
      user => user.username === username && user.password === password)
    if (user) {
      req.session.userId = user.id

      console.log(req.session.userId)
      switch (req.session.userId) {
        case 6:
          return res.redirect('/warehouse')
          break;
        case 5:
          return res.redirect('/planning')
          break;
        case 4:
          return res.redirect('/prod')
          break;
        case 3:
          return res.redirect('/mover')
          break;
        case 2:
          return res.redirect('/manager')
          break;
        case 1:
          return res.redirect('/engineer')
          break;
        case 7:
          return res.redirect('/main')
      }
    }
  }

  res.redirect('/login')

})


app.post('/register', (req, res) => {
  const {
    name,
    email,
    password
  } = req.body
  if (name && email && password) {
    const exist = users.some(
      user => user.email === email
    )
    if (!exist) {
      const user = {
        id: users.length + 1,
        name,
        password //todo
      }
      users.push(user)

      req.session.userId = user.id
      return res.redirect('/login')
    }
  }
  res.redirect('/register')
})
app.post('/logout', redirectLogin, (req, res) => {
  //const {user} = res.locals
  req.session.destroy(err => {
    if (err) {
      switch (req.session.userId) {
        case 6:
          return res.redirect('/warehouse')
          break;
        case 5:
          return res.redirect('/planning')
          break;
        case 4:
          return res.redirect('/prod')
          break;
        case 3:
          return res.redirect('/mover')
          break;
        case 2:
          return res.redirect('/manager')
          break;
        case 1:
          return res.redirect('/engineer')
          break;
          case 7:
          return res.redirect('/main')
      }


    }
    res.clearCookie(SESS_NAME)
    res.redirect('/login')
  })
})
app.listen(PORT, () => console.log(
  `http://localhost:${PORT}`
))


// var file = new static.Server();

// require('http').createServer(function(request, response) {
//   request.addListener('end', function() {
//     file.serve(request, response);
//   }).resume();
// }).listen(process.env.PORT || 5000);