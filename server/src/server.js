const  { app} = require("./index")
const  { connect } = require("./config/db")
require("dotenv").config();
const PORT = 2244

app.listen(process.env.PORT || PORT, '0.0.0.0', async () => {
    await connect()
    console.log(`Listening on port ${PORT}`);
})
