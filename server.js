const express = require("express")
const server = express()
const cors = require("cors")
server.use(express.json())
const listEndpoints = require("express-list-endpoints")
const moviesRouter = require("./src/movies/movies")
const commentsRouter = require("./src/comments/comments")
server.use(cors())
const port = process.env.PORT || 4000
const filerouter = require("./src/upload/upload")


server.use("/movies", moviesRouter)
server.use("/comments", commentsRouter)
server.use("/images" ,filerouter);
server.use(express.static('./public/images'))

server.listen(port, () => {
    console.log(listEndpoints(server))
    console.log(`We are running on localhost ${port}`)
})