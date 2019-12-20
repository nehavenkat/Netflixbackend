const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const { check, validationResult, sanitizeBody } = require("express-validator")

const moviesJsonPath = path.join(__dirname, "movies.json")


const router = express.Router();

router.get("/", async (req, res)=>{
    res.send(await getmovies())
})

router.get("/:imdbID", async (req, res)=>{
    const movies = await getmovies()
    const movie = movies.find(b => b.imdbID === req.params.imdbID);
    if (movie)
        res.send(movie)
    else
        res.status(404).send("Not found")
})

router.post("/",
    [check("Title").exists().withMessage("Title is required"),
    check("Year").isNumeric().withMessage("year should be a number"),
    check("imdbID").exists().withMessage("You should specify the imdbID"),
    check("Type").exists().withMessage("Type is required"),
    check("Poster").exists().withMessage("Img is required")
]
    ,async(req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            res.status(400).send(errors)

        const movies = await getmovies()
        movies.push(req.body)
        await fs.writeFile(moviesJsonPath, JSON.stringify(movies))
        res.status(201).send("Created")
    })

router.put("/:imdbID", async(req, res)=>{
    const movies = await getmovies()
    const movie = movies.find(b => b.imdbID === req.params.imdbID);
    if (movie)
    {
        const position = movies.indexOf(movie);
        const movieUpdated = Object.assign(movie, req.body)
        movies[position] = movieUpdated;
        await fs.writeFile(moviesJsonPath, JSON.stringify(movies))
        res.status(200).send("Updated")
    }
    else
        res.status(404).send("Not found")
} )

router.delete("/:imdbID", async(req, res) => {
    const movies = await getmovies()
    const moviesToBeSaved = movies.filter(x => x.imdbID !== req.params.imdbID)
    if (moviesToBeSaved.length === movies.length)
        res.status(404).send("cannot find movie " + req.params.imdbID)
    else { 
        await fs.writeFile(moviesJsonPath, JSON.stringify(moviesToBeSaved))
        res.send("Deleted")
    }
})
const getmovies = async()=>{
    const buffer = await fs.readFile(moviesJsonPath);
    return JSON.parse(buffer.toString())
}


module.exports = router;