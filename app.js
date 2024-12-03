const express = require('express')
const cors = require("cors")
const dotenv = require('dotenv')
const session = require('express-session')
const connection = require('./Config/db')
const societyRouter = require('./routes/SocietyRouter')
const societyHandlerRouter = require('./routes/SocietyHandlerRouter')
const wingRouter = require('./routes/WingRouter')
const unitRouter = require('./routes/UnitRouter')
const memberRouter = require('./routes/MemberRouter')
const importantRouter = require('./routes/ImportantRouter')
const maintenanceRouter = require('./routes/MaintenanceRouter')
const eventRouter = require('./routes/EventRouter')
const securityRouter = require('./routes/SecurityRouter')
const securityProtocolRouter = require('./routes/SecurityProtocolRouter')
const userRouter = require('./routes/UserRouter')
const eventDetailsRouter = require('./routes/EventDetalisRouter')
const maintenanceDetailsRouter = require('./routes/MaintenanceDetailsRouter')
const complaintRouter = require('./routes/ComplaintRouter')
const expanseRouter = require('./routes/ExpanseRouter')
const expanseNoteRouter = require('./routes/ExpanseNoteRouter')
const announcementRouter = require('./routes/AnnouncementRouter')
const visitorRouter = require('./routes/VisitorRouter')
const facilityRouter = require('./routes/FacilityRouter')
const { extractPublicId, httpSuccess } = require('./constents')
const { cloudinary } = require('./cloudinaryConfig')

dotenv.config()
const app = express()
// app.use(cors({
//   origin: '*',
//   credentials: true, 
// }))
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'https://your-production-url.com'];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json())
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

connection()

app.use("/society", societyRouter)
app.use("/society-handler", societyHandlerRouter)
app.use("/wing", wingRouter)
app.use("/unit", unitRouter)
app.use("/member", memberRouter)
app.use('/workernumber', importantRouter)
app.use('/maintain', maintenanceRouter)
app.use('/maintain-detail', maintenanceDetailsRouter)
app.use('/event', eventRouter)
app.use('/event-details', eventDetailsRouter)
app.use('/security', securityRouter)
app.use('/securityprotocol', securityProtocolRouter)
app.use('/user', userRouter)
app.use('/complain', complaintRouter)
app.use('/expanse', expanseRouter)
app.use('/expanseNote', expanseNoteRouter)
app.use('/announcement', announcementRouter)
app.use('/visitor', visitorRouter)
app.use('/facility', facilityRouter)


app.post('/image-details', async (req, res) => {
  try {
    const imageDetailsPromises = Object.entries(req.body).map(async ([key, url]) => {
      const publicId = extractPublicId(url);
      const result = await cloudinary.api.resource(publicId);
      return { key, details: result };
    });

    const results = await Promise.all(imageDetailsPromises);

    const formattedResults = results.reduce((acc, { key, details }) => {
      acc[key] = details;
      return acc;
    }, {});

    return res.status(200).send({ message: httpSuccess, data: formattedResults });
  } catch (error) {
    console.error('Error fetching image details:', error);
    return res.status(500).send({ message: 'Error fetching image details', error });
  }
});


app.get("/", (req, res) => {
  return res.status(200).send({ message: "Success" })
})

app.listen(process.env.PORT, () => {
  console.log("Server Started")
})
