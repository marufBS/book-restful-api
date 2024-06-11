const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const port = 3001

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/library')
        console.log('Library Database Connected')

    } catch (error) {
        console.log('Library database is not connected')
        console.log(error.message)
        process.exit(1)
    }
}

const booksSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true
    },
    genre: String,
    description: String,
    publishedDate: Date
})

const Book = mongoose.model('books', booksSchema)



app.get('/', (req, res) => {
    res.send("Hello Book Management API's")
})

app.post('/api/books', async (req, res) => {
    try {
        const { title, author, genre, description, publishedDate } = req.body
        const item = new Book({
            title, author, genre, description, publishedDate
        })
        const savedItem = await item.save()
        if (savedItem) {
            res.status(201).send({
                success: true,
                message: 'Booked store Succeed',
                data: savedItem
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'Books collection missing'
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }

})

app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find()
        if (books) {
            res.status(201).send({
                success: true,
                message: 'returned all books',
                data: books
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'books not found'
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/api/books/:id', async (req, res) => {
    try {
        const id = req.params.id
        const searchedItem = await Book.find({ _id: id })
        if (searchedItem) {
            res.status(201).send({
                success: true,
                message: "Return desire product by id",
                data: searchedItem
            })
        } else {
            res.status(404).send({
                success: false,
                message: "This item not found",
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.delete('/api/books/:id', async (req, res) => {
    try {
        const id = req.params.id
        const deletedItem = await Book.findOneAndDelete({ _id: id })
        if (deletedItem) {
            res.status(201).send({
                success: true,
                message: "Book deleted Successfully",
                data: deletedItem
            })
        } else {
            res.status(404).send({
                success: false,
                message: "This item not found",
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})


app.listen(port, async () => {
    console.log(`Library server is running at http://localhost:${port}`)
    await connectDB()
})