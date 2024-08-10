import express, { json } from "express"
const app=express()
import { config } from "dotenv"
import MongoDB from "./dbconnect/db.js"
import { registercontroller } from "./service/registerservice.js"
import { logincontroller } from "./service/loginservice.js"
import { updatecontroller } from "./service/updateservice.js"
import { deletecontroller } from "./service/deleteservice.js"
import { specificPointController } from "./service/specificpointservice.js"
import { radiusrange } from "./service/radiusrange.js"
config()
app.use(json())


//api's
app.get('/',(req,res)=>{
    res.json({
        message:"Test API"
    })
})

//register
app.post('/register',registercontroller)

//loggedin
app.post('/login',logincontroller)

//updateidpass

app.put('/update',updatecontroller)


//deleteuser

app.delete('/delete',deletecontroller)


//getting restraunt near to a specific point(one radius)

app.get('/specificpoint',specificPointController)


//getting restraunt near to within specific radius range(min radius) to (masx radius)

app.get('/radiusrange',radiusrange)


app.listen(process.env.PORT,()=>{
    MongoDB()
    console.log(`Express is running at ${process.env.PORT}`);
    
})