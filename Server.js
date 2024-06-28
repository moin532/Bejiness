const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const { UserRoutes, 
    ProductRoutes, 
    OrderRoutes,
    PaymentRoutes,
    blogRoutes
} = require('./Modules/MainRouter');

const app = express()
const port = process.env.PORT || 5000;

//frontend
const _dirname = path.resolve()
const buildPath = path.join(_dirname, "./ClientSide/dist")
app.use(express.static(buildPath));


// CORS configuration
app.use(cors({
    origin: "*",
    allowedHeaders:['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/Modules/Views`));
app.use(express.static(`${__dirname}/ProductFiles`));

// for testing purpose

app.get('/api', (req, res) => {
    return res.status(200).send("Server working successfully... :)")
})

app.use('/api/users', UserRoutes)
app.use('/api/products', ProductRoutes)
app.use('/api/orders', OrderRoutes)
app.use('/api/payment', PaymentRoutes)
app.use('/api/v1',blogRoutes)

app.get('*', (req, res) => {
    return res.sendFile(path.join(buildPath, '/index.html'));
});

// start listening
app.listen(port, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`Server listening on http://127.0.0.1:${port}`)
    }
})
